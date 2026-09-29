// Classes shared by the site's card forms (Car Details reservation, Blog
// comments, Contact). Full literal strings so Tailwind picks them up.

// An accent line that fills the field's underline from the start side while
// it has focus (drawn as a background so it sits on top of the border).
// `!` beats the shared fields' own transition-colors.
export const FOCUS_FILL =
  "bg-no-repeat [background-image:linear-gradient(rgb(var(--accent)),rgb(var(--accent)))] [background-size:0%_1.5px] [background-position:left_bottom] rtl:[background-position:right_bottom] !transition-[background-size] !duration-500 !ease-out focus:[background-size:100%_1.5px]";

// Same, for a wrapper whose inner input takes the focus (Contact's lines).
export const FOCUS_WITHIN_FILL =
  "bg-no-repeat [background-image:linear-gradient(rgb(var(--accent)),rgb(var(--accent)))] [background-size:0%_1.5px] [background-position:left_bottom] rtl:[background-position:right_bottom] transition-[background-size] duration-500 ease-out focus-within:[background-size:100%_1.5px]";

// The fields' 0.5px underline: white/60% (dark), #072E2A/40% (light).
export const FIELD_UNDERLINE =
  "!border-b-[0.5px] !border-white/60 light:!border-[#072E2A]/40";

// The form card (Figma: radius 25, 1px white/60% border, teal/10% fill,
// 74/72px sides — 75/73 with the border — and 41px top). Bottom padding is
// set by each form.
export const FORM_CARD =
  "rounded-[25px] border border-white/60 light:border-[#072E2A]/25 bg-[#24B9A5]/10 ps-[74px] pe-[72px] pt-[41px] max-lg:px-10 max-md:rounded-[20px] max-md:px-5 max-md:pt-8 max-md:pb-10";

// The card's centred title (Medium 25px, 7% tracking).
export const FORM_TITLE =
  "text-center text-[25px] font-medium leading-[30px] tracking-[0.07em] capitalize text-fg light:text-[#072E2A] max-md:text-lg max-md:tracking-[0.04em]";
