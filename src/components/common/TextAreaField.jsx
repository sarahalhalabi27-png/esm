export default function TextAreaField({
  label,
  name,
  rows = 4,
  required,
  className = "",
  ...rest
}) {
  return (
    <label className={`block ${className}`}>
      {label ? (
        <span className="block text-xs text-muted mb-1">{label}</span>
      ) : null}
      <textarea
        name={name}
        rows={rows}
        required={required}
        className="w-full bg-transparent border border-line/15 focus:border-teal-accent outline-none rounded-lg p-3 text-sm text-fg placeholder:text-muted transition-colors resize-none"
        {...rest}
      />
    </label>
  );
}
