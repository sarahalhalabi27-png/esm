import { useId } from "react";

// Page hero: a line-art scene with a curved "horizon" over its bottom edge
// (Services, About Us).
// Figma (1440 frame): the scene spans left 50 / width 1341, and a 1341 x 43.5
// arc sits over its bottom edge — the arc's shape is filled with the page
// background (hiding the image below the curve) and its top edge is a 2px
// line fading from teal in the middle to the background at the ends. Both
// scale with the width (the arc overlaps the image by 19/1341).
const ARC = { width: 1341, height: 43.5, overlap: 19 };
const arcCurve = `M0 ${ARC.height} Q${ARC.width / 2} ${-ARC.height + 2} ${ARC.width} ${ARC.height}`;

export default function SceneHero({ image, title }) {
  // Unique per instance so two heroes never share one gradient definition.
  const gradientId = `scene-hero-arc-${useId().replace(/:/g, "")}`;

  return (
    <section className="font-display px-6 md:px-[50px] pt-4 pb-10 max-md:pb-6">
      <h1 className="sr-only">{title}</h1>

      <div className="relative w-full max-w-[1341px] mx-auto">
        <img src={image} alt="" className="block w-full h-auto" />

        <svg
          viewBox={`0 0 ${ARC.width} ${ARC.height}`}
          className="relative block w-full h-auto"
          style={{ marginTop: `${-(ARC.overlap / ARC.width) * 100}%` }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="50.57%" stopColor="#24B9A5" />
              <stop offset="98.85%" stopColor="rgb(var(--page))" />
            </linearGradient>
          </defs>
          {/* Area under the curve, in the page colour, covers the image. */}
          <path d={`${arcCurve} Z`} fill="rgb(var(--page))" />
          {/* The curve itself. */}
          <path
            d={arcCurve}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="2"
          />
        </svg>
      </div>
    </section>
  );
}
