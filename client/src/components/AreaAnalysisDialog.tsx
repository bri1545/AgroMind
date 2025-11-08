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
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, TrendingUp, AlertTriangle, Leaf, BarChart3 } from "lucide-react";

interface AreaAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coordinates: { lat: number; lng: number }[];
  area: number;
  onAnalyze: () => Promise<any>;
}

export default function AreaAnalysisDialog({
  open,
  onOpenChange,
  coordinates,
  area,
  onAnalyze,
}: AreaAnalysisDialogProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await onAnalyze();
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthBg = (score: number) => {
    if (score >= 80) return "bg-green-100 border-green-300";
    if (score >= 60) return "bg-yellow-100 border-yellow-300";
    return "bg-red-100 border-red-300";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Анализ Области
          </DialogTitle>
          <DialogDescription>
            Революционный анализ с использованием спутниковых данных и искусственного интеллекта
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card className="p-4 bg-muted/50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Площадь:</span>
                <p className="font-semibold">{area.toFixed(2)} га</p>
              </div>
              <div>
                <span className="text-muted-foreground">Точек координат:</span>
                <p className="font-semibold">{coordinates.length}</p>
              </div>
            </div>
          </Card>

          {!analysis && !analyzing && (
            <div className="text-center py-8">
              <div className="mb-4">
                <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">Готовы к анализу?</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Наш AI проанализирует выбранную область используя:
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm max-w-md mx-auto mb-6">
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <span>NDVI индекс</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>Прогноз урожая</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span>Риск болезней</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <span>Качество почвы</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleAnalyze} size="lg" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Начать AI Анализ
              </Button>
            </div>
          )}

          {analyzing && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Анализируем область...</p>
              <p className="text-sm text-muted-foreground">
                Обрабатываем спутниковые данные и прогнозируем показатели
              </p>
            </div>
          )}

          {analysis && !analyzing && (
            <div className="space-y-4">
              <Card className={`p-4 border-2 ${getHealthBg(analysis.healthScore)}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Leaf className="w-5 h-5" />
                    Здоровье Посевов
                  </h3>
                  <span className={`text-2xl font-bold ${getHealthColor(analysis.healthScore)}`}>
                    {analysis.healthScore}%
                  </span>
                </div>
                <Progress value={analysis.healthScore} className="h-2 mb-2" />
                <p className="text-sm">{analysis.summary}</p>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <h4 className="font-semibold text-sm">NDVI Индекс</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{analysis.ndviEstimate}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Индекс растительности (спутниковые данные)
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-sm">Прогноз Урожая</h4>
                  </div>
                  <p className="text-lg font-bold text-blue-600">{analysis.yieldPrediction}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI предсказание на основе текущих данных
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <h4 className="font-semibold text-sm">Риск Болезней</h4>
                  </div>
                  <p className="text-sm font-medium">{analysis.diseaseRisk}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Анализ условий для патогенов
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <h4 className="font-semibold text-sm">Качество Почвы</h4>
                  </div>
                  <p className="text-sm font-medium">{analysis.soilQuality}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Оценка плодородия
                  </p>
                </Card>
              </div>

              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Рекомендации AI
                </h4>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex gap-2 text-sm">
                      <span className="text-primary font-semibold">{idx + 1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <div className="flex gap-2">
                <Button onClick={handleAnalyze} variant="outline" className="flex-1">
                  Повторить Анализ
                </Button>
                <Button onClick={() => onOpenChange(false)} className="flex-1">
                  Закрыть
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
