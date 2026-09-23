export default function FloatingLabel({ text, active }) {
  return (
    <span
      className={`absolute left-0 z-10 pointer-events-none font-display capitalize transition-all duration-500 ease-out ${
        active
          ? "-top-6 text-base text-teal-accent"
          : "top-2 text-[20px] font-semibold text-fg"
      }`}
    >
      {text}
    </span>
  );
}
