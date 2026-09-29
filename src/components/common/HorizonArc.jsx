import { useId } from "react";

// The curved teal "horizon" used under page heroes (Figma: 1341 x 43.5, a 2px
// line fading from teal in the middle to the page background at the ends).
// Scales with its container's width. `covering` also fills the area under the
// curve with the page colour, hiding whatever sits beneath it (SceneHero's
// image); without it only the line is drawn (Car Details: the car stands on it).
// `overlap` (Figma px at the 1341 width) pulls the arc up over what's above it,
// scaling with the width.
const ARC = { width: 1341, height: 43.5 };
const arcCurve = `M0 ${ARC.height} Q${ARC.width / 2} ${-ARC.height + 2} ${ARC.width} ${ARC.height}`;

export default function HorizonArc({
  covering = false,
  overlap = 0,
  className = "",
}) {
  // Unique per instance so two arcs never share one gradient definition.
  const gradientId = `horizon-arc-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox={`0 0 ${ARC.width} ${ARC.height}`}
      className={`relative block w-full h-auto ${className}`}
      style={
        overlap ? { marginTop: `${-(overlap / ARC.width) * 100}%` } : undefined
      }
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="50.57%" stopColor="#24B9A5" />
          <stop offset="98.85%" stopColor="rgb(var(--page))" />
        </linearGradient>
      </defs>
      {covering && <path d={`${arcCurve} Z`} fill="rgb(var(--page))" />}
      <path
        d={arcCurve}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
      />
    </svg>
  );
}
