import { Cloud, Zap, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">AgroMind</h1>
          </div>
          <Button asChild data-testid="button-login">
            <a href="/api/login">Войти</a>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl font-bold mb-6">
            Двойной ИИ-интеллект для современного фермерства
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            AgroMind объединяет мониторинг погоды в реальном времени с агроконсалтингом на базе ИИ
            для оптимизации вашей фермерской деятельности и повышения продуктивности.
          </p>
          <Button size="lg" asChild data-testid="button-get-started">
            <a href="/api/login">Начать работу</a>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6">
            <Cloud className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Мониторинг погоды</h3>
            <p className="text-muted-foreground">
              Данные о погоде в реальном времени и автоматические оповещения о рисках для оптимальных решений в фермерстве.
            </p>
          </Card>

          <Card className="p-6">
            <Zap className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">ИИ-консультант</h3>
            <p className="text-muted-foreground">
              Агрономические рекомендации на базе Gemini, адаптированные под ваши культуры, погоду и состояние полей.
            </p>
          </Card>

          <Card className="p-6">
            <TrendingUp className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Оптимизация урожайности</h3>
            <p className="text-muted-foreground">
              Рекомендации на основе данных для максимизации продуктивности и эффективности использования ресурсов.
            </p>
          </Card>
        </div>

        <div className="bg-card rounded-lg p-8 border">
          <div className="flex items-center gap-4 mb-6">
            <Users className="w-8 h-8 text-primary" />
            <h3 className="text-2xl font-semibold">Для каждого агрария</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Фермеры</h4>
              <p className="text-sm text-muted-foreground">
                Мониторинг полей, отслеживание ресурсов и получение рекомендаций от ИИ
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Агрономы</h4>
              <p className="text-sm text-muted-foreground">
                Анализ здоровья культур, прогнозирование урожайности и оптимизация условий выращивания
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Специалисты по животноводству</h4>
              <p className="text-sm text-muted-foreground">
                Мониторинг комфорта животных, предотвращение теплового стресса и управление кормовыми ресурсами
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-8 mt-16 border-t">
        <p className="text-center text-muted-foreground">
          © 2024 AgroMind. Платформа агро-интеллекта.
        </p>
      </footer>
    </div>
  );
}
