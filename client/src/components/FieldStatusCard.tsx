import { MapPin, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FieldStatusCardProps {
  id: string;
  name: string;
  area: number;
  cropType: string;
  status: "healthy" | "warning" | "critical";
  ndvi?: number;
  soilMoisture?: number;
  yieldForecast?: number;
  onViewDetails?: () => void;
}

export default function FieldStatusCard({
  id,
  name,
  area,
  cropType,
  status,
  ndvi,
  soilMoisture,
  yieldForecast,
  onViewDetails,
}: FieldStatusCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "healthy":
        return "bg-chart-1 text-white";
      case "warning":
        return "bg-chart-2 text-white";
      case "critical":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Card className="p-6 hover-elevate" data-testid={`card-field-${id}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold" data-testid={`text-field-name-${id}`}>
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{area} ha</span>
          </div>
        </div>
        <Badge className={getStatusColor()} data-testid={`badge-status-${id}`}>
          {status}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Crop Type</span>
          <span className="font-medium">{cropType}</span>
        </div>

        {ndvi !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">NDVI</span>
            <span className="font-mono font-semibold">{ndvi.toFixed(2)}</span>
          </div>
        )}

        {soilMoisture !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Soil Moisture</span>
            <span className="font-mono font-semibold">{soilMoisture}%</span>
          </div>
        )}

        {yieldForecast !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Yield Forecast</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-chart-1" />
              <span className="font-mono font-semibold">{yieldForecast} t/ha</span>
            </div>
          </div>
        )}
      </div>

      {onViewDetails && (
        <Button
          variant="outline"
          className="w-full"
          size="sm"
          onClick={onViewDetails}
          data-testid={`button-view-details-${id}`}
        >
          View Details
        </Button>
      )}
    </Card>
  );
}
