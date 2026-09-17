export default function PrimaryButton({
  children,
  icon: Icon,
  className = "",
  ...rest
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 bg-teal-accent text-[#04241a] transition-transform hover:scale-[1.02] ${className}`}
      {...rest}
    >
      {children}
      {Icon ? <Icon size={16} /> : null}
    </button>
  );
}
