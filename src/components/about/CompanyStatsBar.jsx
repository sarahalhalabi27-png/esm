import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { companyStats } from "../../data/aboutTimelineData.js";
import { MOTION_OK } from "../../utils/motion.js";
import { useTranslation } from "react-i18next";

gsap.registerPlugin(ScrollTrigger);

// Odometer counter: every digit is a vertical strip of numbers inside a
// one-digit window. On first view each strip rolls through SPINS full 0–9
// turns and lands on its digit, columns settling one after another; other
// characters (+, K, /) stay put. The strips are rendered at their final
// position, so the real values show without JS / with reduced motion.
const SPINS = 1;

function DigitColumn({ digit }) {
  const strip = [
    ...Array.from({ length: SPINS * 10 }, (_, i) => i % 10),
    ...Array.from({ length: digit + 1 }, (_, i) => i),
  ];
  const finalShift = (-(strip.length - 1) / strip.length) * 100;

  return (
    <span className="relative inline-block h-[1lh] overflow-hidden align-top">
      <span
        data-odometer-strip
        data-final={finalShift}
        className="flex flex-col"
        style={{ transform: `translateY(${finalShift}%)` }}
      >
        {strip.map((n, i) => (
          <span key={i} className="block h-[1lh]">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

// Figma: four columns under the timeline — teal 25px semibold value, 14px
// above a 25px regular label; the row sits 192px below the line's end.
export default function CompanyStatsBar() {
  const { t } = useTranslation();
  const rowRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      rowRef.current
        .querySelectorAll("[data-odometer-value]")
        .forEach((value) => {
          const strips = value.querySelectorAll("[data-odometer-strip]");
          // GSAP parses the inline final translateY into `y`; zero it so only
          // yPercent drives the roll (otherwise the shift is applied twice).
          gsap.fromTo(
            strips,
            { y: 0, yPercent: 0 },
            {
              y: 0,
              yPercent: (i, el) => Number(el.dataset.final),
              duration: (i) => 2.4 + i * 0.35,
              ease: "power3.out",
              scrollTrigger: { trigger: value, start: "top 90%", once: true },
            }
          );
        });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="font-display mt-[172px] mb-[143px] max-md:mt-16 max-md:mb-16">
      {/* Figma: row 1223 wide (left 109), four columns spread edge to edge */}
      <div
        ref={rowRef}
        className="max-w-[1223px] mx-auto px-6 md:px-0 flex justify-between max-md:grid max-md:grid-cols-2 gap-y-10 text-center"
      >
        {companyStats.map((stat) => (
          <div key={stat.id}>
            <p
              data-odometer-value
              aria-label={stat.value}
              className="text-[25px] font-semibold leading-[30px] text-teal-accent tabular-nums max-md:text-xl"
            >
              <span aria-hidden="true" className="inline-flex">
                {[...stat.value].map((ch, i) =>
                  /\d/.test(ch) ? (
                    <DigitColumn key={i} digit={Number(ch)} />
                  ) : (
                    <span key={i}>{ch}</span>
                  )
                )}
              </span>
            </p>
            <p className="mt-[14px] text-[25px] font-normal leading-[30px] capitalize text-fg max-md:mt-2 max-md:text-base">
              {t(`aboutPage.stats.${stat.id}`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
