import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { weatherService } from "./services/weatherService";
import { geminiService } from "./services/geminiService";
import { insertFieldSchema, insertWeatherAlertSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch("/api/auth/user/role", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role } = req.body;
      const validRoles = ["farmer", "agronomist", "livestock_specialist"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be: farmer, agronomist, or livestock_specialist" });
      }
      const user = await storage.updateUserRole(userId, role);
      res.json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  app.get("/api/fields", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userFields = await storage.getFieldsByUserId(userId);
      res.json(userFields);
    } catch (error) {
      console.error("Error fetching fields:", error);
      res.status(500).json({ message: "Failed to fetch fields" });
    }
  });

  app.post("/api/fields", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const fieldData = insertFieldSchema.parse({ ...req.body, userId });
      const field = await storage.createField(fieldData);
      res.json(field);
    } catch (error) {
      console.error("Error creating field:", error);
      res.status(400).json({ message: "Invalid field data" });
    }
  });

  app.get("/api/fields/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const field = await storage.getField(req.params.id);
      if (!field) {
        return res.status(404).json({ message: "Field not found" });
      }
      if (field.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(field);
    } catch (error) {
      console.error("Error fetching field:", error);
      res.status(500).json({ message: "Failed to fetch field" });
    }
  });

  app.patch("/api/fields/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const field = await storage.getField(req.params.id);
      if (!field) {
        return res.status(404).json({ message: "Field not found" });
      }
      if (field.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const { userId: _, ...updateData } = req.body;
      const updatedField = await storage.updateField(req.params.id, updateData);
      res.json(updatedField);
    } catch (error) {
      console.error("Error updating field:", error);
      res.status(500).json({ message: "Failed to update field" });
    }
  });

  app.delete("/api/fields/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const field = await storage.getField(req.params.id);
      if (!field) {
        return res.status(404).json({ message: "Field not found" });
      }
      if (field.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      await storage.deleteField(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting field:", error);
      res.status(500).json({ message: "Failed to delete field" });
    }
  });

  app.get("/api/weather/:lat/:lon", isAuthenticated, async (req: any, res) => {
    try {
      const lat = parseFloat(req.params.lat);
      const lon = parseFloat(req.params.lon);
      const weather = await weatherService.getWeatherByCoordinates(lat, lon);
      const alert = weatherService.analyzeWeatherRisks(weather);
      res.json({ weather, alert });
    } catch (error) {
      console.error("Error fetching weather:", error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  app.get("/api/forecast/:lat/:lon", isAuthenticated, async (req: any, res) => {
    try {
      const lat = parseFloat(req.params.lat);
      const lon = parseFloat(req.params.lon);
      const forecast = await weatherService.getForecast(lat, lon);
      res.json(forecast);
    } catch (error) {
      console.error("Error fetching forecast:", error);
      res.status(500).json({ message: "Failed to fetch forecast data" });
    }
  });

  app.post("/api/ai/chat", isAuthenticated, async (req: any, res) => {
    try {
      const { message, context } = req.body;
      const response = await geminiService.getAgriculturalAdvice(message, context);
      res.json({ response });
    } catch (error) {
      console.error("Error getting AI response:", error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  app.post("/api/ai/analyze-field", isAuthenticated, async (req: any, res) => {
    try {
      const { fieldData, weather } = req.body;
      const analysis = await geminiService.analyzeFieldConditions(fieldData, weather);
      res.json({ analysis });
    } catch (error) {
      console.error("Error analyzing field:", error);
      res.status(500).json({ message: "Failed to analyze field" });
    }
  });

  app.get("/api/alerts/field/:fieldId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const field = await storage.getField(req.params.fieldId);
      if (!field) {
        return res.status(404).json({ message: "Field not found" });
      }
      if (field.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const alerts = await storage.getAlertsByFieldId(req.params.fieldId);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const alertData = insertWeatherAlertSchema.parse(req.body);
      const field = await storage.getField(alertData.fieldId);
      if (!field || field.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const alert = await storage.createWeatherAlert(alertData);
      res.json(alert);
    } catch (error) {
      console.error("Error creating alert:", error);
      res.status(400).json({ message: "Invalid alert data" });
    }
  });

  app.delete("/api/alerts/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const alert = await storage.getAlert(req.params.id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      const field = await storage.getField(alert.fieldId);
      if (!field || field.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      await storage.deleteAlert(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting alert:", error);
      res.status(500).json({ message: "Failed to delete alert" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
