import OutlineButton from "./OutlineButton.jsx";

// The forms' hollow submit button: just a border over whatever it sits on,
// filling with its border colour on hover — white with #072E2A text (dark),
// #072E2A with white text (light). `onDark` keeps the white version in both
// themes (a form on a dark card). Size and type via `className`.
const HOLLOW =
  "!border-line !bg-transparent !backdrop-blur-none !text-fg hover:!bg-white hover:!text-[#072E2A] !font-semibold";
const HOLLOW_LIGHT =
  "light:!border-[#072E2A] light:!text-[#072E2A] light:hover:!bg-[#072E2A] light:hover:!text-white";

export default function HollowButton({
  className = "",
  onDark = false,
  ...rest
}) {
  return (
    <OutlineButton
      className={`${HOLLOW} ${onDark ? "" : HOLLOW_LIGHT} ${className}`}
      {...rest}
    />
  );
}
