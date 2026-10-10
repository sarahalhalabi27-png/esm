import MaskIcon from "./MaskIcon.jsx";
import checkIcon from "../../assets/check.svg";

// Phones (max-md:*): smaller text that may wrap, with the icon pinned to the
// first line — the desktop single-line 25px style is unchanged.
export default function CheckListItem({ children, className = "" }) {
  return (
    <span
      className={`flex items-center gap-2 whitespace-nowrap text-[20px] font-normal leading-[100%] font-display text-fg max-md:items-start max-md:whitespace-normal max-md:text-lg max-md:leading-snug ${className}`}
    >
      {/* Filled with the theme accent: #24B9A5 dark, #072E2A light */}
      <MaskIcon
        src={checkIcon}
        display="block"
        className="w-[24px] h-[21px] max-md:mt-[3px]"
      />

      {children}
    </span>
  );
}
