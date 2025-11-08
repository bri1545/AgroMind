import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface FieldLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: "healthy" | "warning" | "critical";
}

interface FieldMapProps {
  fields: FieldLocation[];
  onFieldClick?: (fieldId: string) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export default function FieldMap({
  fields,
  onFieldClick,
  center = { lat: 50.45, lng: 30.52 },
  zoom = 10,
}: FieldMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined" || !window.L) return;

    if (!mapInstanceRef.current) {
      const map = window.L.map(mapRef.current).setView([center.lat, center.lng], zoom);

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markers: any[] = [];

    fields.forEach((field) => {
      const markerColor =
        field.status === "healthy"
          ? "#22c55e"
          : field.status === "warning"
          ? "#f59e0b"
          : "#ef4444";

      const customIcon = window.L.divIcon({
        className: "custom-marker",
        html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = window.L.marker([field.latitude, field.longitude], {
        icon: customIcon,
      })
        .addTo(map)
        .bindPopup(`<b>${field.name}</b><br/>Status: ${field.status}`);

      if (onFieldClick) {
        marker.on("click", () => {
          onFieldClick(field.id);
        });
      }

      markers.push(marker);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [fields, center.lat, center.lng, zoom, onFieldClick]);

  return (
    <Card className="overflow-hidden" data-testid="card-field-map">
      <div className="p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Field Locations</h3>
        </div>
      </div>
      <div ref={mapRef} className="h-[400px] w-full" data-testid="map-container" />
    </Card>
  );
}
