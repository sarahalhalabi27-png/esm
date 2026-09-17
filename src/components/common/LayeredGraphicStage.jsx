export default function LayeredGraphicStage({
  layers,
  aspectRatio,
  className = "",
  style,
}) {
  return (
    <div
      className={`relative w-full ${className}`}
      style={{ aspectRatio, ...style }}
    >
      {layers.map((layer) => (
        <img
          key={layer.alt || layer.src}
          src={layer.src}
          alt={layer.alt || ""}
          className={`absolute object-contain pointer-events-none select-none ${layer.className || ""}`}
          style={{
            top: `${layer.top}%`,
            left: `${layer.left}%`,
            width: `${layer.width}%`,
            height: `${layer.height}%`,
            opacity: layer.opacity ?? 1,
            zIndex: layer.zIndex ?? 0,
          }}
        />
      ))}
    </div>
  );
}
