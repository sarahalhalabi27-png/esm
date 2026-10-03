import smoke from "../../assets/our-luxury-fleet/smoke-bg.webp";

// Faint smoke behind a page section (Figma: 1440 wide, 803 high, cropped to
// fill, 5% opacity), dark mode only. Place it first inside a wrapper that is
// `relative isolate`: it then sits from the wrapper's top edge, above the
// page background (-z-10) but under the content. Phones: as tall as the
// wrapper.
export default function SmokeBackdrop() {
  return (
    <img
      src={smoke}
      alt=""
      aria-hidden="true"
      className="dark-only absolute top-0 left-0 -z-10 w-full max-w-none h-[803px] object-cover opacity-[0.05] pointer-events-none max-md:h-full"
    />
  );
}
