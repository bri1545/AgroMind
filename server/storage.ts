import { type User, type UpsertUser, type Field, type InsertField, type WeatherAlert, type InsertWeatherAlert, users, fields, weatherAlerts } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(id: string, role: string): Promise<User | undefined>;
  
  createField(field: InsertField): Promise<Field>;
  getFieldsByUserId(userId: string): Promise<Field[]>;
  getField(id: string): Promise<Field | undefined>;
  updateField(id: string, field: Partial<InsertField>): Promise<Field | undefined>;
  deleteField(id: string): Promise<void>;
  
  createWeatherAlert(alert: InsertWeatherAlert): Promise<WeatherAlert>;
  getAlertsByFieldId(fieldId: string): Promise<WeatherAlert[]>;
  getAlert(id: string): Promise<WeatherAlert | undefined>;
  getRecentAlerts(limit?: number): Promise<WeatherAlert[]>;
  deleteAlert(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(id: string, role: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createField(field: InsertField): Promise<Field> {
    const [newField] = await db.insert(fields).values(field).returning();
    return newField;
  }

  async getFieldsByUserId(userId: string): Promise<Field[]> {
    return await db.select().from(fields).where(eq(fields.userId, userId));
  }

  async getField(id: string): Promise<Field | undefined> {
    const [field] = await db.select().from(fields).where(eq(fields.id, id));
    return field;
  }

  async updateField(id: string, fieldData: Partial<InsertField>): Promise<Field | undefined> {
    const [field] = await db
      .update(fields)
      .set(fieldData)
      .where(eq(fields.id, id))
      .returning();
    return field;
  }

  async deleteField(id: string): Promise<void> {
    await db.delete(fields).where(eq(fields.id, id));
  }

  async createWeatherAlert(alert: InsertWeatherAlert): Promise<WeatherAlert> {
    const [newAlert] = await db.insert(weatherAlerts).values(alert).returning();
    return newAlert;
  }

  async getAlertsByFieldId(fieldId: string): Promise<WeatherAlert[]> {
    return await db
      .select()
      .from(weatherAlerts)
      .where(eq(weatherAlerts.fieldId, fieldId))
      .orderBy(desc(weatherAlerts.createdAt));
  }

  async getAlert(id: string): Promise<WeatherAlert | undefined> {
    const [alert] = await db.select().from(weatherAlerts).where(eq(weatherAlerts.id, id));
    return alert;
  }

  async getRecentAlerts(limit: number = 10): Promise<WeatherAlert[]> {
    return await db
      .select()
      .from(weatherAlerts)
      .orderBy(desc(weatherAlerts.createdAt))
      .limit(limit);
  }

  async deleteAlert(id: string): Promise<void> {
    await db.delete(weatherAlerts).where(eq(weatherAlerts.id, id));
  }
}

export const storage = new DatabaseStorage();
