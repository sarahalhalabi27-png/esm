export default function SectionEyebrow({ children, className = "" }) {
  return (
    <p className={`text-sm font-medium text-teal-accent mb-2 ${className}`}>
      {children}
    </p>
  );
}
