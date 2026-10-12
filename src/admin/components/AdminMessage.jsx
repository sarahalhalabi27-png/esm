// A centred icon + title + text, with an optional action below: used for
// loading, "no access", "not found" and "coming soon" states.
export default function AdminMessage({
  icon: Icon,
  title,
  body,
  action,
  spin = false,
  className = "",
}) {
  return (
    <div
      role={spin ? "status" : undefined}
      className={`flex flex-col items-center justify-center text-center px-6 py-16 ${className}`}
    >
      {Icon && (
        <span className="grid place-items-center w-14 h-14 mb-5 rounded-full bg-teal-accent/10 text-teal-accent">
          <Icon size={26} className={spin ? "animate-spin" : undefined} />
        </span>
      )}
      <h2 className="text-lg font-semibold text-fg">{title}</h2>
      {body && <p className="mt-2 max-w-md text-[15px] text-muted">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
