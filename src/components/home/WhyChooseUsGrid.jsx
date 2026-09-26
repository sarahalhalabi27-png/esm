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
  const { t } = useTranslation();
  const gridRef = useRef(null);

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
    <section className="relative overflow-hidden font-display md:min-h-[959px]">

      {/* Pattern Background */}
      <img
        src={pattern1}
        alt=""
        className="absolute left-0 top-[-90px] w-[1438px] h-[959px] object-fill pointer-events-none z-0"
      />

      {/* Why Choose Us Car — hidden on small screens (it sits far off-canvas) */}
      <img
        src={whyChooseUs}
        alt=""
        className="hidden xl:block absolute left-[993px] top-[140px] w-[447px] h-[703px] object-fill pointer-events-none z-10"
      />

      {/* Content */}
      <div className="relative z-20 max-w-content mx-auto px-6 py-20">

        <SectionEyebrow className="!text-[25px] !font-semibold !leading-[100%] !text-teal-accent">
          {t("home.whyChoose.eyebrow")}
        </SectionEyebrow>
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-[200px] gap-y-8 md:gap-y-[94px] mt-[70px] max-w-3xl"
        >
          {whyChooseUsItems.map((item, index) => (
  <div
    key={item.title}
    className={index === 2 || index === 3 ? "md:ms-[87px]" : ""}
  >
  <CheckListItem className="!gap-[18px] !font-medium">
  <span className="md:whitespace-nowrap">
    {item.title}
  </span>
</CheckListItem>

    <p className="ms-[44px] mt-[12px] md:whitespace-nowrap text-lg md:text-[22px] font-medium leading-snug md:leading-[100%] capitalize text-fg">
      {item.description}
    </p>
  </div>
))}
        </div>

      </div>
    </section>
  );
}