import WeatherOverview from "../WeatherOverview";

export default function WeatherOverviewExample() {
  const mockWeatherData = {
    temperature: 28,
    humidity: 65,
    windSpeed: 7,
    precipitation: 0,
    uvIndex: 8,
    condition: "Partly Cloudy",
    alert: {
      type: "Storm Warning",
      severity: "warning" as const,
      message: "Heavy rainfall expected in 3 hours. Wind speeds up to 25 m/s. Recommended to postpone field spraying operations.",
    },
  };

  return (
    <WeatherOverview
      data={mockWeatherData}
      onDismissAlert={() => console.log("Alert dismissed")}
    />
  );
}
