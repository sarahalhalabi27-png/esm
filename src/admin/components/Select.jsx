import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ADMIN_INPUT } from "./ui.js";

const GAP = 6; // between the field and its list
const EDGE = 8; // keep the list this far from the window's edge
const MAX_HEIGHT = 320;
const ROW = 42; // a 40px row plus the 2px gap

// A pick-one list in the site's style (the same look as the booking forms'
// DurationSelect): the field is the dashboard's input box with a chevron, and
// the list opens under it in a rounded dark-teal panel; the picked / highlighted
// row is teal on a white wash. A native <select> can't be styled, so the list is
// drawn here.
//
// - options: [{ value, label }]; the field shows the label of the option whose
//   value equals `value`, or `placeholder` when none does.
// - onChange(value) gets the picked value (works with react-hook-form's
//   Controller).
// - The list is positioned from the field's box, so it isn't clipped by a
//   scrolling card or dialog, and it opens upwards when there's no room below.
// - Keyboard: Enter / Space / arrows open; arrows, Home, End move; Enter or
//   Space picks; a letter jumps to the next option starting with it; Esc and
//   Tab close.
// `wrapperClassName` sizes the whole control (width, grid span); other props
// (id, name, aria-*) go to the field button, so a <label htmlFor> works. Inside a disabled <fieldset> it's disabled too.
export default function Select({
  value,
  onChange,
  options,
  placeholder = "",
  disabled = false,
  className = "",
  wrapperClassName = "",
  ...buttonProps
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [place, setPlace] = useState(null);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const listId = useId();
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex];

  const openList = () => {
    setActive(Math.max(0, selectedIndex));
    setOpen(true);
  };
  const close = () => setOpen(false);
  const pick = (option) => {
    onChange(option.value);
    close();
    buttonRef.current?.focus();
  };

  // Where the list goes: right under the field (or above it when it won't fit
  // below), as wide as the field. Re-measured when the window or any
  // scrolling parent moves.
  useLayoutEffect(() => {
    if (!open) return undefined;
    const measure = () => {
      const box = buttonRef.current.getBoundingClientRect();
      const below = window.innerHeight - box.bottom - GAP - EDGE;
      const above = box.top - GAP - EDGE;
      const wanted = Math.min(MAX_HEIGHT, options.length * ROW + 12);
      const up = below < wanted && above > below;
      setPlace({
        left: box.left,
        width: box.width,
        maxHeight: Math.max(ROW * 2, Math.min(MAX_HEIGHT, up ? above : below)),
        ...(up
          ? { bottom: window.innerHeight - box.top + GAP }
          : { top: box.bottom + GAP }),
      });
    };
    const onScroll = (event) => {
      if (!listRef.current?.contains(event.target)) measure();
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, options.length]);

  // Close when clicking anywhere else.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep the highlighted row in view while moving with the keyboard.
  useEffect(() => {
    if (open && active >= 0) {
      listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
    }
  }, [open, active, place]);

  const onKeyDown = (event) => {
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      return;
    }
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        const step = event.key === "ArrowDown" ? 1 : -1;
        setActive((index) => (index + step + options.length) % options.length);
        break;
      }
      case "Home":
      case "End":
        event.preventDefault();
        setActive(event.key === "Home" ? 0 : options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (options[active]) pick(options[active]);
        break;
      case "Escape":
        // Closes the list only, not a dialog it sits in.
        event.preventDefault();
        event.stopPropagation();
        close();
        break;
      case "Tab":
        close();
        break;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
          const letter = event.key.toLowerCase();
          const start = (active + 1) % options.length;
          for (let step = 0; step < options.length; step += 1) {
            const index = (start + step) % options.length;
            if (options[index].label.toLowerCase().startsWith(letter)) {
              setActive(index);
              break;
            }
          }
        }
    }
  };

  return (
    <div ref={rootRef} className={`relative ${wrapperClassName}`}>
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={
          open && active >= 0 ? `${listId}-${active}` : undefined
        }
        disabled={disabled}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        className={`${ADMIN_INPUT} flex items-center text-start pe-10 aria-expanded:border-teal-accent disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        {...buttonProps}
      >
        {selected ? (
          <span className="truncate">{selected.label}</span>
        ) : (
          <span className="truncate text-muted">{placeholder}</span>
        )}
      </button>
      <ChevronDown
        size={18}
        strokeWidth={1.75}
        aria-hidden="true"
        className={`pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-muted transition-transform ${
          open ? "rotate-180" : ""
        }`}
      />

      {open && place && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={buttonProps["aria-label"] ?? placeholder}
          style={place}
          className="fixed z-[70] flex flex-col gap-0.5 overflow-y-auto [scrollbar-color:rgba(255,255,255,0.35)_transparent] [scrollbar-width:thin] rounded-[10px] border border-white/15 bg-[#061f1c] p-1.5 shadow-xl light:border-white/20 light:bg-[#072E2A]"
        >
          {options.map((option, index) => {
            const isSelected = index === selectedIndex;
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
                className={`flex min-h-10 shrink-0 cursor-pointer items-center rounded-[8px] px-3 py-1.5 font-display text-base leading-5 transition-colors ${
                  index === active || isSelected
                    ? "bg-white/10 text-[#24B9A5]"
                    : "text-white"
                }`}
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
