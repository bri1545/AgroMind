import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async getAgriculturalAdvice(
    userMessage: string,
    context: {
      weather?: any;
      fieldData?: any;
      cropType?: string;
    }
  ): Promise<string> {
    const systemPrompt = `You are an AI agricultural consultant named AgroMind. You work alongside a weather monitoring AI to provide expert farming advice. 

Your role:
- Provide practical, actionable agricultural advice
- Consider current weather conditions and forecasts
- Adapt recommendations based on crop type, soil conditions, and local climate
- Use clear, conversational language
- Give specific recommendations with reasoning
- Focus on optimizing yield while managing risks

Current context:
${context.weather ? `Weather: Temperature ${context.weather.temperature}°C, Humidity ${context.weather.humidity}%, Wind ${context.weather.windSpeed} m/s` : ""}
${context.cropType ? `Crop: ${context.cropType}` : ""}
${context.fieldData ? `Field data: ${JSON.stringify(context.fieldData)}` : ""}

Respond concisely but informatively. Use bullet points for multiple recommendations.`;

    const prompt = `${systemPrompt}\n\nUser question: ${userMessage}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("Failed to get AI response");
    }
  }

  async analyzeFieldConditions(fieldData: any, weather: any): Promise<string> {
    const prompt = `As an agricultural AI, analyze these field conditions and provide recommendations:

Field: ${fieldData.name} (${fieldData.area} hectares)
Crop: ${fieldData.cropType || "Not specified"}
Current Weather: ${weather.temperature}°C, ${weather.humidity}% humidity, ${weather.windSpeed} m/s wind
${fieldData.ndvi ? `NDVI: ${fieldData.ndvi}` : ""}
${fieldData.soilMoisture ? `Soil Moisture: ${fieldData.soilMoisture}%` : ""}

Provide:
1. Current field health assessment
2. Immediate action recommendations
3. Risk factors to monitor
4. Optimal timing for next activities

Be specific and actionable.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API error:", error);
      throw new Error("Failed to analyze field conditions");
    }
  }
}

export const geminiService = new GeminiService(process.env.GEMINI_API_KEY || "");
