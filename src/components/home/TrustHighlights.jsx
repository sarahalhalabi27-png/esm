import { useTranslation } from "react-i18next";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import CheckListItem from "../common/CheckListItem.jsx";
import { trustHighlights } from "../../data/trustHighlightsData.js";
import parking from "../../assets/parking.png";
import parkingLight from "../../assets/parking_light.jpg";

export default function TrustHighlights() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden w-full max-w-[1340px] mx-auto md:h-[606px] font-display">
      {/* Background swaps with the theme; bg-fixed keeps the parallax effect */}
      <div
        className="dark-only absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: `url(${parking})` }}
      />
      <div
        className="light-only absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: `url(${parkingLight})` }}
      />

      {/* Theme-specific overlay */}
      <div className="dark-only absolute inset-0 bg-page/70 z-[1]" />
      <div className="light-only absolute inset-0 bg-page/30 z-[1]" />

      <div className="relative z-10 pt-10 md:pt-[60px] px-6 md:px-[60px] pb-12 md:pb-0 text-start">
        <SectionEyebrow className="w-full max-w-[1045px] text-2xl md:text-[30px] leading-[110%] md:leading-[100%] tracking-[0.2em]">
          {t("home.trust.eyebrow")}
        </SectionEyebrow>

        <p className="w-full text-base md:text-[25px] font-medium leading-relaxed md:leading-[30px] text-fg mt-[38px]">
          {t("home.trust.description")}
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 md:gap-y-[62px] mt-[45px]">
          {trustHighlights.map((item, index) => (
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
