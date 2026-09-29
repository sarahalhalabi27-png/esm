import OutlineButton from "./OutlineButton.jsx";

// The forms' hollow submit button: just a border over whatever it sits on,
// filling with its border colour on hover — white with #072E2A text (dark),
// #072E2A with white text (light). Size and type via `className`.
const HOLLOW =
  "!border-line !bg-transparent !backdrop-blur-none !text-fg hover:!bg-white hover:!text-[#072E2A] light:!border-[#072E2A] light:!text-[#072E2A] light:hover:!bg-[#072E2A] light:hover:!text-white !font-semibold";

export default function HollowButton({ className = "", ...rest }) {
  return <OutlineButton className={`${HOLLOW} ${className}`} {...rest} />;
}
