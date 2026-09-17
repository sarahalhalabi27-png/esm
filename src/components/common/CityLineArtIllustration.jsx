export default function CityLineArtIllustration({ className = "" }) {
  const buildings = [
    { x: 0, w: 40, h: 140 },
    { x: 50, w: 30, h: 190 },
    { x: 90, w: 45, h: 160 },
    { x: 145, w: 35, h: 220 },
    { x: 190, w: 50, h: 170 },
    { x: 250, w: 30, h: 200 },
    { x: 290, w: 40, h: 150 },
    { x: 340, w: 32, h: 180 },
    { x: 382, w: 45, h: 155 },
  ];
  return (
    <svg
      viewBox="0 0 450 240"
      className={className}
      fill="none"
      role="img"
      aria-label="City skyline line illustration"
    >
      <line
        x1="0"
        y1="238"
        x2="450"
        y2="238"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />
      {buildings.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={238 - b.h}
          width={b.w}
          height={b.h}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.1"
        />
      ))}
    </svg>
  );
}
