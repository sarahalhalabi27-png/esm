import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { BOX, FieldIcon, FieldLabel } from "../common/BookingFields.jsx";

// A password field in the booking-card look: a lock icon at the start and a
// button at the end that shows / hides what was typed. `hint` is a short line
// of help under the box (react-hook-form props come in through
// ControlledField, which shows the validation error below that).
export default function PasswordInput({
  label,
  required,
  hint,
  showLabel,
  hideLabel,
  ...inputProps
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <FieldLabel text={label} required={required} />
      <span className="relative block">
        <FieldIcon icon={Lock} />
        <input
          {...inputProps}
          type={visible ? "text" : "password"}
          required={required}
          className={`${BOX} ps-11 pe-12 placeholder:text-white/40`}
        />
        <button
          type="button"
          onClick={() => setVisible((shown) => !shown)}
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          className="absolute end-1 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-[8px] text-white/60 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/80"
        >
          {visible ? (
            <EyeOff size={18} strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Eye size={18} strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
      </span>
      {hint ? (
        <span className="mt-1.5 block text-[13px] leading-snug text-white/50">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
