import QuickStats from "../QuickStats";

export default function QuickStatsExample() {
  const mockStats = [
    {
      id: "1",
      label: "Total Fields",
      value: "8",
      change: 0,
      trend: "up" as const,
    },
    {
      id: "2",
      label: "Active Alerts",
      value: "2",
      change: -25,
      trend: "down" as const,
    },
    {
      id: "3",
      label: "Avg. NDVI",
      value: "0.74",
      change: 8,
      trend: "up" as const,
    },
    {
      id: "4",
      label: "Water Usage",
      value: "25%",
      change: 12,
      trend: "up" as const,
    },
  ];

  return <QuickStats stats={mockStats} />;
}
