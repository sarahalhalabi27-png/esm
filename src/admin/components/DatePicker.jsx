import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays } from "lucide-react";
import PickerDialog, { PickerActions } from "./PickerDialog.jsx";
import { ADMIN_INPUT, ADMIN_PICKER_SELECT } from "./ui.js";
import { formatDate } from "../utils/format.js";

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const pad = (n) => String(n).padStart(2, "0");
const daysIn = (year, month) => new Date(year, month, 0).getDate();

// A date field that opens the website's month / day / year picker. `value`
// and what `onChange` receives are "YYYY-MM-DD" strings ("" when empty);
// `min` / `max` keep the picked date in range, `clearable` lets an optional
// date be emptied again.
export default function DatePicker({
  id,
  value,
  onChange,
  min,
  max,
  clearable = false,
  placeholder,
  "aria-label": ariaLabel,
}) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-label={ariaLabel}
        onClick={() => setOpen(true)}
        className={`${ADMIN_INPUT} flex items-center justify-between gap-2 !px-3 !text-[14px] text-start ${value ? "text-fg" : "text-muted/70"}`}
      >
        <span className="truncate">
          {value
            ? formatDate(value, i18n.language)
            : (placeholder ?? t("booking.selectDate"))}
        </span>
        <CalendarDays size={16} className="shrink-0 text-muted" />
      </button>

      <PickerDialog
        open={open}
        title={t("booking.selectDate")}
        onClose={() => setOpen(false)}
      >
        <DateSelects
          value={value}
          min={min}
          max={max}
          onCancel={() => setOpen(false)}
          onClear={
            clearable && value
              ? () => {
                  onChange("");
                  setOpen(false);
                }
              : undefined
          }
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
        />
      </PickerDialog>
    </>
  );
}

function DateSelects({ value, min, max, onSelect, onCancel, onClear }) {
  const { t, i18n } = useTranslation();
  const [initial] = useState(() => {
    const now = new Date();
    return value
      ? value.split("-").map(Number)
      : [now.getFullYear(), now.getMonth() + 1, now.getDate()];
  });
  const [year, setYear] = useState(initial[0]);
  const [month, setMonth] = useState(initial[1]);
  const [day, setDay] = useState(initial[2]);

  const thisYear = new Date().getFullYear();
  const firstYear = Math.min(thisYear - 5, initial[0]);
  const lastYear = Math.max(thisYear + 5, initial[0]);
  const years = Array.from(
    { length: lastYear - firstYear + 1 },
    (_, index) => firstYear + index
  );
  // Changing to a shorter month keeps the day inside it (31 -> 28/30).
  const safeDay = Math.min(day, daysIn(year, month));

  const confirm = () => {
    let date = `${year}-${pad(month)}-${pad(safeDay)}`;
    if (min && date < min) date = min;
    if (max && date > max) date = max;
    onSelect(date);
  };

  return (
    <>
      <div
        dir={i18n.dir()}
        className="flex items-center justify-center gap-2 max-md:gap-1.5"
      >
        <select
          value={month}
          onChange={(event) => setMonth(Number(event.target.value))}
          className={`${ADMIN_PICKER_SELECT} w-[105px]`}
        >
          {MONTHS.map((name, index) => (
            <option key={name} value={index + 1}>
              {t(`booking.months.${name}`)}
            </option>
          ))}
        </select>
        <select
          value={safeDay}
          onChange={(event) => setDay(Number(event.target.value))}
          className={`${ADMIN_PICKER_SELECT} w-[60px]`}
        >
          {Array.from({ length: daysIn(year, month) }, (_, index) => (
            <option key={index} value={index + 1}>
              {pad(index + 1)}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(event) => setYear(Number(event.target.value))}
          className={`${ADMIN_PICKER_SELECT} w-[78px]`}
        >
          {years.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <PickerActions onCancel={onCancel} onDone={confirm} onClear={onClear} />
    </>
  );
}
