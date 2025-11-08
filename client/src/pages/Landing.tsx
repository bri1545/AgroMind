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
            <a href="/api/login">Sign In</a>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl font-bold mb-6">
            Dual AI Intelligence for Modern Farming
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            AgroMind combines real-time weather monitoring with AI-powered agricultural consulting
            to optimize your farm operations and increase productivity.
          </p>
          <Button size="lg" asChild data-testid="button-get-started">
            <a href="/api/login">Get Started</a>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6">
            <Cloud className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Weather Monitoring</h3>
            <p className="text-muted-foreground">
              Real-time weather data and automated risk alerts for optimal farming decisions.
            </p>
          </Card>

          <Card className="p-6">
            <Zap className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Consultant</h3>
            <p className="text-muted-foreground">
              Gemini-powered agricultural advice tailored to your crops, weather, and field conditions.
            </p>
          </Card>

          <Card className="p-6">
            <TrendingUp className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Yield Optimization</h3>
            <p className="text-muted-foreground">
              Data-driven recommendations to maximize productivity and resource efficiency.
            </p>
          </Card>
        </div>

        <div className="bg-card rounded-lg p-8 border">
          <div className="flex items-center gap-4 mb-6">
            <Users className="w-8 h-8 text-primary" />
            <h3 className="text-2xl font-semibold">For Every Agricultural Professional</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Farmers</h4>
              <p className="text-sm text-muted-foreground">
                Monitor fields, track resources, and get AI-powered farming advice
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Agronomists</h4>
              <p className="text-sm text-muted-foreground">
                Analyze crop health, predict yields, and optimize growing conditions
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Livestock Specialists</h4>
              <p className="text-sm text-muted-foreground">
                Monitor animal comfort, prevent heat stress, and manage feed resources
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-8 mt-16 border-t">
        <p className="text-center text-muted-foreground">
          © 2024 AgroMind. Agricultural Intelligence Platform.
        </p>
      </footer>
    </div>
  );
}
