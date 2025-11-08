import { Cloud, Droplets, Wind, Sun, Thermometer, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  uvIndex: number;
  condition: string;
  alert?: {
    type: string;
    severity: "warning" | "info" | "error";
    message: string;
  };
}

interface WeatherOverviewProps {
  data: WeatherData;
  onDismissAlert?: () => void;
}

export default function WeatherOverview({ data, onDismissAlert }: WeatherOverviewProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "border-destructive";
      case "warning":
        return "border-chart-2";
      case "info":
        return "border-chart-3";
      default:
        return "border-border";
    }
  };

  return (
    <div className="space-y-6">
      {data.alert && (
        <Card className={`p-4 border-l-4 ${getSeverityColor(data.alert.severity)}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-chart-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">{data.alert.type}</p>
                <p className="text-sm text-muted-foreground mt-1">{data.alert.message}</p>
              </div>
            </div>
            {onDismissAlert && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDismissAlert}
                data-testid="button-dismiss-alert"
              >
                Закрыть
              </Button>
            )}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Обзор погоды</h2>
            <p className="text-sm text-muted-foreground mt-1">{data.condition}</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-mono font-bold" data-testid="text-temperature">
              {data.temperature}°
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Droplets className="w-4 h-4" />
              <span className="text-sm">Влажность</span>
            </div>
            <p className="text-xl font-mono font-semibold" data-testid="text-humidity">
              {data.humidity}%
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wind className="w-4 h-4" />
              <span className="text-sm">Ветер</span>
            </div>
            <p className="text-xl font-mono font-semibold" data-testid="text-wind-speed">
              {data.windSpeed} м/с
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Cloud className="w-4 h-4" />
              <span className="text-sm">Осадки</span>
            </div>
            <p className="text-xl font-mono font-semibold" data-testid="text-precipitation">
              {data.precipitation} мм
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sun className="w-4 h-4" />
              <span className="text-sm">УФ индекс</span>
            </div>
            <p className="text-xl font-mono font-semibold" data-testid="text-uv-index">
              {data.uvIndex}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
