import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HorizonArc from "../common/HorizonArc.jsx";
import defaultCar from "../../assets/our-luxury-fleet/lexus.webp";

gsap.registerPlugin(ScrollTrigger);

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

// Figma (1440 frame): the car's name, letter-spaced, centered over the car;
// the car (740 wide) stands on the curved teal horizon, with a soft teal glow
// behind it.
//
// Motion (skipped when the viewer prefers reduced motion), replayed for each
// car opened:
// 1. the name fades in as its letters close up to their spacing;
// 2. the horizon draws out from the centre to both edges;
// 3. the car drives in from the right — the way its front faces — easing to
//    a stop on the horizon, while the glow fades up behind it;
// 4. one soft band of light sweeps across the body;
// then, on scroll, the car drifts up a little slower than the page and eases
// back in size, and the glow dims (a touch of depth).
export default function CarDetailsHero({ car }) {
  const rootRef = useRef(null);
  const image = car.image || defaultCar;

  useEffect(() => {
    const root = rootRef.current;
    const mm = gsap.matchMedia(root);

    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(root);
      const [title] = q("[data-hero-title]");
      const [arc] = q("[data-hero-arc]");
      const [carImg] = q("[data-hero-car]");
      const [shine] = q("[data-hero-shine]");
      const [glow] = q("[data-hero-glow]");
      const [stage] = q("[data-hero-stage]");
      const [glowWrap] = q("[data-hero-glow-wrap]");
      const narrow = window.matchMedia("(max-width: 767.98px)").matches;

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(title, {
          opacity: 0,
          y: 12,
          letterSpacing: narrow ? "8px" : "14px",
          duration: 0.9,
        })
        .fromTo(
          arc,
          { clipPath: "inset(0 50% 0 50%)" },
          { clipPath: "inset(0 0% 0 0%)", duration: 1, ease: "power2.inOut" },
          "-=0.55"
        )
        .from(
          carImg,
          {
            opacity: 0,
            xPercent: narrow ? 35 : 45,
            duration: 1.3,
            ease: "power4.out",
          },
          "-=0.6"
        )
        .from(glow, { opacity: 0, scale: 0.85, duration: 1.2 }, "<0.15")
        .fromTo(
          shine,
          { backgroundPosition: "160% 0" },
          {
            backgroundPosition: "-60% 0",
            duration: 1.2,
            ease: "power1.inOut",
          },
          "-=0.35"
        );

      // Scroll depth: the car lags the page slightly and eases back in size.
      const scroll = {
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      };
      gsap.to(stage, {
        yPercent: 12,
        scale: 0.94,
        ease: "none",
        scrollTrigger: scroll,
      });
      gsap.to(glowWrap, { opacity: 0.35, ease: "none", scrollTrigger: scroll });
    });

    return () => mm.revert();
  }, [car.id]);

  return (
    <section
      ref={rootRef}
      className="font-display px-[50px] pt-[90px] max-md:px-6 max-md:pt-10"
    >
      <h1
        data-hero-title
        className="text-center text-[22px] font-semibold leading-[30px] tracking-[5px] text-fg max-md:text-lg max-md:tracking-[3px]"
      >
        {car.name}
      </h1>

      <div className="relative w-full max-w-[1341px] mx-auto mt-[60px] max-md:mt-8">
        {/* Glow (the wrapper takes the scroll dimming, the glow its intro) */}
        <div
          data-hero-glow-wrap
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
        >
          <div
            data-hero-glow
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] max-w-[120%] aspect-[2/1] rounded-full blur-[40px] opacity-70 [[data-theme=light]_&]:opacity-40"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(36,185,165,0.35) 0%, rgba(7,46,42,0.25) 45%, transparent 70%)",
            }}
          />
        </div>

        {/* The car and its light sweep share one box; the stage takes the
            scroll depth, the car its drive-in. */}
        <div
          data-hero-stage
          className="relative z-10 w-[740px] max-w-[85%] h-[330px] mx-auto origin-bottom max-md:h-auto max-md:aspect-[2/1]"
        >
          <img
            data-hero-car
            src={image}
            alt={car.name}
            className="block w-full h-full object-contain object-bottom"
          />
          {/* A band of light, drawn only where the car is (masked by the
              same image, fitted the same way), parked off to the side until
              the intro sweeps it across. */}
          <div
            data-hero-shine
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none mix-blend-screen"
            style={{
              backgroundImage:
                "linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.45) 50%, transparent 58%)",
              backgroundSize: "250% 100%",
              backgroundPosition: "160% 0",
              backgroundRepeat: "no-repeat",
              WebkitMask: `url(${image}) center bottom / contain no-repeat`,
              mask: `url(${image}) center bottom / contain no-repeat`,
            }}
          />
        </div>

        {/* The horizon passes behind the car's wheels */}
        <div data-hero-arc className="-mt-[22px] max-md:-mt-2">
          <HorizonArc />
        </div>
      </div>
    </section>
  );
}
