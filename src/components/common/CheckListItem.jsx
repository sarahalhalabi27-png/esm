import checkDark from "../../assets/check.svg";
import checkLight from "../../assets/check_light_mode.png";

// Phones (max-md:*): smaller text that may wrap, with the icon pinned to the
// first line — the desktop single-line 25px style is unchanged.
export default function CheckListItem({ children, className = "" }) {
  return (
    <span
      className={`flex items-center gap-2 whitespace-nowrap text-[25px] font-normal leading-[100%] font-display text-fg max-md:items-start max-md:whitespace-normal max-md:text-lg max-md:leading-snug ${className}`}
    >
      {/* Theme-specific check icon (swapped via CSS in index.css). */}
      <img
        src={checkDark}
        alt=""
        width={24}
        height={21}
        className="shrink-0 dark-only max-md:mt-[3px]"
      />
      <img
        src={checkLight}
        alt=""
        width={24}
        height={21}
        className="shrink-0 light-only max-md:mt-[3px]"
      />

      {children}
    </span>
  );
}
