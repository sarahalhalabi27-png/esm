// An exported SVG icon drawn as a mask and filled with a theme colour
// (default: the theme's teal), so one file recolours with light/dark mode
// instead of needing a second, recoloured export. Size it via `className`
// (or `style`). Decorative by default; pass `label` when the icon itself
// carries meaning (it's then announced as an image). Other props (data-*,
// …) go to the element.
export default function MaskIcon({
  src,
  className = "",
  colorClassName = "bg-teal-accent",
  display = "inline-block",
  label,
  style,
  ...rest
}) {
  return (
    <span
      {...(label
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": "true" })}
      className={`${display} shrink-0 ${colorClassName} ${className}`}
      style={{
        ...style,
        WebkitMask: `url(${src}) center / contain no-repeat`,
        mask: `url(${src}) center / contain no-repeat`,
      }}
      {...rest}
    />
  );
}
