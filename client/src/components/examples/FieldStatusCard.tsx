import FieldStatusCard from "../FieldStatusCard";

export default function FieldStatusCardExample() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <FieldStatusCard
        id="1"
        name="North Field"
        area={12.5}
        cropType="Wheat"
        status="healthy"
        ndvi={0.78}
        soilMoisture={68}
        yieldForecast={7.2}
        onViewDetails={() => console.log("View details clicked")}
      />
      <FieldStatusCard
        id="2"
        name="East Field"
        area={8.3}
        cropType="Corn"
        status="warning"
        ndvi={0.63}
        soilMoisture={42}
        yieldForecast={6.8}
        onViewDetails={() => console.log("View details clicked")}
      />
      <FieldStatusCard
        id="3"
        name="South Pasture"
        area={15.0}
        cropType="Soybeans"
        status="healthy"
        ndvi={0.82}
        soilMoisture={72}
        yieldForecast={4.5}
        onViewDetails={() => console.log("View details clicked")}
      />
    </div>
  );
}
