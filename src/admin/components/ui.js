// Shared dashboard class strings, built on the site's theme tokens
// (index.css), so the dashboard follows dark/light like the website.

export const ADMIN_CARD =
  "rounded-2xl border border-line/10 bg-surface/[0.03] light:bg-surface/[0.02]";

export const ADMIN_LABEL = "block mb-2 text-sm font-medium text-fg/80";

export const ADMIN_INPUT =
  "w-full h-11 rounded-[10px] border border-line/15 bg-surface/[0.04] px-4 text-[15px] text-fg placeholder:text-muted/70 outline-none transition-colors focus:border-teal-accent aria-[invalid=true]:border-red-500/70";

// A native date field: tighter side padding and 14px text, so the whole
// "mm/dd/yyyy" and the calendar icon fit without overlapping (the browser
// draws both inside the box). It follows the dark/light theme.
export const ADMIN_DATE_INPUT = `${ADMIN_INPUT} !px-3 !text-[14px] [color-scheme:dark] light:[color-scheme:light]`;

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
