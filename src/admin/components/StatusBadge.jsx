import { useTranslation } from "react-i18next";

const TONES = {
  new: "bg-amber-400/15 text-amber-300 light:bg-yellow-300/60 light:text-yellow-900",
  confirmed:
    "bg-sky-400/15 text-sky-300 light:bg-sky-500/15 light:text-sky-800",
  completed:
    "bg-emerald-400/15 text-emerald-300 light:bg-emerald-500/15 light:text-emerald-800",
  cancelled:
    "bg-rose-400/15 text-rose-300 light:bg-rose-500/15 light:text-rose-800",
};

// A booking status as a coloured pill.
export default function StatusBadge({ status }) {
  const { t } = useTranslation("admin");
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-[13px] font-medium whitespace-nowrap ${TONES[status] ?? ""}`}
    >
      <span
        aria-hidden="true"
        className="w-1.5 h-1.5 rounded-full bg-current"
      />
      {t(`bookings.status.${status}`)}
    </span>
  );
}
