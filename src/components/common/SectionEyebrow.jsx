export default function SectionEyebrow({ children, className = "" }) {
  return (
    <p
      className={`
        text-[25px]
        font-semibold
        leading-[100%]
        tracking-[0%]
        capitalize
        text-teal-accent
        ${className}
      `}
    >
      {children}
    </p>
  );
}