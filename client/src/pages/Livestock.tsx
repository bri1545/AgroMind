import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "@/components/DashboardHeader";
import LivestockMonitor from "@/components/LivestockMonitor";
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
import { Plus, Beef, AlertTriangle, ThermometerSun, Droplets } from "lucide-react";

export default function Livestock() {
  const { user } = useAuth();
  const [isAddingGroup, setIsAddingGroup] = useState(false);

  const mockLivestockGroups = [
    {
      id: "1",
      name: "Молочные коровы - Корпус А",
      count: 45,
      temperature: 24,
      humidity: 62,
      status: "comfortable" as const,
    },
    {
      id: "2",
      name: "Молочные коровы - Корпус Б",
      count: 38,
      temperature: 29,
      humidity: 68,
      status: "stress" as const,
      recommendation:
        "Температура превышает 28°C. Увеличьте вентиляцию и обеспечьте достаточное водоснабжение для предотвращения теплового стресса.",
    },
    {
      id: "3",
      name: "Молодняк - Корпус В",
      count: 25,
      temperature: 22,
      humidity: 58,
      status: "comfortable" as const,
    },
    {
      id: "4",
      name: "Овцы - Загон 1",
      count: 120,
      temperature: 26,
      humidity: 55,
      status: "comfortable" as const,
    },
  ];

  const userName = user ? `${user.firstName} ${user.lastName}` : "Пользователь";
  const userRole = user?.role === "livestock_specialist" ? "Специалист по животноводству" : 
                   user?.role === "agronomist" ? "Агроном" : "Фермер";

  const totalAnimals = mockLivestockGroups.reduce((sum, group) => sum + group.count, 0);
  const groupsAtRisk = mockLivestockGroups.filter(g => g.status === "stress").length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        userName={userName}
        userRole={userRole}
        notificationCount={groupsAtRisk}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Мониторинг животноводства</h1>
              <p className="text-muted-foreground">Отслеживание здоровья и комфорта ваших животных</p>
            </div>
            <Dialog open={isAddingGroup} onOpenChange={setIsAddingGroup}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить группу
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить новую группу животных</DialogTitle>
                  <DialogDescription>
                    Введите информацию о группе животных для мониторинга
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="groupName">Название группы</Label>
                    <Input
                      id="groupName"
                      placeholder="Например: Молочные коровы - Корпус А"
                    />
                  </div>
                  <div>
                    <Label htmlFor="count">Количество голов</Label>
                    <Input
                      id="count"
                      type="number"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Расположение</Label>
                    <Input
                      id="location"
                      placeholder="Например: Корпус А, Загон 1"
                    />
                  </div>
                  <Button className="w-full">
                    Создать группу
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Beef className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Всего животных</p>
                  <p className="text-2xl font-bold">{totalAnimals}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-orange-500/10">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Группы в зоне риска</p>
                  <p className="text-2xl font-bold">{groupsAtRisk}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <ThermometerSun className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Средняя температура</p>
                  <p className="text-2xl font-bold">
                    {Math.round(mockLivestockGroups.reduce((sum, g) => sum + g.temperature, 0) / mockLivestockGroups.length)}°C
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <LivestockMonitor groups={mockLivestockGroups} />

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Рекомендации по уходу</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Droplets className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Водоснабжение</p>
                    <p className="text-sm text-muted-foreground">
                      Убедитесь, что все поилки работают и вода свежая. При высокой температуре потребление воды увеличивается на 50%.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <ThermometerSun className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Вентиляция</p>
                    <p className="text-sm text-muted-foreground">
                      При температуре выше 25°C включите дополнительные вентиляторы для улучшения циркуляции воздуха.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Мониторинг стресса</p>
                    <p className="text-sm text-muted-foreground">
                      Наблюдайте за поведением животных: учащенное дыхание, снижение аппетита могут указывать на тепловой стресс.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">График потребления корма</h3>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                График будет доступен после настройки датчиков кормления
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
