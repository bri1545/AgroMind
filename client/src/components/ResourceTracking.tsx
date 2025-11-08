import { Tractor, Droplets, Zap, Box } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Resource {
  id: string;
  name: string;
  type: "equipment" | "water" | "fertilizer" | "feed";
  total: number;
  used: number;
  unit: string;
}

interface ResourceTrackingProps {
  resources: Resource[];
}

export default function ResourceTracking({ resources }: ResourceTrackingProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "equipment":
        return <Tractor className="w-5 h-5" />;
      case "water":
        return <Droplets className="w-5 h-5" />;
      case "fertilizer":
        return <Zap className="w-5 h-5" />;
      case "feed":
        return <Box className="w-5 h-5" />;
      default:
        return <Box className="w-5 h-5" />;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Resource Tracking</h3>
      <div className="space-y-4">
        {resources.map((resource) => {
          const percentage = (resource.used / resource.total) * 100;
          const isLow = percentage > 75;

          return (
            <div key={resource.id} className="space-y-2" data-testid={`resource-${resource.id}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(resource.type)}
                  <span className="font-medium text-sm">{resource.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {resource.used} / {resource.total} {resource.unit}
                </span>
              </div>
              <Progress
                value={percentage}
                className={isLow ? "bg-destructive/20" : ""}
                data-testid={`progress-${resource.id}`}
              />
              {isLow && (
                <p className="text-xs text-destructive">Low stock - consider restocking</p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
