import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LEVELS } from '@/lib/levels';

interface LevelSelectProps {
  onSelectLevel: (levelId: number) => void;
  completedLevels: Set<number>;
  levelStars: Map<number, number>;
}

export default function LevelSelect({
  onSelectLevel,
  completedLevels,
  levelStars,
}: LevelSelectProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-200 dark:from-sky-900 dark:to-sky-700 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-white drop-shadow-lg">
          Fizik Bulmacaları
        </h1>
        <p className="text-center text-white/90 mb-8 text-lg">
          Nesneleri fırlat, hedefleri vur ve fizik yasalarını öğren!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEVELS.map((level) => {
            const isCompleted = completedLevels.has(level.id);
            const stars = levelStars.get(level.id) || 0;
            const isLocked = level.id > 1 && !completedLevels.has(level.id - 1);

            return (
              <Card
                key={level.id}
                className={`p-6 transition-all hover:scale-105 ${
                  isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold">Seviye {level.id}</h3>
                    <p className="text-lg font-semibold text-primary">{level.name}</p>
                  </div>
                  {isLocked && <span className="text-2xl">🔒</span>}
                </div>

                <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
                  {level.description}
                </p>

                {isCompleted && (
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3].map((star) => (
                      <span key={star} className="text-2xl">
                        {star <= stars ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => onSelectLevel(level.id)}
                  disabled={isLocked}
                  className="w-full"
                  variant={isCompleted ? 'outline' : 'default'}
                >
                  {isLocked ? 'Kilitli' : isCompleted ? 'Tekrar Oyna' : 'Oyna'}
                </Button>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 p-6 bg-white/80 dark:bg-gray-800/80">
          <h2 className="text-xl font-bold mb-3">Nasıl Oynanır?</h2>
          <ul className="space-y-2 text-sm">
            <li>🎯 <strong>Hedef:</strong> Tüm hedefleri yok et!</li>
            <li>🎮 <strong>Kontroller:</strong> Fareyle tıkla, sürükle ve bırak</li>
            <li>⭐ <strong>Yıldızlar:</strong> Daha yüksek skor = Daha fazla yıldız</li>
            <li>🧠 <strong>Strateji:</strong> Farklı malzemeler farklı davranır - cam kırılgan, taş sağlam, ahşap dengeli</li>
            <li>🚀 <strong>Fizik:</strong> Açı, güç ve zamanlama önemli!</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

