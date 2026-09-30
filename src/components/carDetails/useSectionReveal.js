import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_OK } from "../../utils/motion.js";

gsap.registerPlugin(ScrollTrigger);

// Seconds the Car Details sections above a given one take to play on load
// (hero ≈ 1.6s, then the description, then the features). A section that's
// already on screen at load (a tall screen) waits until those have played.
export const CAR_DETAILS_INTRO = {
  description: 1.6,
  features: 2.4,
  interior: 3.2,
};

// The Car Details sections' titles slide in from the start side.
export function slideInFromStart(tl, target, direction) {
  return tl.fromTo(
    target,
    { autoAlpha: 0, x: -30 * direction },
    { autoAlpha: 1, x: 0, duration: 0.8 }
  );
}

// Plays a section's reveal once, when it scrolls into view (top at 85% of
// the viewport), unless the viewer prefers reduced motion; replays for each
// car / language (`key`). `build({ root, tl, direction })` adds the
// section's steps to the paused timeline `tl` (defaults ease power3.out) and
// may return a cleanup. `direction` is 1, or -1 in right-to-left languages.
// Returns the ref for the section's root element (also the trigger).
export default function useSectionReveal(build, { key, waitOnLoad = 0 }) {
  const rootRef = useRef(null);
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const mountedAt = performance.now();
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });
      const cleanup = build({ root, tl, direction: isRtl ? -1 : 1 });

      ScrollTrigger.create({
        trigger: root,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const sinceMount = (performance.now() - mountedAt) / 1000;
          tl.delay(Math.max(0, waitOnLoad - sinceMount)).play();
        },
      });

      return cleanup;
    });

    return () => mm.revert();
    // `build` is a module-level function; the reveal replays only when the
    // section's content (`key`) or the text direction changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, isRtl, waitOnLoad]);

  return rootRef;
}
