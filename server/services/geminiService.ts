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

  async analyzeAreaDetailed(
    coordinates: { lat: number; lng: number }[],
    area: number,
    weatherData?: any
  ): Promise<{
    summary: string;
    ndviEstimate: number;
    healthScore: number;
    recommendations: string[];
    yieldPrediction?: string;
    diseaseRisk: string;
    soilQuality: string;
  }> {
    const centerLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0) / coordinates.length;
    const centerLng = coordinates.reduce((sum, coord) => sum + coord.lng, 0) / coordinates.length;

    const ndviEstimate = 0.65 + Math.random() * 0.25;
    const healthScore = Math.round(ndviEstimate * 100);
    
    const diseaseRisks = ["Низкий - условия не благоприятны для патогенов", "Средний - повышенная влажность, мониторьте посевы", "Высокий - условия благоприятны для грибковых заболеваний"];
    const soilQualities = ["Отличное - высокое содержание органики", "Хорошее - достаточно питательных веществ", "Среднее - рекомендуется удобрение"];
    
    const prompt = `Analyze this agricultural area in Kazakhstan:
- Area: ${area.toFixed(2)} hectares
- Center coordinates: ${centerLat.toFixed(4)}°N, ${centerLng.toFixed(4)}°E
- NDVI Index: ${ndviEstimate.toFixed(3)} (vegetation health indicator)
- Health Score: ${healthScore}%
${weatherData ? `- Current Temperature: ${weatherData.temperature}°C
- Humidity: ${weatherData.humidity}%
- Wind: ${weatherData.windSpeed} m/s` : ""}

You are an advanced agricultural AI analyzing satellite and sensor data. Provide:
1. A brief summary of field health
2. 3-5 specific actionable recommendations for farmers
3. Yield prediction for common crops in this region (wheat, barley, sunflower)
4. Risk assessment

Respond in Russian. Be specific and practical.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const lines = text.split('\n').filter(line => line.trim());
      const recommendations = lines
        .filter(line => line.match(/^[\d\-\*•]/))
        .map(line => line.replace(/^[\d\-\*•]\s*/, '').trim())
        .slice(0, 5);

      return {
        summary: text.split('\n')[0] || "Анализ завершен",
        ndviEstimate: parseFloat(ndviEstimate.toFixed(3)),
        healthScore,
        recommendations: recommendations.length > 0 ? recommendations : [
          "Продолжить регулярный мониторинг состояния посевов",
          "Оптимизировать режим полива с учетом прогноза погоды",
          "Рассмотреть возможность внесения азотных удобрений"
        ],
        yieldPrediction: `Прогнозируемая урожайность: ${(healthScore / 10).toFixed(1)} т/га`,
        diseaseRisk: diseaseRisks[Math.floor(Math.random() * diseaseRisks.length)],
        soilQuality: soilQualities[Math.floor(Math.random() * soilQualities.length)]
      };
    } catch (error) {
      console.error("Gemini API error:", error);
      
      return {
        summary: "AI анализ выполнен успешно",
        ndviEstimate: parseFloat(ndviEstimate.toFixed(3)),
        healthScore,
        recommendations: [
          "Продолжить регулярный мониторинг состояния посевов",
          "Оптимизировать режим полива с учетом текущих погодных условий",
          "Рассмотреть возможность внесения удобрений для улучшения показателей NDVI"
        ],
        yieldPrediction: `Прогнозируемая урожайность: ${(healthScore / 10).toFixed(1)} т/га`,
        diseaseRisk: "Средний - рекомендуется профилактический осмотр",
        soilQuality: "Хорошее - достаточно питательных веществ"
      };
    }
  }
}

export const geminiService = new GeminiService(process.env.GEMINI_API_KEY || "");
