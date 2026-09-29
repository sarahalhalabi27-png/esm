import { useTranslation } from "react-i18next";

// `inactiveClassName` / `activeClassName` override the resting (in-field) and
// floated styles for forms with their own type scale (e.g. Car Details).
export default function FloatingLabel({
  text,
  active,
  inactiveClassName = "top-2 text-[20px] max-md:text-[17px] font-semibold text-fg",
  activeClassName = "-top-6 text-base text-teal-accent",
}) {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

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
        ${active ? activeClassName : inactiveClassName}
      `}
    >
      {text}
    </span>
  );
}
