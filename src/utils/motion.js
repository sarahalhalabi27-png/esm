// Media query for gsap.matchMedia(): animations run only when the viewer
// hasn't asked for reduced motion.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

// For one-off checks outside gsap.matchMedia (e.g. before a click animation).
export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
