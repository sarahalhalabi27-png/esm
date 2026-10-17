// Shared dashboard class strings, built on the site's theme tokens
// (index.css), so the dashboard follows dark/light like the website.

export const ADMIN_CARD =
  "rounded-2xl border border-line/10 bg-surface/[0.03] light:bg-surface/[0.02]";

// The richer card used on the pages, lists and tables: a faint teal wash and a
// soft shadow in both modes. In light mode the teal is a real teal (the brand
// teal there is almost black) and the shadow is teal-tinted too.
export const ADMIN_CARD_RICH =
  "rounded-2xl border border-line/10 bg-gradient-to-br from-teal-accent/[0.08] via-surface/[0.03] to-surface/[0.015] shadow-[0_10px_30px_-14px_rgba(0,0,0,0.7)] light:from-teal-500/[0.10] light:via-teal-500/[0.03] light:to-transparent light:shadow-[0_10px_28px_-16px_rgba(15,118,110,0.45)]";

export const ADMIN_LABEL = "block mb-2 text-sm font-medium text-fg/80";

export const ADMIN_INPUT =
  "w-full h-11 rounded-[10px] border border-line/15 bg-surface/[0.04] px-4 text-[15px] text-fg placeholder:text-muted/70 light:placeholder:text-muted outline-none transition-colors focus:border-teal-accent aria-[invalid=true]:border-red-500/70";

// The white month / day / year (hour / minute) selects inside the date and
// time pickers, as on the website's booking pickers.
export const ADMIN_PICKER_SELECT =
  "h-[42px] max-md:h-[44px] min-w-0 rounded-[8px] border border-black bg-white text-center text-[15px] text-black outline-none";

export const ADMIN_FIELD_ERROR =
  "mt-1.5 text-sm text-red-400 light:text-red-600";

// Solid accent button: bright teal with black text in dark mode, dark teal
// with white text in light mode (text-page flips with the theme). Disabled
// shows the not-allowed cursor; while it is working (set aria-busy on it)
// it shows the wait cursor instead.
export const ADMIN_BUTTON =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-teal-accent px-5 text-[15px] font-semibold text-page transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-accent disabled:cursor-not-allowed disabled:opacity-60 aria-busy:!cursor-wait";

export const ADMIN_BUTTON_GHOST =
  "inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-line/15 px-4 text-sm text-fg/80 transition-colors hover:bg-surface/[0.06] hover:text-fg";

// Round 42px icon button, matching the site's ThemeToggle.
export const ADMIN_ICON_BUTTON =
  "grid place-items-center w-[42px] h-[42px] shrink-0 rounded-full border border-teal-accent/40 text-teal-accent transition-colors hover:bg-teal-accent/10";

// The thin coloured bar beside a booking row, by status.
export const STATUS_BARS = {
  new: "bg-amber-400 light:bg-yellow-400",
  confirmed: "bg-sky-400 light:bg-sky-500",
  completed: "bg-emerald-400 light:bg-emerald-500",
  cancelled: "bg-rose-400 light:bg-rose-500",
};
