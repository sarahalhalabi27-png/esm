import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import { whyChooseUsItems } from "../../data/whyChooseUsData.js";
import pattern1 from "../../assets/why-choose-us/pattern1.webp";
import whyChooseUs from "../../assets/why-choose-us/why_choose_us.webp";
import CheckListItem from "../common/CheckListItem.jsx";
import lightBackground from "../../assets/why-choose-us/background.svg";
import lightLines from "../../assets/why-choose-us/lines.svg";
import whyChooseUsLight from "../../assets/why-choose-us/why_choose_us_light.webp";
import { MOTION_OK } from "../../utils/motion.js";

gsap.registerPlugin(ScrollTrigger);

// Dark-mode pattern fades out on all four edges so the section blends into
// the page instead of ending on hard lines (like the booking video). The two
// gradients are intersected; --bg-fade / --bg-fade-x are set per breakpoint
// on the masked element.
const edgeFadeY =
  "linear-gradient(to bottom, transparent 0, #000 var(--bg-fade), #000 calc(100% - var(--bg-fade)), transparent 100%)";
const edgeFadeX =
  "linear-gradient(to right, transparent 0, #000 var(--bg-fade-x), #000 calc(100% - var(--bg-fade-x)), transparent 100%)";
const edgeFadeStyle = {
  WebkitMaskImage: `${edgeFadeY}, ${edgeFadeX}`,
  maskImage: `${edgeFadeY}, ${edgeFadeX}`,
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

export default function WhyChooseUsGrid() {
  const { t, i18n } = useTranslation();
  const gridRef = useRef(null);

  const isRTL = i18n.dir() === "rtl";

  // The items slide in from alternating sides (skipped for reduced motion).
  useEffect(() => {
    const mm = gsap.matchMedia(gridRef);
    mm.add(MOTION_OK, () => {
      gsap.from(gridRef.current.children, {
        opacity: 0,
        x: (i) => (i % 2 === 0 ? 80 : -80),
        duration: 1.3,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "restart none restart none",
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative overflow-hidden font-display md:min-h-[959px]"
    >
      {/* Dark Mode Pattern — in a section-sized box that fades at its edges */}
      <div
        className="dark-only absolute inset-0 overflow-hidden pointer-events-none z-0 [--bg-fade:160px] [--bg-fade-x:200px] max-md:[--bg-fade:60px] max-md:[--bg-fade-x:40px]"
        style={edgeFadeStyle}
      >
        <img
          src={pattern1}
          alt=""
          className="absolute left-0 top-[-90px] w-[1438px] h-[959px] object-fill pointer-events-none z-0 max-md:top-[-9%] max-md:w-full max-md:h-[120%] max-md:max-w-none max-md:object-cover max-md:object-left"
        />
      </div>

      {/* Light Mode Artwork — phones (max-md:*): background.svg's gradient is
          redrawn in CSS so it stretches over the whole section (the SVG keeps
          its aspect), the lines keep their shape (cropped), and the car sits on
          the end edge like the dark-mode car. In Arabic (rtl:*) the whole scene
          is mirrored: car + shadow on the left, gradient and lines flipped. */}
      <div className="light-only absolute left-0 top-0 w-[1440px] h-[706px] overflow-hidden pointer-events-none z-0 max-md:w-full max-md:h-full">
        {/* Gradient + lines (phones: the gradient is this layer's background) */}
        <div className="absolute inset-0 max-md:bg-[linear-gradient(to_left,rgba(195,195,195,0)_19.5%,#5D5D5D_110.5%)] max-md:rtl:bg-[linear-gradient(to_right,rgba(195,195,195,0)_19.5%,#5D5D5D_110.5%)]">
          {/* Light Background */}
          <img
            src={lightBackground}
            alt=""
            className="absolute left-0 top-0 w-[1440px] h-[706px] rtl:-scale-x-100 max-md:hidden"
          />

          {/* Light Lines */}
          <img
            src={lightLines}
            alt=""
            className="absolute left-0 top-0 w-[1440px] h-[706.47px] rtl:-scale-x-100 max-md:w-auto max-md:h-full max-md:max-w-none"
          />
        </div>

        {/* Car Glow */}
        <div
          className="absolute left-[963px] top-[585px] w-[560px] h-[129px] rounded-full md:rtl:left-[-83px] max-md:hidden"
          style={{
            background: "rgba(0, 0, 0, 0.88)",
            filter: "blur(50.2px)",
          }}
        />

        {/* Light Mode Car */}
        <img
          src={whyChooseUsLight}
          alt=""
          className="absolute left-[1018px] top-[184px] w-[422px] h-[493px] object-fill z-10 md:rtl:left-0 max-md:ltr:left-auto max-md:ltr:-right-[6vw] max-md:rtl:-left-[6vw] max-md:inset-y-0 max-md:my-auto max-md:w-[44vw] max-md:h-auto"
          style={{
            transform: isRTL ? "scaleX(-1)" : "none",
          }}
        />
      </div>

      {/* Dark Mode Car */}
      <img
        src={whyChooseUs}
        alt=""
        className="dark-only absolute start-[993px] top-[140px] w-[447px] h-[703px] object-fill pointer-events-none z-10 max-md:block max-md:start-auto max-md:-end-[6vw] max-md:inset-y-0 max-md:my-auto max-md:w-[44vw] max-md:h-auto"
        style={{
          transform: isRTL ? "scaleX(-1)" : "none",
        }}
      />

      {/* Content */}
      <div className="relative z-20 max-w-content mx-auto px-6 py-20 max-md:pt-12 max-md:pb-12">
        <SectionEyebrow className="!text-[25px] max-md:!text-[22px] !font-semibold !leading-[100%] !text-teal-accent">
          {t("home.whyChoose.eyebrow")}
        </SectionEyebrow>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-[200px] gap-y-8 md:gap-y-[94px] mt-[70px] max-w-3xl max-md:mt-7 max-md:gap-y-5 max-md:w-[64%]"
        >
          {whyChooseUsItems.map((item, index) => (
            <div
              key={item.id}
              className={index === 2 || index === 3 ? "md:ms-[87px]" : ""}
            >
              <CheckListItem className="!gap-[18px] max-md:!gap-2.5 !font-medium max-md:!text-[clamp(14px,4.1vw,17px)]">
                <span className="md:whitespace-nowrap">
                  {t(`home.whyChoose.items.${item.id}.title`)}
                </span>
              </CheckListItem>

              <p
                className={`
                  ms-[44px]
                  mt-[12px]
                  max-md:ms-[34px]
                  max-md:mt-1
                  max-md:text-[clamp(12px,3.4vw,14px)]
                  max-md:text-fg/85
                  md:whitespace-nowrap
                  text-lg
                  md:text-[22px]
                  font-medium
                  leading-snug
                  md:leading-[100%]
                  capitalize
                  text-fg
                  ${isRTL ? "text-right" : "text-left"}
                `}
              >
                {t(`home.whyChoose.items.${item.id}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
