// An on/off toggle (role="switch"). Pass `label` for screen readers when no
// visible text names it.
export default function Switch({
  checked,
  onChange,
  disabled = false,
  label,
  className = "",
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-accent disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-teal-accent" : "bg-surface/20"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked
            ? "ltr:translate-x-[22px] rtl:-translate-x-[22px]"
            : "ltr:translate-x-0.5 rtl:-translate-x-0.5"
        }`}
      />
    </button>
  );
}
