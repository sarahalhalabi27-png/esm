import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";
import PickerDialog, { PickerActions } from "./PickerDialog.jsx";
import { ADMIN_INPUT, ADMIN_PICKER_SELECT } from "./ui.js";

const pad = (n) => String(n).padStart(2, "0");

// A time field that opens the website's hour / minute / AM-PM picker.
// `value` and what `onChange` receives are 24-hour "HH:mm" strings, the form
// the bookings use ("" when empty).
export default function TimePicker({
  id,
  value,
  onChange,
  clearable = false,
  placeholder,
  "aria-label": ariaLabel,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-label={ariaLabel}
        onClick={() => setOpen(true)}
        className={`${ADMIN_INPUT} flex items-center justify-between gap-2 !px-3 !text-[14px] text-start tabular-nums ${value ? "text-fg" : "text-muted"}`}
      >
        <span className="truncate">
          {value || (placeholder ?? t("booking.selectTime"))}
        </span>
        <Clock size={16} className="shrink-0 text-muted" />
      </button>

      <PickerDialog
        open={open}
        title={t("booking.selectTime")}
        width={260}
        onClose={() => setOpen(false)}
      >
        <TimeSelects
          value={value}
          onCancel={() => setOpen(false)}
          onClear={
            clearable && value
              ? () => {
                  onChange("");
                  setOpen(false);
                }
              : undefined
          }
          onSelect={(time) => {
            onChange(time);
            setOpen(false);
          }}
        />
      </PickerDialog>
    </>
  );
}

function TimeSelects({ value, onSelect, onCancel, onClear }) {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [initial] = useState(() => {
    const [h24, min] = value ? value.split(":").map(Number) : [8, 0];
    return { hour: h24 % 12 || 12, minute: min, pm: h24 >= 12 };
  });
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [pm, setPm] = useState(initial.pm);

  const confirm = () =>
    onSelect(`${pad((hour % 12) + (pm ? 12 : 0))}:${pad(minute)}`);

  return (
    <>
      <div
        dir="ltr"
        className="flex items-center justify-center gap-2 max-md:gap-1.5"
      >
        <select
          value={hour}
          onChange={(event) => setHour(Number(event.target.value))}
          className={`${ADMIN_PICKER_SELECT} w-[60px]`}
        >
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={index + 1}>
              {pad(index + 1)}
            </option>
          ))}
        </select>
        <span className="text-[20px]">:</span>
        <select
          value={minute}
          onChange={(event) => setMinute(Number(event.target.value))}
          className={`${ADMIN_PICKER_SELECT} w-[60px]`}
        >
          {Array.from({ length: 60 }, (_, index) => (
            <option key={index} value={index}>
              {pad(index)}
            </option>
          ))}
        </select>
        <select
          value={pm ? "PM" : "AM"}
          onChange={(event) => setPm(event.target.value === "PM")}
          className={`${ADMIN_PICKER_SELECT} w-[60px]`}
        >
          <option value="AM">{isRTL ? "ص" : "AM"}</option>
          <option value="PM">{isRTL ? "م" : "PM"}</option>
        </select>
      </div>
      <PickerActions onCancel={onCancel} onDone={confirm} onClear={onClear} />
    </>
  );
}
