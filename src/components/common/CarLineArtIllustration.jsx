const TEAL = "#3FE0B0";

export default function CarLineArtIllustration({
  className = "",
  flip = false,
}) {
  return (
    <svg
      viewBox="0 0 600 220"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      fill="none"
      role="img"
      aria-label="Line illustration of a luxury car"
    >
      <path
        d="M40 150 C40 120 70 100 110 95 L150 60 C165 45 190 35 220 35 L380 35 C410 35 435 45 450 65 L480 95 C520 100 555 115 565 150"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
      />
      <path
        d="M20 150 L575 150"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
      />
      <circle
        cx="140"
        cy="155"
        r="30"
        stroke={TEAL}
        strokeWidth="2"
        opacity="0.7"
      />
      <circle
        cx="460"
        cy="155"
        r="30"
        stroke={TEAL}
        strokeWidth="2"
        opacity="0.7"
      />
      <path
        d="M150 95 L160 65 L400 65 L440 95 Z"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
      />
    </svg>
  );
}
