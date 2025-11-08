import ResourceTracking from "../ResourceTracking";

export default function ResourceTrackingExample() {
  const mockResources = [
    {
      id: "1",
      name: "Tractors Available",
      type: "equipment" as const,
      total: 5,
      used: 3,
      unit: "units",
    },
    {
      id: "2",
      name: "Water Supply",
      type: "water" as const,
      total: 50000,
      used: 12500,
      unit: "L",
    },
    {
      id: "3",
      name: "NPK Fertilizer",
      type: "fertilizer" as const,
      total: 1000,
      used: 820,
      unit: "kg",
    },
    {
      id: "4",
      name: "Animal Feed",
      type: "feed" as const,
      total: 5000,
      used: 3200,
      unit: "kg",
    },
  ];

  return <ResourceTracking resources={mockResources} />;
}
