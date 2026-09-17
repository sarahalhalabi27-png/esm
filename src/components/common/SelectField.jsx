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
        <span className="block text-xs text-gray-400 mb-1">{label}</span>
      ) : null}
      <select
        name={name}
        className="w-full bg-black border-b border-white/15 focus:border-teal-accent outline-none py-2 text-sm text-white transition-colors"
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-black">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
