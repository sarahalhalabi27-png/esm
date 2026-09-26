import { useTranslation } from "react-i18next";

export default function FloatingLabel({ text, active }) {
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
        ${
          active
            ? "-top-6 text-base text-teal-accent"
            : "top-2 text-[20px] max-md:text-[17px] font-semibold text-fg"
        }
      `}
    >
      {text}
    </span>
  );
}