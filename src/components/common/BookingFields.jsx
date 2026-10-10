import { useEffect, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import DurationSelect from "../carDetails/DurationSelect.jsx";

// The booking-card look shared by the site's forms (home booking card,
// Reserve Your Luxury Ride, Contact Us, Quickly Book): a dark teal glass card
// with each field's label above a boxed input, a teal icon at its start, and
// a solid white button. The card stays dark in both themes (over the video
// / like the other form cards), so its colours are fixed: white text, the
// brand teal #24B9A5.
//
// Sizes come from CSS variables so a card can tighten them without touching
// the fields: --box-h (field height, default 40px), --btn-h (button, 44px),
// --area-h (message box, 72px), --field-gap (space between rows, 20px) and
// --col-gap (space between columns, 40px).
// The home card shrinks the gap on short windows so the whole card fits on a
// laptop screen. On phones fields are 44px and buttons 48px (touch size), the
// card has 16px padding and rows are 16px apart, the message box is 80px, and
// short related fields can sit two to a row (BOOKING_PAIR_COLUMNS).

// The card (add width, e.g. `mx-auto max-w-[880px]`, and a form's own extras).
export const BOOKING_CARD =
  "on-dark-surface relative rounded-[25px] border border-[#24B9A5]/25 bg-[linear-gradient(160deg,rgba(7,46,42,0.55)_0%,rgba(0,0,0,0.6)_100%)] light:bg-[#072E2A] light:border-white/20 backdrop-blur-[20px] shadow-[0_24px_60px_rgba(0,0,0,0.45)] px-6 pt-6 pb-6 xl:px-8 max-md:rounded-[20px] max-md:px-4 max-md:pt-4 max-md:pb-4 max-md:[--field-gap:1rem] max-md:[--area-h:5rem]";

// The card's title (start-aligned), and the hairline under it.
export const BOOKING_TITLE =
  "text-[24px] font-semibold leading-tight text-white max-md:text-[22px]";

export function BookingHairline() {
  return <div aria-hidden="true" className="mt-4 h-px bg-white/10" />;
}

// Field rows, 20px apart; columns are 40px apart (--col-gap), the same in the
// two- and four-column rows so their edges line up.
export const BOOKING_FIELDS =
  "mt-4 flex flex-col gap-[var(--field-gap,1.25rem)]";
export const BOOKING_TWO_COLUMNS =
  "grid grid-cols-2 gap-x-[var(--col-gap,5.5rem)] gap-y-[var(--field-gap,1.25rem)] max-md:grid-cols-1";
export const BOOKING_PAIR_COLUMNS =
  "grid grid-cols-2 gap-x-[var(--col-gap,5.5rem)] gap-y-[var(--field-gap,1.25rem)] max-md:gap-x-3 max-[359px]:grid-cols-1";
export const BOOKING_THREE_COLUMNS =
  "grid grid-cols-3 gap-x-[var(--col-gap,2.5rem)] gap-y-[var(--field-gap,1.25rem)] max-lg:grid-cols-2 max-md:grid-cols-1";
export const BOOKING_FOUR_COLUMNS =
  "grid grid-cols-4 gap-x-[var(--col-gap,2.5rem)] gap-y-[var(--field-gap,1.25rem)] max-lg:grid-cols-2 max-md:gap-x-3 max-[359px]:grid-cols-1";

// The form buttons: 44px tall (48px on phones), 18px text (16px on phones).
// `solid` (the submit button) is white with dark teal text and turns brand
// teal on hover; `soft` (a secondary action, e.g. "Add Stop") is a teal wash;
// `page` is the `solid` look for a button on the page itself (not a dark card):
// white in dark mode, dark teal with white text in light mode. `as` renders it
// as another element (a router Link).
// Add `w-full` for a full-width button, or `px-12` for a centred one.
const BUTTON_BASE =
  "relative inline-flex h-[var(--btn-h,2.75rem)] items-center justify-center gap-2 rounded-[10px] font-display text-[18px] leading-[100%] capitalize transition-[background-color,color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 disabled:cursor-wait disabled:opacity-60 max-md:h-12 max-md:text-base";
const BUTTON_LOOK = {
  solid:
    "bg-white font-semibold text-[#072E2A] enabled:hover:bg-[#24B9A5] enabled:hover:text-black",
  soft: "bg-[#24B9A5]/15 font-medium text-[#24B9A5] hover:bg-[#24B9A5]/25",
  page: "bg-white font-semibold text-[#072E2A] hover:bg-[#24B9A5] hover:text-black light:bg-[#072E2A] light:text-white light:hover:bg-[#24B9A5] light:hover:text-black",
};

export function BookingButton({
  as: Tag = "button",
  variant = "solid",
  className = "",
  children,
  ...buttonProps
}) {
  return (
    <Tag
      {...buttonProps}
      className={`${BUTTON_BASE} ${BUTTON_LOOK[variant]} ${className}`}
    >
      {children}
    </Tag>
  );
}

// The boxed field: faint fill and border; the border turns teal with a soft
// ring on focus.
export const BOX =
  "w-full h-[var(--box-h,2.5rem)] max-md:h-11 rounded-[10px] border border-white/[0.12] bg-white/[0.04] pe-4 text-base text-white outline-none transition-[border-color,box-shadow] duration-200 hover:border-white/25 focus:border-[#24B9A5]/70 focus:shadow-[0_0_0_3px_rgba(36,185,165,0.18)]";

// Field label above each box, written as in the translations ("Name",
// "Select Date"...; a trailing colon is dropped), with a teal * on required
// fields.
export function FieldLabel({ text, required }) {
  return (
    <span className="mb-1.5 block text-[13px] leading-[18px] font-medium text-white/80">
      {text.replace(/\s*[:：]\s*$/, "")}
      {required ? (
        <span className="text-[#24B9A5]" aria-hidden="true">
          {" *"}
        </span>
      ) : null}
    </span>
  );
}

export function FieldIcon({ icon: Icon, className = "" }) {
  return (
    <Icon
      aria-hidden="true"
      size={18}
      strokeWidth={1.75}
      className={`pointer-events-none absolute start-4 top-1/2 z-20 -translate-y-1/2 text-[#24B9A5] ${className}`}
    />
  );
}

// Text input with its label above (react-hook-form props come in through
// ControlledField). `icon` is a lucide icon; `readOnly` shows a fixed value.
export function BookingInput({
  label,
  required,
  icon,
  readOnly,
  ...inputProps
}) {
  return (
    <label className="block">
      <FieldLabel text={label} required={required} />
      <span className="relative block">
        {icon ? <FieldIcon icon={icon} /> : null}
        <input
          {...inputProps}
          readOnly={readOnly}
          required={required}
          className={`${BOX} ${icon ? "ps-11" : "ps-4"} placeholder:text-white/40 ${
            readOnly ? "cursor-default text-white/80" : ""
          }`}
        />
      </span>
    </label>
  );
}

// The message box: its label above a box of the same look, two lines tall.
export function BookingTextArea({ label, required, ...textareaProps }) {
  return (
    <label className="block">
      <FieldLabel text={label} required={required} />
      <textarea
        {...textareaProps}
        required={required}
        className="block w-full h-[var(--area-h,4.5rem)] resize-none rounded-[10px] border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-base leading-6 text-white outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-white/40 hover:border-white/25 focus:border-[#24B9A5]/70 focus:shadow-[0_0_0_3px_rgba(36,185,165,0.18)]"
      />
    </label>
  );
}

// The site's date / time pickers (they open their own dialog), drawn as the
// same box: the placeholder shows inside it until a value is picked.
export function BookingPicker({
  picker: Picker,
  label,
  required,
  icon,
  pair = false,
  ...pickerProps
}) {
  return (
    <div>
      <FieldLabel text={label} required={required} />
      <div className="relative">
        <FieldIcon icon={icon} className={pair ? "max-md:hidden" : ""} />
        <Picker
          {...pickerProps}
          fieldClassName={`${BOX} !min-h-0 !py-0 ${pair ? "!ps-4 md:!ps-11" : "!ps-11"} !border !border-white/[0.12] !font-normal !normal-case !text-base !text-white focus-visible:!border-[#24B9A5]/70`}
          floatingLabelClassName={`top-1/2 -translate-y-1/2 ${pair ? "ps-4 md:ps-11" : "ps-11"} text-base font-normal !normal-case text-white/40`}
          floatingLabelActiveClassName="hidden"
        />
      </div>
    </div>
  );
}

// A pick-one list (booking duration, service) in the same box; the list opens
// under it in a matching panel.
export function BookingSelect({ label, required, icon, ...selectProps }) {
  return (
    <div>
      <FieldLabel text={label} required={required} />
      <div className="relative">
        {icon ? <FieldIcon icon={icon} /> : null}
        <DurationSelect
          {...selectProps}
          variant="box"
          fieldClassName={`${BOX} ${icon ? "ps-11" : "ps-4"} flex items-center`}
        />
      </div>
    </div>
  );
}

// A tick box with its question beside it (used through ControlledField: the
// value is a boolean).
export function BookingCheckbox({ label, value, onChange, onBlur, name }) {
  return (
    <label className="flex max-w-full w-fit cursor-pointer items-start gap-3 text-base leading-6 text-white">
      <span className="relative mt-0.5 flex h-5 w-5 shrink-0">
        <input
          type="checkbox"
          name={name}
          checked={!!value}
          onChange={(event) => onChange(event.target.checked)}
          onBlur={onBlur}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded-[6px] border border-white/25 bg-white/[0.04] transition-colors checked:border-[#24B9A5] checked:bg-[#24B9A5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
        />
        <Check
          aria-hidden="true"
          size={14}
          strokeWidth={3}
          className="pointer-events-none absolute inset-0 m-auto text-black opacity-0 transition-opacity peer-checked:opacity-100"
        />
      </span>
      {label}
    </label>
  );
}

// Pick-one choices as side-by-side boxes of the same look (used through
// ControlledField: `value` is the picked option's value, `onChange` gets it).
export function BookingRadioGroup({
  label,
  required,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <div role="radiogroup" aria-label={label}>
      <FieldLabel text={label} required={required} />
      <div className="grid grid-cols-2 gap-3 max-[420px]:grid-cols-1">
        {options.map((option) => {
          const picked = value === option.value;
          return (
            <label key={option.value} className="relative block cursor-pointer">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={picked}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <span
                className={`flex h-[var(--box-h,2.5rem)] max-md:h-11 items-center gap-2.5 rounded-[10px] border px-3 text-base text-white transition-[border-color,background-color] duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white/80 ${
                  picked
                    ? "border-[#24B9A5]/70 bg-[#24B9A5]/10"
                    : "border-white/[0.12] bg-white/[0.04] hover:border-white/25"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="relative h-4 w-4 shrink-0 rounded-full border-[1.5px] border-[#24B9A5]"
                >
                  {picked ? (
                    <span className="absolute inset-[2px] rounded-full bg-[#24B9A5]" />
                  ) : null}
                </span>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// An optional field kept out of the way on phones: a "+ Add a note" button
// opens it (and focuses it); from md up it is always shown. Its value is kept
// when it is hidden again by a resize, and hidden fields stay in the form.
export function OptionalField({ label, children }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const userOpened = useRef(false);

  useEffect(() => {
    if (open && userOpened.current) {
      wrapperRef.current?.querySelector("textarea, input")?.focus();
    }
  }, [open]);

  return (
    <div ref={wrapperRef}>
      {open ? null : (
        <button
          type="button"
          aria-expanded="false"
          onClick={() => {
            userOpened.current = true;
            setOpen(true);
          }}
          className="flex h-11 items-center gap-2 text-base text-[#24B9A5] transition-colors hover:text-white md:hidden"
        >
          <Plus size={18} strokeWidth={2} aria-hidden="true" />
          {label}
        </button>
      )}
      <div className={open ? undefined : "max-md:hidden"}>{children}</div>
    </div>
  );
}
