import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import DashboardHeader from "@/components/DashboardHeader";
import FieldMap from "@/components/FieldMap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, MapPin, Trash2, TrendingUp, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Fields() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddingField, setIsAddingField] = useState(false);
  const [newField, setNewField] = useState({
    name: "",
    latitude: 48.0196,
    longitude: 66.9237,
    area: 0,
    cropType: "",
  });

  const { data: fields = [] } = useQuery({
    queryKey: ["/api/fields"],
    enabled: !!user,
  });

  const createFieldMutation = useMutation({
    mutationFn: async (fieldData: any) => {
      return await apiRequest("/api/fields", "POST", fieldData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fields"] });
      setIsAddingField(false);
      setNewField({
        name: "",
        latitude: 48.0196,
        longitude: 66.9237,
        area: 0,
        cropType: "",
      });
      toast({
        title: "Успешно",
        description: "Поле добавлено",
      });
    },
  });

  const deleteFieldMutation = useMutation({
    mutationFn: async (fieldId: string) => {
      return await apiRequest(`/api/fields/${fieldId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fields"] });
      toast({
        title: "Успешно",
        description: "Поле удалено",
      });
    },
  });

  const handleCreateField = () => {
    if (newField.name && newField.area > 0) {
      createFieldMutation.mutate(newField);
    }
  };

  const handleDrawField = (coordinates: { lat: number; lng: number }[], area: number) => {
    const centerLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0) / coordinates.length;
    const centerLng = coordinates.reduce((sum, coord) => sum + coord.lng, 0) / coordinates.length;
    
    setNewField({
      ...newField,
      latitude: centerLat,
      longitude: centerLng,
      area: Math.round(area * 100) / 100,
    });
    setIsAddingField(true);
  };

  const fieldLocations = fields.map((field: any) => ({
    id: field.id,
    name: field.name,
    latitude: field.latitude,
    longitude: field.longitude,
    status: "healthy" as const,
  }));

  const userName = user ? `${user.firstName} ${user.lastName}` : "Пользователь";
  const userRole = user?.role === "livestock_specialist" ? "Специалист по животноводству" : 
                   user?.role === "agronomist" ? "Агроном" : "Фермер";

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        userName={userName}
        userRole={userRole}
        notificationCount={0}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Мои поля</h1>
              <p className="text-muted-foreground">Управление вашими сельскохозяйственными полями</p>
            </div>
            <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить поле
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить новое поле</DialogTitle>
                  <DialogDescription>
                    Введите информацию о вашем поле или нарисуйте его на карте
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Название поля</Label>
                    <Input
                      id="name"
                      value={newField.name}
                      onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                      placeholder="Например: Северное поле"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Широта</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.0001"
                        value={newField.latitude}
                        onChange={(e) => setNewField({ ...newField, latitude: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Долгота</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.0001"
                        value={newField.longitude}
                        onChange={(e) => setNewField({ ...newField, longitude: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="area">Площадь (га)</Label>
                    <Input
                      id="area"
                      type="number"
                      step="0.01"
                      value={newField.area}
                      onChange={(e) => setNewField({ ...newField, area: parseFloat(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cropType">Тип культуры</Label>
                    <Input
                      id="cropType"
                      value={newField.cropType}
                      onChange={(e) => setNewField({ ...newField, cropType: e.target.value })}
                      placeholder="Например: Пшеница, Ячмень"
                    />
                  </div>
                  <Button onClick={handleCreateField} className="w-full">
                    Создать поле
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <FieldMap
            fields={fieldLocations}
            center={{ lat: 48.0196, lng: 66.9237 }}
            zoom={5}
            enableDrawing={true}
            onDrawField={handleDrawField}
            onFieldClick={(fieldId) => console.log("Field clicked:", fieldId)}
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {fields.map((field: any) => (
              <Card key={field.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">{field.name}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteFieldMutation.mutate(field.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Площадь:</span>
                    <span className="font-medium">{field.area} га</span>
                  </div>
                  {field.cropType && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Культура:</span>
                      <span className="font-medium">{field.cropType}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Координаты:</span>
                    <span className="font-medium text-xs">
                      {field.latitude.toFixed(4)}, {field.longitude.toFixed(4)}
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-muted-foreground">NDVI:</span>
                        <span className="font-medium">0.75</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Droplets className="w-4 h-4 text-blue-600" />
                        <span className="text-muted-foreground">Влажность:</span>
                        <span className="font-medium">65%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {fields.length === 0 && (
            <Card className="p-12 text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Нет полей</h3>
              <p className="text-muted-foreground mb-4">
                Начните с добавления вашего первого поля
              </p>
              <Button onClick={() => setIsAddingField(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить поле
              </Button>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
