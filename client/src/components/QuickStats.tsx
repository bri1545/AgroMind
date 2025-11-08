import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Stat {
  id: string;
  label: string;
  value: string;
  change?: number;
  trend?: "up" | "down";
}

interface QuickStatsProps {
  stats: Stat[];
}

export default function QuickStats({ stats }: QuickStatsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.id} className="space-y-1" data-testid={`stat-${stat.id}`}>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-mono font-bold" data-testid={`stat-value-${stat.id}`}>
                {stat.value}
              </p>
              {stat.change !== undefined && stat.trend && (
                <div
                  className={`flex items-center gap-1 text-sm ${
                    stat.trend === "up" ? "text-chart-1" : "text-destructive"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
