import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FleetCarCard from "./FleetCarCard.jsx";
import { MOTION_OK, prefersReducedMotion } from "../../utils/motion.js";

gsap.registerPlugin(ScrollTrigger);

// Each category plays in as it scrolls into view — the branch
// and dot, then the name, then its cars, and the trunk line draws on down
// towards the next category.
// Set to false to drop it (the page then renders as-is).
const SCROLL_REVEAL = true;

// One step of the Fleet Collection timeline (Figma 1440 frame): the trunk
// line on the start edge curves into a glowing dot before the category name,
// with the category's cars in a row below it. The row scrolls sideways — by
// swipe, or one card per click of the arrow button (back to the start once
// the end is reached). Clicks glide the row with GSAP: the car coming into
// view slides and fades in, the one leaving fades out.
// Phones: the row starts under the category name (clear of the trunk line)
// and the arrow sits at the end of the name's line.
export default function FleetCategorySection({ category, isLast }) {
  const { t, i18n } = useTranslation();
  const rowRef = useRef(null);
  const sectionRef = useRef(null);
  const trunkRef = useRef(null);
  const elbowRef = useRef(null);
  const dotRef = useRef(null);
  const nameRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);
  const direction = i18n.dir() === "rtl" ? -1 : 1;
  const categoryName = t(`fleetPage.categories.${category.id}`, {
    defaultValue: category.name,
  });

  // The arrow only does something once the row overflows (more cars than fit).
  useEffect(() => {
    const row = rowRef.current;
    const update = () => setCanScroll(row.scrollWidth > row.clientWidth + 1);
    const observer = new ResizeObserver(update);
    observer.observe(row);
    update();
    return () => {
      observer.disconnect();
      gsap.killTweensOf([row, ...row.children]);
    };
  }, [category.cars.length]);

  useEffect(() => {
    if (!SCROLL_REVEAL) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const section = sectionRef.current;

      const timeline = gsap
        .timeline({
          scrollTrigger: { trigger: section, start: "top 80%", once: true },
        })
        .from(elbowRef.current, {
          opacity: 0,
          scaleY: 0,
          transformOrigin: "top",
          duration: 0.35,
          ease: "power1.out",
        })
        .from(dotRef.current, {
          scale: 0,
          duration: 0.5,
          ease: "back.out(2.5)",
        })
        .from(
          nameRef.current,
          { opacity: 0, x: -16 * direction, duration: 0.5, ease: "power2.out" },
          "-=0.3"
        )
        .from(
          [...rowRef.current.children],
          {
            opacity: 0,
            x: 40 * direction,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.12,
            clearProps: "opacity,transform",
          },
          "-=0.2"
        );
      if (trunkRef.current) {
        timeline.from(
          trunkRef.current,
          {
            scaleY: 0,
            transformOrigin: "top",
            duration: 0.9,
            ease: "power1.inOut",
          },
          "-=0.5"
        );
      }
    });
    return () => mm.revert();
  }, [direction]);

  const showNext = (event) => {
    const row = rowRef.current;
    const cards = [...row.children];
    if (!cards.length || gsap.isTweening(row)) return;

    const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
    const step = cards[0].offsetWidth + gap;
    const maxScroll = row.scrollWidth - row.clientWidth;
    // scrollLeft runs from 0 to -maxScroll in RTL, so work in magnitudes.
    const current = Math.abs(row.scrollLeft);
    const wrapping = current >= maxScroll - 2;
    const target =
      direction * (wrapping ? 0 : Math.min(current + step, maxScroll));

    if (prefersReducedMotion()) {
      row.scrollLeft = target;
      return;
    }

    // Which cards are fully in view now, and after the scroll (content moves
    // on screen by the opposite of the scrollLeft change).
    const rowBox = row.getBoundingClientRect();
    const shift = target - row.scrollLeft;
    const inView = (box, offset) =>
      box.left - offset >= rowBox.left - 1 &&
      box.right - offset <= rowBox.right + 1;
    const boxes = cards.map((card) => card.getBoundingClientRect());
    const entering = cards.filter(
      (_, i) => !inView(boxes[i], 0) && inView(boxes[i], shift)
    );
    const leaving = cards.filter(
      (_, i) => inView(boxes[i], 0) && !inView(boxes[i], shift)
    );

    // Snap would fight the tweened scroll position — pause it meanwhile.
    row.style.scrollSnapType = "none";
    gsap.to(row, {
      scrollLeft: target,
      duration: wrapping ? 1.1 : 0.9,
      ease: "power3.inOut",
      onComplete: () => {
        row.style.scrollSnapType = "";
        // Now off screen: restore them (stop any fade still running first).
        gsap.killTweensOf(leaving, "opacity");
        gsap.set(leaving, { clearProps: "opacity" });
      },
    });
    gsap.to(leaving, { opacity: 0, duration: 0.35, ease: "power1.out" });
    // Going forward, the new car slides in from the end side; wrapping back
    // brings several in at once, staggered in from the start side.
    gsap.fromTo(
      entering,
      { opacity: 0, x: (wrapping ? -60 : 60) * direction, scale: 0.92 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.9,
        delay: 0.2,
        ease: "power3.out",
        stagger: 0.08,
        clearProps: "opacity,transform",
      }
    );
    // Arrow nudge in the scroll direction.
    gsap.fromTo(
      event.currentTarget.querySelector("[data-arrow-icon]"),
      { x: 0 },
      {
        x: 8 * direction,
        duration: 0.18,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      }
    );
  };

  const arrowLabel = t("fleetPage.next", { category: categoryName });
  const arrowIcon = (size) => (
    <span data-arrow-icon className="flex">
      <ArrowRight size={size} strokeWidth={1.75} className="rtl:rotate-180" />
    </span>
  );

  return (
    <div
      ref={sectionRef}
      className={`relative ${isLast ? "" : "pb-[76px] max-md:pb-14"}`}
    >
      {/* Trunk line continuing down to the next category */}
      {!isLast && (
        <span
          ref={trunkRef}
          aria-hidden="true"
          className="absolute start-0 top-0 bottom-0 w-[1.5px] bg-teal-accent"
        />
      )}

      <div className="flex items-center">
        {/* Category name, reached by a curved branch off the trunk */}
        <h2 className="relative flex items-center h-[30px] ps-[68px] text-[22px] font-medium leading-[30px] capitalize text-fg max-md:ps-12 max-md:text-lg">
          <span
            aria-hidden="true"
            ref={elbowRef}
            className="absolute start-0 top-0 w-[30px] h-[15px] border-s-[1.5px] border-b-[1.5px] border-teal-accent rounded-es-[14px] max-md:w-[20px]"
          />
          <span
            aria-hidden="true"
            className="absolute start-[27px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] max-md:start-[17px]"
          >
            <span
              ref={dotRef}
              className="w-full h-full rounded-full bg-[#24B9A5]/30 flex items-center justify-center"
            >
              <span className="w-[10px] h-[10px] rounded-full bg-teal-accent shadow-[0_0_8px_rgb(var(--accent))]" />
            </span>
          </span>
          <span ref={nameRef}>{categoryName}</span>
        </h2>

        {/* Phones: a smaller arrow at the end of the name's line */}
        <button
          type="button"
          onClick={showNext}
          disabled={!canScroll}
          aria-label={arrowLabel}
          className="md:hidden ms-auto shrink-0 w-11 h-11 rounded-full bg-[#072E2A] text-white flex items-center justify-center transition-transform active:scale-90 disabled:opacity-40"
        >
          {arrowIcon(20)}
        </button>
      </div>

      <div className="mt-[90px] ps-[68px] flex items-start gap-8 max-md:mt-6 max-md:ps-12">
        <div
          ref={rowRef}
          className="flex-1 min-w-0 max-w-[1114px] flex gap-[62px] overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-md:gap-5 max-md:-me-6 max-md:pe-6 max-md:scroll-pe-6"
        >
          {category.cars.map((car) => (
            <FleetCarCard key={car.id} car={car} />
          ))}
        </div>

        {/* Figma: 64px dark-teal circle, centered on the car photos */}
        <button
          type="button"
          onClick={showNext}
          disabled={!canScroll}
          aria-label={arrowLabel}
          className="ms-auto mt-[53px] shrink-0 w-16 h-16 rounded-full bg-[#072E2A] text-white flex items-center justify-center transition-transform enabled:hover:scale-105 disabled:cursor-default max-md:hidden"
        >
          {arrowIcon(26)}
        </button>
      </div>
    </div>
  );
}
