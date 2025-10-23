// Game configuration constants
export const GAME_CONFIG = {
  width: 800,
  height: 600,
  gravity: 1,
  backgroundColor: '#87CEEB', // Sky blue
} as const;

// Object types in the game
export enum ObjectType {
  PROJECTILE = 'projectile',
  TARGET = 'target',
  OBSTACLE = 'obstacle',
  GROUND = 'ground',
  PLATFORM = 'platform',
}

// Material properties
export const MATERIALS = {
  wood: {
    density: 0.001,
    friction: 0.3,
    restitution: 0.2,
    color: '#8B4513',
  },
  stone: {
    density: 0.002,
    friction: 0.5,
    restitution: 0.1,
    color: '#808080',
  },
  glass: {
    density: 0.0005,
    friction: 0.1,
    restitution: 0.8,
    color: '#ADD8E6',
  },
  metal: {
    density: 0.003,
    friction: 0.4,
    restitution: 0.3,
    color: '#C0C0C0',
  },
} as const;

export type MaterialType = keyof typeof MATERIALS;

// Projectile types
export const PROJECTILES = {
  normal: {
    radius: 15,
    color: '#FF0000',
    density: 0.002,
    power: 1,
  },
  heavy: {
    radius: 20,
    color: '#8B0000',
    density: 0.004,
    power: 1.5,
  },
  bouncy: {
    radius: 12,
    color: '#FF69B4',
    density: 0.001,
    power: 0.8,
  },
} as const;

export type ProjectileType = keyof typeof PROJECTILES;

