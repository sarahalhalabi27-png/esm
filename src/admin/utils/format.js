// Date formatting for the dashboard, in the current language (Arabic with
// Latin digits, like the rest of the site).
const locale = (language) => (language === "ar" ? "ar-AE-u-nu-latn" : "en-GB");

// "YYYY-MM-DD" is read as a local date (new Date("2026-10-12") would be UTC).
function toDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00`)
    : new Date(value);
}

// 12 Oct 2026
export function formatDate(value, language) {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale(language), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(toDate(value));
}

// 12 Oct 2026, 14:30 (from an ISO timestamp)
export function formatDateTime(value, language) {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale(language), {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(toDate(value));
}

// Inbox style: the time for today, "12 Oct" this year, "12 Oct 2025" before.
export function formatShortDateTime(value, language) {
  if (!value) return "";
  const date = toDate(value);
  const now = new Date();
  const options =
    date.toDateString() === now.toDateString()
      ? { hour: "2-digit", minute: "2-digit", hour12: false }
      : date.getFullYear() === now.getFullYear()
        ? { day: "numeric", month: "short" }
        : { day: "numeric", month: "short", year: "numeric" };
  return new Intl.DateTimeFormat(locale(language), options).format(date);
}

// A date and an "HH:mm" time kept apart, as the booking forms send them.
export function formatDateAndTime(date, time, language) {
  return [formatDate(date, language), time].filter(Boolean).join(" · ");
}
