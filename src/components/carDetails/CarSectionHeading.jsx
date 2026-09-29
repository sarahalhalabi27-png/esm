import MaskIcon from "../common/MaskIcon.jsx";

// Section title on Car Details (Figma): a teal outline icon, then the title.
// Titles may hold a teal accent part (see <Trans> callers).
// The icon is either a lucide component (`icon`) or an exported Figma SVG
// (`iconSrc`, with its Figma box in `iconClassName`), drawn with MaskIcon so
// it recolours with the theme. `className` overrides the title's
// type/spacing.
export default function CarSectionHeading({
  icon: Icon,
  iconSrc,
  iconClassName = "w-8 h-7",
  className = "gap-3 text-[22px] max-md:text-lg max-md:gap-2.5",
  children,
  as: Tag = "h2",
}) {
  return (
    <Tag
      className={`flex items-center font-semibold leading-[30px] capitalize text-fg ${className}`}
    >
      {iconSrc ? (
        <MaskIcon src={iconSrc} className={iconClassName} />
      ) : (
        <Icon
          size={30}
          strokeWidth={1.4}
          className="shrink-0 text-teal-accent max-md:w-6 max-md:h-6"
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </Tag>
  );
}
