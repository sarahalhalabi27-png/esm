import { useTranslation } from "react-i18next";

// `inactiveClassName` / `activeClassName` override the resting (in-field) and
// floated styles for forms with their own type scale (e.g. Car Details).
// The floated label keeps the resting label's font weight: with `transition-all`
// a weight that changed on floating (e.g. Semibold -> the inherited Regular)
// was animated, so the label looked bold and then slowly turned normal.
const WEIGHT = /font-(?:thin|light|normal|medium|semibold|bold|extrabold)/;

export default function FloatingLabel({
  text,
  active,
  inactiveClassName = "top-2 text-[20px] max-md:text-[17px] font-semibold text-fg",
  activeClassName = "-top-6 text-base text-teal-accent",
}) {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const weight = inactiveClassName.match(WEIGHT)?.[0] ?? "";

  return (
    <span
      className={`
        absolute
        ${isRTL ? "right-0" : "left-0"}
        z-10
        pointer-events-none
        font-display
        capitalize
        transition-all
        duration-500
        ease-out
        ${isRTL ? "text-right" : "text-left"}
        ${active ? `${activeClassName} ${weight}` : inactiveClassName}
      `}
    >
      {text}
    </span>
  );
}
