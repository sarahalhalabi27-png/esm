import checkDark from "../../assets/check.svg";
import checkLight from "../../assets/check_light_mode.png";

export default function CheckListItem({ children, className = "" }) {
  return (
    <span
      className={`flex items-center gap-2 whitespace-nowrap text-[25px] font-normal leading-[100%] font-display text-fg ${className}`}
    >
      {/* Theme-specific check icon (swapped via CSS in index.css). */}
      <img
        src={checkDark}
        alt=""
        width={24}
        height={21}
        className="shrink-0 dark-only"
      />
      <img
        src={checkLight}
        alt=""
        width={24}
        height={21}
        className="shrink-0 light-only"
      />

      {children}
    </span>
  );
}
