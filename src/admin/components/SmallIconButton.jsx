// A small square icon button for list rows (move up / down, remove).
export default function SmallIconButton({
  icon: Icon,
  label,
  danger = false,
  ...props
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`grid h-8 w-8 place-items-center rounded-lg transition-colors disabled:opacity-30 ${
        danger
          ? "text-rose-400 light:text-rose-700 hover:bg-rose-500/10"
          : "text-fg/70 hover:bg-surface/[0.06] hover:text-fg"
      }`}
      {...props}
    >
      <Icon size={15} />
    </button>
  );
}
