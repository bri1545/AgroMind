import LivestockMonitor from "../LivestockMonitor";

export default function LivestockMonitorExample() {
  const mockGroups = [
    {
      id: "1",
      name: "Dairy Cows - Barn A",
      count: 45,
      temperature: 24,
      humidity: 62,
      status: "comfortable" as const,
    },
    {
      id: "2",
      name: "Dairy Cows - Barn B",
      count: 38,
      temperature: 29,
      humidity: 68,
      status: "stress" as const,
      recommendation:
        "Temperature exceeds 28°C. Increase ventilation and ensure adequate water supply to prevent heat stress.",
    },
  ];

  return <LivestockMonitor groups={mockGroups} />;
}
