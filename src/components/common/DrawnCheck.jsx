import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "../../utils/motion.js";

// A tick drawn in (stroke by stroke) — shown inside a form's button for a
// moment after it is sent.
export default function DrawnCheck() {
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    if (prefersReducedMotion()) return;
    const length = path.getTotalLength();
    gsap.fromTo(
      path,
      { strokeDasharray: length, strokeDashoffset: length },
      { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d="M6 14.5l5.5 5.5L22.5 8.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
