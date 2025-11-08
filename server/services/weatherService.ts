interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  uvIndex: number;
  condition: string;
  pressure: number;
  feelsLike: number;
}

interface WeatherAlert {
  type: string;
  severity: "info" | "warning" | "error";
  message: string;
  recommendation: string;
}

export class WeatherService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 10) / 10,
      precipitation: data.rain?.["1h"] || 0,
      uvIndex: 0,
      condition: data.weather[0].main,
      pressure: data.main.pressure,
      feelsLike: Math.round(data.main.feels_like),
    };
  }

  async getForecast(lat: number, lon: number): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.statusText}`);
    }

    return await response.json();
  }

  analyzeWeatherRisks(weather: WeatherData, forecast?: any): WeatherAlert | null {
    if (weather.temperature > 35) {
      return {
        type: "Extreme Heat Warning",
        severity: "error",
        message: `Temperature is ${weather.temperature}°C. Extreme heat conditions detected.`,
        recommendation: "Avoid field work during peak hours. Ensure adequate water supply for livestock and irrigation systems. Monitor animals for heat stress.",
      };
    }

    if (weather.temperature < 0) {
      return {
        type: "Frost Alert",
        severity: "error",
        message: `Temperature is ${weather.temperature}°C. Frost conditions detected.`,
        recommendation: "Protect sensitive crops. Consider covering young plants. Delay irrigation to prevent ice formation.",
      };
    }

    if (weather.windSpeed > 15) {
      return {
        type: "High Wind Warning",
        severity: "warning",
        message: `Wind speed is ${weather.windSpeed} m/s. Strong winds detected.`,
        recommendation: "Postpone spraying operations. Secure loose equipment. Check greenhouse structures and polytunnels.",
      };
    }

    if (weather.humidity < 30) {
      return {
        type: "Low Humidity Alert",
        severity: "warning",
        message: `Humidity is ${weather.humidity}%. Very dry conditions.`,
        recommendation: "Increase irrigation frequency. Monitor soil moisture levels. Consider anti-transpirant treatments for crops.",
      };
    }

    if (weather.humidity > 85 && weather.temperature > 20) {
      return {
        type: "Disease Risk Alert",
        severity: "warning",
        message: `High humidity (${weather.humidity}%) and warm temperatures create favorable conditions for plant diseases.`,
        recommendation: "Monitor crops for fungal diseases. Consider preventive fungicide application. Improve air circulation in greenhouses.",
      };
    }

    return null;
  }
}

export const weatherService = new WeatherService(process.env.OPENWEATHER_API_KEY || "");
