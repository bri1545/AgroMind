import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sprout, LineChart, Beef } from "lucide-react";

interface RoleSelectorDialogProps {
  open: boolean;
  onSelectRole: (role: string) => void;
}

const roles = [
  {
    id: "farmer",
    title: "Фермер",
    description: "Управление полями, отслеживание ресурсов и получение рекомендаций по выращиванию культур",
    icon: Sprout,
  },
  {
    id: "agronomist",
    title: "Агроном",
    description: "Анализ здоровья культур, прогнозирование урожайности и оптимизация условий выращивания",
    icon: LineChart,
  },
  {
    id: "livestock_specialist",
    title: "Специалист по животноводству",
    description: "Мониторинг комфорта животных, предотвращение теплового стресса и управление кормовыми ресурсами",
    icon: Beef,
  },
];

export function RoleSelectorDialog({ open, onSelectRole }: RoleSelectorDialogProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[600px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Выберите вашу роль</DialogTitle>
          <DialogDescription>
            Выберите роль, которая лучше всего описывает вашу деятельность. Это поможет настроить интерфейс под ваши нужды.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedRole === role.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{role.title}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => selectedRole && onSelectRole(selectedRole)}
            disabled={!selectedRole}
            className="min-w-[120px]"
          >
            Продолжить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
