import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Plus, Edit3, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import AreaAnalysisDialog from "./AreaAnalysisDialog";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

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
  onDrawField?: (coordinates: { lat: number; lng: number }[], area: number) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  enableDrawing?: boolean;
}

export default function FieldMap({
  fields,
  onFieldClick,
  onDrawField,
  center = { lat: 48.0196, lng: 66.9237 }, // Казахстан (центр)
  zoom = 6,
  enableDrawing = false,
}: FieldMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawnArea, setDrawnArea] = useState<{
    coordinates: { lat: number; lng: number }[];
    area: number;
  } | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const drawnItemsRef = useRef<any>(null);
  const drawControlRef = useRef<any>(null);
  const drawHandlerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined" || !window.L) return;

    if (!mapInstanceRef.current) {
      const map = window.L.map(mapRef.current).setView([center.lat, center.lng], zoom);

      // Спутниковая карта (Esri World Imagery)
      window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
      }).addTo(map);

      // Добавим слой с названиями для удобства
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 18,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, [center.lat, center.lng, zoom]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || typeof window === "undefined" || !window.L || !window.L.Control || !window.L.Control.Draw) return;

    const cleanupDrawing = () => {
      if (drawHandlerRef.current) {
        map.off('draw:created', drawHandlerRef.current);
        drawHandlerRef.current = null;
      }
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
        drawControlRef.current = null;
      }
      if (drawnItemsRef.current) {
        map.removeLayer(drawnItemsRef.current);
        drawnItemsRef.current = null;
      }
      setDrawnArea(null);
    };

    if (enableDrawing && !drawControlRef.current) {
      const drawnItems = new window.L.FeatureGroup();
      map.addLayer(drawnItems);
      drawnItemsRef.current = drawnItems;

      const drawControl = new window.L.Control.Draw({
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
            metric: ['km', 'ha'],
          },
          rectangle: {
            showArea: true,
            metric: ['km', 'ha'],
          },
          circle: false,
          circlemarker: false,
          marker: false,
          polyline: false,
        },
        edit: {
          featureGroup: drawnItems,
        },
      });
      map.addControl(drawControl);
      drawControlRef.current = drawControl;

      const handler = (e: any) => {
        const layer = e.layer;
        drawnItems.addLayer(layer);
        
        const latLngs = layer.getLatLngs()[0];
        const coordinates = latLngs.map((latLng: any) => ({
          lat: latLng.lat,
          lng: latLng.lng,
        }));
        
        const area = window.L.GeometryUtil ? 
          window.L.GeometryUtil.geodesicArea(latLngs) / 10000 : 
          0;
        
        setDrawnArea({ coordinates, area });
        
        if (onDrawField) {
          onDrawField(coordinates, area);
        }
      };
      
      map.on('draw:created', handler);
      drawHandlerRef.current = handler;
    } else if (!enableDrawing) {
      cleanupDrawing();
    }

    return cleanupDrawing;
  }, [enableDrawing, onDrawField]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

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
        .bindPopup(`<b>${field.name}</b><br/>Статус: ${field.status === 'healthy' ? 'Здоровое' : field.status === 'warning' ? 'Предупреждение' : 'Критическое'}`);

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
  }, [fields, onFieldClick]);

  const handleAnalyzeArea = async () => {
    if (!drawnArea) return;
    
    try {
      const response = await fetch('/api/ai/analyze-area', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          coordinates: drawnArea.coordinates,
          area: drawnArea.area,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to analyze area');
      return await response.json();
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  };

  return (
    <>
      <Card className="overflow-hidden" data-testid="card-field-map">
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Карта полей</h3>
            </div>
            {enableDrawing && (
              <div className="flex gap-2">
                {drawnArea && (
                  <Button 
                    size="sm" 
                    className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    onClick={() => setShowAnalysis(true)}
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Анализ ({drawnArea.area.toFixed(2)} га)
                  </Button>
                )}
                <Button size="sm" variant="outline" title="Добавить поле">
                  <Plus className="w-4 h-4 mr-1" />
                  Добавить поле
                </Button>
              </div>
            )}
          </div>
        </div>
        <div ref={mapRef} className="h-[500px] w-full" data-testid="map-container" />
      </Card>
      
      {drawnArea && (
        <AreaAnalysisDialog
          open={showAnalysis}
          onOpenChange={setShowAnalysis}
          coordinates={drawnArea.coordinates}
          area={drawnArea.area}
          onAnalyze={handleAnalyzeArea}
        />
      )}
    </>
  );
}
