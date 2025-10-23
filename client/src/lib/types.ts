import { MaterialType, ProjectileType } from './gameConstants';

export interface GameObject {
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  type: 'rectangle' | 'circle';
  material: MaterialType;
  isStatic?: boolean;
  angle?: number;
}

export interface Target extends GameObject {
  points: number;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  projectiles: {
    type: ProjectileType;
    count: number;
  }[];
  targets: Target[];
  obstacles: GameObject[];
  requiredScore: number;
  stars: {
    one: number;
    two: number;
    three: number;
  };
}

export interface GameState {
  currentLevel: number;
  score: number;
  projectilesRemaining: number;
  isLaunching: boolean;
  gameStatus: 'ready' | 'playing' | 'won' | 'lost';
  destroyedTargets: number;
}

