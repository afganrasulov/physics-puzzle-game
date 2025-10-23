import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { GAME_CONFIG, MATERIALS, PROJECTILES, ObjectType, ProjectileType } from '@/lib/gameConstants';
import { Level, GameState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TrajectoryLine from './TrajectoryLine';

interface GameProps {
  level: Level;
  onLevelComplete: (stars: number) => void;
  onLevelFail: () => void;
}

export default function Game({ level, onLevelComplete, onLevelFail }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const launcherRef = useRef<{ body: Matter.Body; constraint: Matter.Constraint } | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: level.id,
    score: 0,
    projectilesRemaining: level.projectiles.reduce((sum, p) => sum + p.count, 0),
    isLaunching: false,
    gameStatus: 'ready',
    destroyedTargets: 0,
  });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const targetsRef = useRef<Set<Matter.Body>>(new Set());
  const [currentProjectileIndex, setCurrentProjectileIndex] = useState(0);
  const projectileQueueRef = useRef<Array<{ type: ProjectileType; count: number }>>([]);

  useEffect(() => {
    // Initialize projectile queue
    const queue: Array<{ type: ProjectileType; count: number }> = [];
    level.projectiles.forEach(p => {
      for (let i = 0; i < p.count; i++) {
        queue.push({ type: p.type, count: 1 });
      }
    });
    projectileQueueRef.current = queue;
    setCurrentProjectileIndex(0);
  }, [level]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: GAME_CONFIG.gravity, scale: 0.001 },
    });
    engineRef.current = engine;

    // Create renderer
    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: GAME_CONFIG.width,
        height: GAME_CONFIG.height,
        wireframes: false,
        background: GAME_CONFIG.backgroundColor,
      },
    });
    renderRef.current = render;

    // Create ground
    const ground = Matter.Bodies.rectangle(
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height - 10,
      GAME_CONFIG.width,
      20,
      {
        isStatic: true,
        render: { fillStyle: '#654321' },
        label: ObjectType.GROUND,
      }
    );

    // Create launcher platform
    const launcherPlatform = Matter.Bodies.rectangle(100, GAME_CONFIG.height - 80, 80, 10, {
      isStatic: true,
      render: { fillStyle: '#8B4513' },
    });

    // Add walls
    const leftWall = Matter.Bodies.rectangle(-10, GAME_CONFIG.height / 2, 20, GAME_CONFIG.height, {
      isStatic: true,
      render: { fillStyle: '#654321' },
    });
    const rightWall = Matter.Bodies.rectangle(
      GAME_CONFIG.width + 10,
      GAME_CONFIG.height / 2,
      20,
      GAME_CONFIG.height,
      {
        isStatic: true,
        render: { fillStyle: '#654321' },
      }
    );

    const allBodies: Matter.Body[] = [ground, launcherPlatform, leftWall, rightWall];

    // Add targets
    level.targets.forEach((target, index) => {
      let body: Matter.Body;
      const material = MATERIALS[target.material];

      if (target.type === 'circle') {
        body = Matter.Bodies.circle(target.x, target.y, target.radius!, {
          density: material.density,
          friction: material.friction,
          restitution: material.restitution,
          render: { fillStyle: material.color },
          label: `${ObjectType.TARGET}_${index}`,
        });
      } else {
        body = Matter.Bodies.rectangle(target.x, target.y, target.width!, target.height!, {
          density: material.density,
          friction: material.friction,
          restitution: material.restitution,
          render: { fillStyle: material.color },
          label: `${ObjectType.TARGET}_${index}`,
          angle: target.angle || 0,
        });
      }
      allBodies.push(body);
      targetsRef.current.add(body);
    });

    // Add obstacles
    level.obstacles.forEach((obstacle, index) => {
      let body: Matter.Body;
      const material = MATERIALS[obstacle.material];

      if (obstacle.type === 'circle') {
        body = Matter.Bodies.circle(obstacle.x, obstacle.y, obstacle.radius!, {
          isStatic: obstacle.isStatic,
          density: material.density,
          friction: material.friction,
          restitution: material.restitution,
          render: { fillStyle: material.color },
          label: `${ObjectType.OBSTACLE}_${index}`,
        });
      } else {
        body = Matter.Bodies.rectangle(
          obstacle.x,
          obstacle.y,
          obstacle.width!,
          obstacle.height!,
          {
            isStatic: obstacle.isStatic,
            density: material.density,
            friction: material.friction,
            restitution: material.restitution,
            render: { fillStyle: material.color },
            label: `${ObjectType.OBSTACLE}_${index}`,
            angle: obstacle.angle || 0,
          }
        );
      }
      allBodies.push(body);
    });

    Matter.World.add(engine.world, allBodies);

    // Run the engine and renderer
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // Collision detection
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        
        // Check if a projectile hit a target
        if (
          (bodyA.label.startsWith(ObjectType.TARGET) && bodyB.label === ObjectType.PROJECTILE) ||
          (bodyB.label.startsWith(ObjectType.TARGET) && bodyA.label === ObjectType.PROJECTILE)
        ) {
          const targetBody = bodyA.label.startsWith(ObjectType.TARGET) ? bodyA : bodyB;
          
          if (targetsRef.current.has(targetBody)) {
            const targetIndex = parseInt(targetBody.label.split('_')[1]);
            const target = level.targets[targetIndex];
            
            // Check if target is destroyed (high velocity impact or out of bounds)
            const velocity = Matter.Body.getVelocity(targetBody);
            const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
            
            if (speed > 2 || targetBody.position.y > GAME_CONFIG.height - 50) {
              targetsRef.current.delete(targetBody);
              setGameState((prev) => ({
                ...prev,
                score: prev.score + target.points,
                destroyedTargets: prev.destroyedTargets + 1,
              }));
            }
          }
        }
      });
    });

    // Cleanup
    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, [level]);

  // Check win/lose conditions
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    // Check if all targets destroyed
    if (gameState.destroyedTargets >= level.targets.length) {
      const stars = 
        gameState.score >= level.stars.three ? 3 :
        gameState.score >= level.stars.two ? 2 :
        gameState.score >= level.stars.one ? 1 : 0;
      
      setGameState((prev) => ({ ...prev, gameStatus: 'won' }));
      setTimeout(() => onLevelComplete(stars), 1000);
      return;
    }

    // Check if out of projectiles
    if (gameState.projectilesRemaining === 0 && !gameState.isLaunching) {
      setGameState((prev) => ({ ...prev, gameStatus: 'lost' }));
      setTimeout(() => onLevelFail(), 1000);
    }
  }, [gameState, level, onLevelComplete, onLevelFail]);

  const createProjectile = () => {
    if (!engineRef.current || gameState.projectilesRemaining === 0 || currentProjectileIndex >= projectileQueueRef.current.length) return;

    const currentProjectileType = projectileQueueRef.current[currentProjectileIndex].type;
    const projectileType = PROJECTILES[currentProjectileType];
    const projectile = Matter.Bodies.circle(100, GAME_CONFIG.height - 100, projectileType.radius, {
      density: projectileType.density,
      restitution: currentProjectileType === 'bouncy' ? 0.95 : 0.6,
      friction: 0.5,
      render: { fillStyle: projectileType.color },
      label: ObjectType.PROJECTILE,
    });

    const constraint = Matter.Constraint.create({
      pointA: { x: 100, y: GAME_CONFIG.height - 100 },
      bodyB: projectile,
      stiffness: 0.05,
      length: 0,
    });

    Matter.World.add(engineRef.current.world, [projectile, constraint]);
    launcherRef.current = { body: projectile, constraint };
    setGameState((prev) => ({ ...prev, isLaunching: true }));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState.gameStatus === 'ready') {
      setGameState((prev) => ({ ...prev, gameStatus: 'playing' }));
    }
    
    if (!launcherRef.current && gameState.projectilesRemaining > 0) {
      createProjectile();
    }
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (isDragging && launcherRef.current) {
      Matter.Body.setPosition(launcherRef.current.body, { x, y });
    }
  };

  const handleMouseUp = () => {
    if (!engineRef.current || !launcherRef.current) return;

    setIsDragging(false);
    Matter.World.remove(engineRef.current.world, launcherRef.current.constraint);
    
    setGameState((prev) => ({
      ...prev,
      projectilesRemaining: prev.projectilesRemaining - 1,
      isLaunching: false,
    }));

    setCurrentProjectileIndex(prev => prev + 1);
    launcherRef.current = null;

    // Wait a bit before allowing next projectile
    setTimeout(() => {
      setGameState((prev) => ({ ...prev, isLaunching: false }));
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Trajectory helper */}
      {isDragging && launcherRef.current && (
        <div className="absolute" style={{ top: 0, left: 0 }}>
          <TrajectoryLine
            startX={100}
            startY={GAME_CONFIG.height - 100}
            endX={mousePos.x}
            endY={mousePos.y}
            canvasWidth={GAME_CONFIG.width}
            canvasHeight={GAME_CONFIG.height}
          />
        </div>
      )}
      <Card className="p-4 w-full max-w-[800px]">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-xl font-bold">{level.name}</h2>
            <p className="text-sm text-muted-foreground">{level.description}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">Skor: {gameState.score}</div>
            <div className="text-sm">Mermi: {gameState.projectilesRemaining}</div>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          {projectileQueueRef.current.map((proj, idx) => {
            const projType = PROJECTILES[proj.type];
            return (
              <div
                key={idx}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  idx === currentProjectileIndex ? 'border-primary scale-110' : 'border-gray-400 opacity-50'
                } ${idx < currentProjectileIndex ? 'opacity-25' : ''}`}
                style={{ backgroundColor: projType.color }}
                title={proj.type}
              />
            );
          })}
        </div>
      </Card>

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="border-4 border-primary rounded-lg cursor-crosshair"
      />

      {gameState.gameStatus === 'ready' && (
        <Card className="p-4 bg-primary/10">
          <p className="text-center font-semibold">
            Fırlatmak için tıkla, sürükle ve bırak!
          </p>
        </Card>
      )}

      {gameState.gameStatus === 'won' && (
        <Card className="p-4 bg-green-100 dark:bg-green-900">
          <p className="text-center font-bold text-green-800 dark:text-green-100">
            🎉 Tebrikler! Seviyeyi geçtin!
          </p>
        </Card>
      )}

      {gameState.gameStatus === 'lost' && (
        <Card className="p-4 bg-red-100 dark:bg-red-900">
          <p className="text-center font-bold text-red-800 dark:text-red-100">
            😔 Başarısız! Tekrar dene!
          </p>
        </Card>
      )}
    </div>
  );
}

