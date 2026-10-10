import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import FloatingLabel from "../common/FloatingLabel.jsx";

// Booking-duration picker for the reservation form: an underlined field like
// the others, opening a custom list (a native <select> list can't be styled).
// Figma (1440 frame, from the field's 1198-wide row):
// - list right under the field's line and as wide as the field (Figma: 1195,
//   3px in; widened on review so the Your Fleet label beneath doesn't peek
//   out past its edge); bottom corners 15px, hairline white/60% border,
//   #0000007D background (made opaque, see below);
// - items 1160 x 28 at Figma's spot (19px in from the list's edge, 25.33px
//   down; the padding here is 1px less: browsers draw the hairline as 1px),
//   12px apart, each with a hairline separator (white/35%, lightened on
//   review; none under the last, Monthly); the name (Medium
//   18px, 22px line) at the item's top.
// Light mode: the form's #072E2A with white text and lines, the
// highlighted item on a white/10% wash.
// Keyboard: Enter/Space/↓ opens; ↑/↓ move, Enter/Space picks, Esc/Tab close.
// Used through ControlledField: `onChange` receives the picked value.
// `variant="box"` draws it as the booking card's boxed field instead (see
// BookingSelect in common/BookingFields.jsx): no floating label (the label sits
// above the box, the placeholder shows inside it), a chevron at the end and
// the list as a matching rounded panel under the box.
export default function DurationSelect({
  value,
  onChange,
  onBlur,
  name,
  placeholder,
  options,
  fieldClassName = "",
  floatingLabelClassName,
  variant = "underline",
}) {
  const box = variant === "box";
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef(null);
  const listId = useId();
  const selected = options.find((option) => option.value === value);

  const close = () => {
    setOpen(false);
    onBlur?.();
  };

  const openList = () => {
    setActive(Math.max(0, options.indexOf(selected)));
    setOpen(true);
  };

  const pick = (option) => {
    onChange(option.value);
    close();
  };

  // Close when clicking anywhere else.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
    // close only depends on onBlur, which is stable for a mounted field
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onKeyDown = (event) => {
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((index) => (index + step + options.length) % options.length);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (options[active]) pick(options[active]);
    } else if (event.key === "Escape" || event.key === "Tab") {
      close();
    }
  };

  return (
    <div ref={rootRef} className="relative">
      {box ? null : (
        <FloatingLabel
          text={placeholder}
          active={open || !!value}
          inactiveClassName={floatingLabelClassName}
        />
      )}
      <button
        type="button"
        name={name}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={
          open && active >= 0 ? `${listId}-${active}` : undefined
        }
        aria-label={placeholder}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        className={
          box
            ? `text-start pe-10 ${fieldClassName}`
            : `w-full text-start pe-8 bg-transparent outline-none text-fg capitalize transition-colors ${fieldClassName}`
        }
      >
        {box ? (
          selected ? (
            <span className="truncate">{selected.label}</span>
          ) : (
            <span className="truncate text-white/40">{placeholder}</span>
          )
        ) : (
          (selected?.label ?? "")
        )}
      </button>
      <ChevronDown
        size={box ? 18 : 20}
        strokeWidth={box ? 1.75 : 1.5}
        aria-hidden="true"
        className={`absolute -translate-y-1/2 pointer-events-none transition-transform ${
          box ? "end-4 top-1/2 text-white/60" : "end-0 top-[13.5px] text-fg"
        } ${open ? "rotate-180" : ""}`}
      />

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={placeholder}
          className={
            box
              ? "absolute z-30 flex flex-col gap-0.5 top-full start-0 end-0 mt-1.5 p-1.5 rounded-[10px] border border-white/15 bg-[#061f1c] shadow-xl"
              : "absolute z-30 flex flex-col gap-[12px] top-full start-0 end-0 ps-[18px] pe-[18px] pt-[24.33px] pb-[13.67px] rounded-b-[15px] border-[0.1px] border-white/60 shadow-xl light:border-white/25 light:!bg-[#072E2A] light:!bg-none light:shadow-[0_10px_24px_rgba(7,46,42,0.25)]"
          }
          // Figma's #0000007D over the card's look (page colour + teal/10%),
          // made opaque so the fields underneath don't show through.
          style={
            box
              ? undefined
              : {
                  background:
                    "linear-gradient(#0000007D, #0000007D), linear-gradient(rgb(36 185 165 / 0.1), rgb(36 185 165 / 0.1)), rgb(var(--page))",
                }
          }
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={isSelected}
                // Keep focus on the field while picking with the mouse.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pick(option)}
                onMouseEnter={() => setActive(index)}
                className={
                  box
                    ? `flex items-center h-10 px-3 rounded-[8px] cursor-pointer font-display text-base capitalize transition-colors ${
                        index === active || isSelected
                          ? "bg-white/10 text-[#24B9A5]"
                          : "text-white"
                      }`
                    : `flex items-start h-[28px] border-b-[0.1px] last:border-b-0 border-white/35 cursor-pointer font-display font-medium text-[18px] leading-[22px] capitalize transition-colors ${
                        index === active || isSelected
                          ? "text-teal-accent light:bg-white/10 light:-mx-[6px] light:px-[6px]"
                          : "text-fg"
                      }`
                }
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
