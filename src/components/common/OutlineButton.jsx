export default function OutlineButton({
  children,
  icon: Icon,
  className = "",
  ...rest
}) {
  return (
    <button
      className={`
  inline-flex items-center justify-center
  gap-2
  font-display
  font-medium
  text-[18px]
  leading-[100%]
  tracking-[0%]
  capitalize
  rounded-[10px]
  border-[0.5px]
  border-line
  bg-page/70
  backdrop-blur-[30px]
  transition-colors
  ${className}
`}
      {...rest}
    >
      {children}
      {Icon ? <Icon size={14} /> : null}
    </button>
  );
}
