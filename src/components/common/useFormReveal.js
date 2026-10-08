import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION_OK } from "../../utils/motion.js";

gsap.registerPlugin(ScrollTrigger);

// The form cards' reveal (car reservation, blog comment), played once when
// the form scrolls into view (skipped when the viewer prefers reduced
// motion): the card rises in, then its title, then
// the fields one after another, each wiped in from the start side (the wipe
// leaves room above for floated labels such as "Your Fleet").
export default function useFormReveal(isRtl, { replay = false } = {}) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      // The card is the form itself (Contact, no title) or wraps one.
      const title = card.querySelector("h2");
      const form = card.matches("form") ? card : card.querySelector("form");
      const fields = [...form.children].flatMap((row) =>
        row.classList.contains("grid") ? [...row.children] : [row]
      );
      const clipped = isRtl
        ? "inset(-40px 0 -12px 100%)"
        : "inset(-40px 100% -12px 0)";

      gsap.set([card, ...(title ? [title] : []), ...fields], { autoAlpha: 0 });

      const tl = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .fromTo(
          card,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.9, clearProps: "transform" }
        );
      if (title) {
        tl.fromTo(
          title,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          "-=0.5"
        );
      }
      tl.fromTo(
        fields,
        { autoAlpha: 1, clipPath: clipped },
        {
          clipPath: "inset(-40px 0% -12px 0%)",
          duration: 0.8,
          ease: "power2.inOut",
          stagger: 0.07,
          clearProps: "clipPath",
        },
        "-=0.3"
      );

      if (replay) {
        // Plays every time the form comes into view, resets when it leaves.
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          end: "bottom top",
          animation: tl,
          toggleActions: "restart reset restart reset",
        });
        return;
      }

      // Images above the form load after this runs and push it down, so an
      // early "enter" is ignored. The trigger does not fire "enter" again when
      // it is already past its start (e.g. the page jumped straight to the
      // form), so the check is repeated on every refresh / scroll update /
      // leave until the form has really reached the viewport.
      const playIfVisible = (self) => {
        if (
          card.getBoundingClientRect().top >
          window.innerHeight * 0.85 + 2
        ) {
          return;
        }
        tl.play();
        self.kill();
      };
      ScrollTrigger.create({
        trigger: card,
        start: "top 85%",
        onEnter: playIfVisible,
        onUpdate: playIfVisible,
        onRefresh: playIfVisible,
        onLeave: (self) => {
          tl.play();
          self.kill();
        },
      });
    });

    return () => mm.revert();
  }, [isRtl, replay]);

  return cardRef;
}
