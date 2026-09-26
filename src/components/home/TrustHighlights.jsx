import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import CheckListItem from "../common/CheckListItem.jsx";
import parking from "../../assets/parking.png";
import parkingLight from "../../assets/parking_light.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function TrustHighlights() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
    // Phones: background-attachment:fixed is ignored on iOS and janky on
    // Android, so recreate the desktop effect — the photo holds still while
    // the section scrolls over it. The layer is one viewport tall and is
    // moved by exactly the scroll distance (scrub: true, no easing), from
    // "section top at viewport bottom" to "section bottom at viewport top".
    const mm = gsap.matchMedia(sectionRef);
    mm.add("(max-width: 767.98px)", () => {
      gsap.fromTo(
        backgroundRef.current,
        { y: () => -window.innerHeight },
        {
          y: () => sectionRef.current.offsetHeight,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden w-full max-w-[1340px] mx-auto md:h-[606px] font-display"
    >
      {/* Background swaps with the theme. Desktop: bg-fixed gives the
          "photo stays put" parallax. Phones: the wrapper becomes a
          viewport-tall layer that GSAP keeps pinned to the viewport (above),
          so the effect is the same everywhere. */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 z-0 max-md:bottom-auto max-md:h-[100lvh] max-md:will-change-transform"
      >
        <div
          className="dark-only absolute inset-0 bg-cover bg-center bg-fixed max-md:bg-scroll max-md:bg-[position:58%_center]"
          style={{ backgroundImage: `url(${parking})` }}
        />
        <div
          className="light-only absolute inset-0 bg-cover bg-center bg-fixed max-md:bg-scroll max-md:bg-[position:58%_center]"
          style={{ backgroundImage: `url(${parkingLight})` }}
        />
      </div>

      {/* Theme-specific overlay */}
      <div className="dark-only absolute inset-0 bg-page/70 max-md:bg-page/75 z-[1]" />
      <div className="light-only absolute inset-0 bg-page/30 z-[1]" />

      <div className="relative z-10 pt-10 md:pt-[44px] px-6 md:px-[60px] pb-12 md:pb-0 text-start max-md:py-12">
        {/* Figma: a single line, ~974px wide at 30px → 0.15em tracking. */}
        <SectionEyebrow className="w-full max-w-[1045px] md:max-w-none md:whitespace-nowrap text-2xl md:text-[30px] leading-[110%] md:leading-[100%] tracking-[0.15em] max-md:text-[clamp(19px,5.6vw,24px)] max-md:leading-[1.35] max-md:tracking-[0.08em]">
          {t("home.trust.eyebrow")}
        </SectionEyebrow>

        <p className="w-full text-base md:text-[25px] font-medium leading-relaxed md:leading-[30px] text-fg mt-[38px] max-md:text-[15px] max-md:leading-[1.7] max-md:mt-5">
          {t("home.trust.description")}
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 md:gap-y-[62px] mt-[45px] max-md:mt-7 max-sm:gap-y-3">
          {t("home.trust.items", { returnObjects: true }).map((item, index) => (
            <CheckListItem
              key={item}
              className={index % 2 !== 0 ? "md:translate-x-[200px]" : ""}
            >
              {item}
            </CheckListItem>
          ))}
        </div>
      </div>
    </section>
  );
}
