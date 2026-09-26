import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import { whyChooseUsItems } from "../../data/whyChooseUsData.js";
import pattern1 from "../../assets/pattern1.png";
import whyChooseUs from "../../assets/why_choose_us.png";
import CheckListItem from "../common/CheckListItem.jsx";

gsap.registerPlugin(ScrollTrigger);

export default function WhyChooseUsGrid() {
  const { t, i18n } = useTranslation();
  const gridRef = useRef(null);

  const isRTL = i18n.dir() === "rtl";

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative overflow-hidden font-display md:min-h-[959px]"
    >
      {/* Pattern Background. Phones: same composition as desktop — it fills
          the section behind the list. It is sized 120% of the section height
          (shifted up 9%) so the image's transparent top/bottom edges fall
          outside and the leather spans every item, including the last one;
          scaled by height so the hexagons keep their proportions, anchored
          to the solid leather side. */}
      <img
        src={pattern1}
        alt=""
        className="absolute left-0 top-[-90px] w-[1438px] h-[959px] object-fill pointer-events-none z-0 max-md:top-[-9%] max-md:w-full max-md:h-[120%] max-md:max-w-none max-md:object-cover max-md:object-left"
      />

      {/* Why Choose Us Car */}
      <img
  src={whyChooseUs}
  alt=""
  className="hidden xl:block absolute start-[993px] top-[140px] w-[447px] h-[703px] object-fill pointer-events-none z-10 max-md:block max-md:start-auto max-md:-end-[6vw] max-md:inset-y-0 max-md:my-auto max-md:w-[44vw] max-md:h-auto"
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