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

// One colour set per role, by its place in the roles list, so a role looks the
// same on the staff and roles pages: `chip` (a tag or icon square), `bar`
// (a gradient start for a top line) and `stripe` (a solid side bar).
export const ROLE_TONES = [
  {
    chip: "bg-teal-accent/15 text-teal-accent",
    bar: "from-teal-accent",
    stripe: "bg-teal-accent",
  },
  {
    chip: "bg-sky-400/15 text-sky-300 light:bg-sky-500/15 light:text-sky-700",
    bar: "from-sky-400 light:from-sky-500",
    stripe: "bg-sky-400 light:bg-sky-500",
  },
  {
    chip: "bg-violet-400/15 text-violet-300 light:bg-violet-500/15 light:text-violet-700",
    bar: "from-violet-400 light:from-violet-500",
    stripe: "bg-violet-400 light:bg-violet-500",
  },
  {
    chip: "bg-amber-400/15 text-amber-300 light:bg-amber-500/15 light:text-amber-700",
    bar: "from-amber-400 light:from-amber-500",
    stripe: "bg-amber-400 light:bg-amber-500",
  },
  {
    chip: "bg-rose-400/15 text-rose-300 light:bg-rose-500/15 light:text-rose-700",
    bar: "from-rose-400 light:from-rose-500",
    stripe: "bg-rose-400 light:bg-rose-500",
  },
  {
    chip: "bg-emerald-400/15 text-emerald-300 light:bg-emerald-500/15 light:text-emerald-700",
    bar: "from-emerald-400 light:from-emerald-500",
    stripe: "bg-emerald-400 light:bg-emerald-500",
  },
];

export function roleTone(roles, roleId) {
  const index = roles.findIndex((role) => role.id === roleId);
  return ROLE_TONES[Math.max(0, index) % ROLE_TONES.length];
}
