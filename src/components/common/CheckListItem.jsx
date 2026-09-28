import checkIcon from "../../assets/check.svg";

// Phones (max-md:*): smaller text that may wrap, with the icon pinned to the
// first line — the desktop single-line 25px style is unchanged.
export default function CheckListItem({ children, className = "" }) {
  return (
    <span
      className={`flex items-center gap-2 whitespace-nowrap text-[25px] font-normal leading-[100%] font-display text-fg max-md:items-start max-md:whitespace-normal max-md:text-lg max-md:leading-snug ${className}`}
    >
      {/* check.svg used as a mask, filled with the theme accent:
          #24B9A5 in dark mode, #072E2A in light mode. */}
      <span
        aria-hidden="true"
        className="block shrink-0 w-[24px] h-[21px] bg-teal-accent max-md:mt-[3px]"
        style={{
          WebkitMask: `url(${checkIcon}) center / contain no-repeat`,
          mask: `url(${checkIcon}) center / contain no-repeat`,
        }}
      />

      {children}
    </span>
  );
}
