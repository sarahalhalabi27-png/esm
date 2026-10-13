// "Sara Admin" -> "SA", for avatars without a photo.
export function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

// Pill colours for a customer account's status.
export const CUSTOMER_STATUS_TONES = {
  active:
    "bg-emerald-400/15 text-emerald-300 light:bg-emerald-500/15 light:text-emerald-800",
  blocked:
    "bg-rose-400/15 text-rose-300 light:bg-rose-500/15 light:text-rose-800",
};

// The thin bar beside a customer, by account status.
export const CUSTOMER_STATUS_BARS = {
  active: "bg-emerald-400 light:bg-emerald-500",
  blocked: "bg-rose-400 light:bg-rose-500",
};
