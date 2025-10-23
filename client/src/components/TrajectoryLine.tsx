interface TrajectoryLineProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  canvasWidth: number;
  canvasHeight: number;
}

export default function TrajectoryLine({
  startX,
  startY,
  endX,
  endY,
  canvasWidth,
  canvasHeight,
}: TrajectoryLineProps) {
  // Calculate trajectory
  const dx = startX - endX;
  const dy = startY - endY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const maxDistance = 150;
  const power = Math.min(distance / maxDistance, 1);

  // Create dotted line points
  const points: { x: number; y: number }[] = [];
  const numPoints = 10;
  
  for (let i = 1; i <= numPoints; i++) {
    const t = i / numPoints;
    const x = startX - dx * t;
    const y = startY - dy * t + (t * t * 100 * power); // Add gravity effect
    
    if (x >= 0 && x <= canvasWidth && y >= 0 && y <= canvasHeight) {
      points.push({ x, y });
    }
  }

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: canvasWidth,
        height: canvasHeight,
        pointerEvents: 'none',
      }}
    >
      {/* Draw line from launcher to mouse */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="#FF0000"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      
      {/* Draw trajectory dots */}
      {points.map((point, idx) => (
        <circle
          key={idx}
          cx={point.x}
          cy={point.y}
          r="3"
          fill="#FFFF00"
          opacity={1 - idx / numPoints}
        />
      ))}
      
      {/* Draw power indicator */}
      <text
        x={startX + 20}
        y={startY - 20}
        fill="#FFFFFF"
        fontSize="16"
        fontWeight="bold"
        stroke="#000000"
        strokeWidth="0.5"
      >
        Güç: {Math.round(power * 100)}%
      </text>
    </svg>
  );
}

