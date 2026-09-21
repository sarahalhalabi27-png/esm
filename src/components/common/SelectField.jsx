export default function SelectField({
  label,
  name,
  options = [],
  className = "",
  ...rest
}) {
  return (
    <label className={`block ${className}`}>
      {label ? (
        <span className="block text-xs text-muted mb-1">{label}</span>
      ) : null}
      <select
        name={name}
        className="w-full bg-page border-b border-line/15 focus:border-teal-accent outline-none py-2 text-sm text-fg transition-colors"
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-page">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
