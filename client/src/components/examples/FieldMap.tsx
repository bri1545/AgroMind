import FieldMap from "../FieldMap";

export default function FieldMapExample() {
  const mockFields = [
    {
      id: "1",
      name: "North Field",
      latitude: 50.45,
      longitude: 30.52,
      status: "healthy" as const,
    },
    {
      id: "2",
      name: "East Field",
      latitude: 50.46,
      longitude: 30.54,
      status: "warning" as const,
    },
    {
      id: "3",
      name: "South Pasture",
      latitude: 50.44,
      longitude: 30.53,
      status: "healthy" as const,
    },
  ];

  return (
    <FieldMap
      fields={mockFields}
      center={{ lat: 50.45, lng: 30.52 }}
      zoom={12}
      onFieldClick={(fieldId) => console.log("Field clicked:", fieldId)}
    />
  );
}
