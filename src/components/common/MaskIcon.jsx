// An exported Figma SVG icon drawn as a mask and filled with a theme colour
// (default: the theme's teal), so one file recolours with light/dark mode
// instead of needing a second, recoloured export. Size it via `className`.
export default function MaskIcon({
  src,
  className = "",
  colorClassName = "bg-teal-accent",
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 ${colorClassName} ${className}`}
      style={{
        WebkitMask: `url(${src}) center / contain no-repeat`,
        mask: `url(${src}) center / contain no-repeat`,
      }}
    />
  );
}
