import { ThermometerSun, Droplets, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LivestockGroup {
  id: string;
  name: string;
  count: number;
  temperature: number;
  humidity: number;
  status: "comfortable" | "stress" | "critical";
  recommendation?: string;
}

interface LivestockMonitorProps {
  groups: LivestockGroup[];
}

export default function LivestockMonitor({ groups }: LivestockMonitorProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "comfortable":
        return "bg-chart-1 text-white";
      case "stress":
        return "bg-chart-2 text-white";
      case "critical":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Livestock Monitoring</h3>
      <div className="space-y-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="p-4 border rounded-lg space-y-3"
            data-testid={`livestock-${group.id}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{group.name}</h4>
                <p className="text-sm text-muted-foreground">{group.count} animals</p>
              </div>
              <Badge className={getStatusColor(group.status)} data-testid={`badge-livestock-status-${group.id}`}>
                {group.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <ThermometerSun className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Temperature</p>
                  <p className="font-mono font-semibold">{group.temperature}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Humidity</p>
                  <p className="font-mono font-semibold">{group.humidity}%</p>
                </div>
              </div>
            </div>

            {group.recommendation && (
              <div className="flex gap-2 p-2 bg-muted rounded-md">
                <AlertCircle className="w-4 h-4 text-chart-2 flex-shrink-0 mt-0.5" />
                <p className="text-xs">{group.recommendation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
