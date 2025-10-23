import { useState } from 'react';
import Game from '@/components/Game';
import LevelSelect from '@/components/LevelSelect';
import { LEVELS } from '@/lib/levels';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [levelStars, setLevelStars] = useState<Map<number, number>>(new Map());

  const handleSelectLevel = (levelId: number) => {
    setCurrentLevelId(levelId);
  };

  const handleLevelComplete = (stars: number) => {
    if (currentLevelId) {
      setCompletedLevels((prev) => new Set(prev).add(currentLevelId));
      setLevelStars((prev) => {
        const newMap = new Map(prev);
        const currentStars = newMap.get(currentLevelId) || 0;
        if (stars > currentStars) {
          newMap.set(currentLevelId, stars);
        }
        return newMap;
      });
      
      setTimeout(() => {
        setCurrentLevelId(null);
      }, 2000);
    }
  };

  const handleLevelFail = () => {
    setTimeout(() => {
      setCurrentLevelId(null);
    }, 2000);
  };

  const handleBackToMenu = () => {
    setCurrentLevelId(null);
  };

  if (currentLevelId === null) {
    return (
      <LevelSelect
        onSelectLevel={handleSelectLevel}
        completedLevels={completedLevels}
        levelStars={levelStars}
      />
    );
  }

  const currentLevel = LEVELS.find((l) => l.id === currentLevelId);
  if (!currentLevel) {
    return <div>Seviye bulunamadı!</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-200 dark:from-sky-900 dark:to-sky-700 py-8">
      <div className="container mx-auto">
        <div className="mb-4">
          <Button onClick={handleBackToMenu} variant="outline">
            ← Ana Menüye Dön
          </Button>
        </div>
        <Game
          level={currentLevel}
          onLevelComplete={handleLevelComplete}
          onLevelFail={handleLevelFail}
        />
      </div>
    </div>
  );
}

