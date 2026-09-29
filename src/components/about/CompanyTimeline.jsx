import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CompanyTimelineItem from "./CompanyTimelineItem.jsx";
import { companyTimeline } from "../../data/aboutTimelineData.js";
import { MOTION_OK } from "../../utils/motion.js";

gsap.registerPlugin(ScrollTrigger);

// Figma: a vertical line down the middle of the page with the pillars
// alternating on either side of it (first on the end side), each marked by a
// ringed dot on the line. Phones: the line moves to the start edge and every
// item sits after it.
export default function CompanyTimeline() {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const sectionRef = useRef(null);

  // The line draws itself down the page as you scroll (scrubbed). Each pillar
  // reveals as it scrolls into view — so they come in one after another: its
  // dot pops in on the line, then its text fades and slides in toward the
  // line from its own side. The reveal replays every time a row re-enters the
  // viewport, from either direction (it never hides on leaving). Skipped for
  // reduced motion.
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      // Physical x for a text sliding in from the logical start/end side.
      const fromX = (from) => (from === "end" ? 40 : -40) * (isRTL ? -1 : 1);

      gsap.fromTo(
        sectionRef.current.querySelector("[data-timeline-line]"),
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        }
      );

      sectionRef.current
        .querySelectorAll("[data-timeline-row]")
        .forEach((row) => {
          const texts = row.querySelectorAll("[data-timeline-text]");
          gsap
            .timeline({
              scrollTrigger: {
                trigger: row,
                start: "top 80%",
                end: "bottom 15%",
                toggleActions: "restart none restart none",
              },
            })
            .from(row.querySelector("[data-timeline-dot]"), {
              scale: 0,
              opacity: 0,
              duration: 0.5,
              ease: "back.out(2)",
            })
            .from(
              texts,
              {
                opacity: 0,
                x: (i, el) => fromX(el.dataset.from),
                duration: 0.7,
                ease: "power2.out",
              },
              "-=0.2"
            );
        });
    });
    return () => mm.revert();
  }, [isRTL]);

  return (
    <section
      ref={sectionRef}
      className="relative font-display mt-[57px] max-md:mt-10"
    >
      {/* Soft teal glow behind the timeline */}
      <div
        aria-hidden="true"
        className="dark-only absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 45% 55% at 20% 35%, rgba(36,185,165,0.07), transparent 70%)",
        }}
      />

      <div className="relative max-w-[1340px] mx-auto px-6 md:px-[50px]">
        {/* Figma (1440): the 1px white line starts 57px under the intro, runs
            843px, and the first dot is centred ~67px below its top (pt 35 +
            ring 33); the line ends ~80px past the last dot's centre. */}
        <div className="relative pt-[35px] max-md:pt-6">
          {/* The line: centered on md+, at the start edge (through the dots) on phones */}
          <span
            data-timeline-line
            aria-hidden="true"
            className="absolute top-0 bottom-[20px] w-px bg-fg left-1/2 -translate-x-1/2 max-md:start-[23px] max-md:left-auto max-md:translate-x-0"
          />

          {companyTimeline.map((item, index) => (
            <CompanyTimelineItem
              key={item.id}
              item={item}
              side={index % 2 === 0 ? "end" : "start"}
              isLast={index === companyTimeline.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
