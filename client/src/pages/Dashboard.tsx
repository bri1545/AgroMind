import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import DashboardHeader from "@/components/DashboardHeader";
import WeatherOverview from "@/components/WeatherOverview";
import FieldStatusCard from "@/components/FieldStatusCard";
import AIChatConsultant from "@/components/AIChatConsultant";
import FieldMap from "@/components/FieldMap";
import ResourceTracking from "@/components/ResourceTracking";
import LivestockMonitor from "@/components/LivestockMonitor";
import QuickStats from "@/components/QuickStats";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: fields = [], isLoading: fieldsLoading } = useQuery({
    queryKey: ["/api/fields"],
    enabled: !!user,
  });

  const firstField = fields[0];

  const { data: weatherData, isLoading: weatherLoading } = useQuery({
    queryKey: ["/api/weather", firstField?.latitude, firstField?.longitude],
    queryFn: async () => {
      if (!firstField) return null;
      const response = await fetch(`/api/weather/${firstField.latitude}/${firstField.longitude}`);
      if (!response.ok) throw new Error("Failed to fetch weather");
      return response.json();
    },
    enabled: !!firstField,
  });

  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/alerts/field", firstField?.id],
    queryFn: async () => {
      if (!firstField) return [];
      const response = await fetch(`/api/alerts/field/${firstField.id}`);
      if (!response.ok) throw new Error("Failed to fetch alerts");
      return response.json();
    },
    enabled: !!firstField,
  });

  if (fieldsLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const weatherDisplay = weatherData ? {
    temperature: Math.round(weatherData.weather.main.temp),
    humidity: weatherData.weather.main.humidity,
    windSpeed: Math.round(weatherData.weather.wind.speed),
    precipitation: weatherData.weather.rain?.["1h"] || 0,
    uvIndex: 0,
    condition: weatherData.weather.weather[0]?.description || "Unknown",
    alert: weatherData.alert,
  } : {
    temperature: 28,
    humidity: 65,
    windSpeed: 7,
    precipitation: 0,
    uvIndex: 8,
    condition: "Partly Cloudy",
    alert: null,
  };

  const fieldsDisplay = fields.length > 0 ? fields.map(field => ({
    id: field.id,
    name: field.name,
    area: field.area,
    cropType: field.cropType,
    status: "healthy" as const,
    ndvi: field.ndviIndex || 0.75,
    soilMoisture: field.soilMoisture || 65,
    yieldForecast: field.yieldForecast || 0,
  })) : [{
    id: "demo-1",
    name: "Demo Field",
    area: 10,
    cropType: "Wheat",
    status: "healthy" as const,
    ndvi: 0.75,
    soilMoisture: 65,
    yieldForecast: 5.5,
  }];

  const fieldLocations = fields.length > 0 ? fields.map(field => ({
    id: field.id,
    name: field.name,
    latitude: field.latitude,
    longitude: field.longitude,
    status: "healthy" as const,
  })) : [{
    id: "demo-1",
    name: "Demo Field",
    latitude: 40.7128,
    longitude: -74.0060,
    status: "healthy" as const,
  }];

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

  const mockLivestockGroups = [
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

  const userName = user ? `${user.firstName} ${user.lastName}` : "User";
  const userRole = user?.role === "livestock_specialist" ? "Livestock Specialist" : 
                   user?.role === "agronomist" ? "Agronomist" : "Farmer";

  const statsDisplay = [
    {
      id: "1",
      label: "Total Fields",
      value: fields.length.toString(),
      change: 0,
      trend: "up" as const,
    },
    {
      id: "2",
      label: "Active Alerts",
      value: alerts.length.toString(),
      change: 0,
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

  const centerPoint = fieldLocations[0] ? 
    { lat: fieldLocations[0].latitude, lng: fieldLocations[0].longitude } :
    { lat: 48.0196, lng: 66.9237 }; // Казахстан (центр)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        userName={userName}
        userRole={userRole}
        notificationCount={alerts.length}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <WeatherOverview
            data={weatherDisplay}
            onDismissAlert={() => console.log("Alert dismissed")}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <FieldMap
                fields={fieldLocations}
                center={centerPoint}
                zoom={fieldLocations[0] ? 12 : 5}
                onFieldClick={(fieldId) => console.log("Field clicked:", fieldId)}
              />
            </div>

            <div className="lg:col-span-3">
              <AIChatConsultant
                onSendMessage={(message) => console.log("Message sent:", message)}
              />
            </div>

            <div className="lg:col-span-2">
              <QuickStats stats={statsDisplay} />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">Field Status</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {fieldsDisplay.map((field) => (
                <FieldStatusCard
                  key={field.id}
                  {...field}
                  onViewDetails={() => console.log("View details:", field.id)}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ResourceTracking resources={mockResources} />
            <LivestockMonitor groups={mockLivestockGroups} />
          </div>
        </div>
      </main>
    </div>
  );
}
