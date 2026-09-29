export default function TextAreaField({
  label,
  labelClassName = "text-xs text-muted mb-1",
  name,
  rows = 4,
  required,
  className = "",
  textareaClassName = "",
  ...rest
}) {
  return (
    <label className={`block ${className}`}>
      {label ? (
        <span className={`block ${labelClassName}`}>{label}</span>
      ) : null}
      <textarea
        name={name}
        rows={rows}
        required={required}
        className={`w-full bg-transparent border border-line/15 focus:border-teal-accent outline-none rounded-lg p-3 text-sm text-fg placeholder:text-muted transition-colors resize-none ${textareaClassName}`}
        {...rest}
      />
    </label>
  );
}
