import { useTranslation } from "react-i18next";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import CheckListItem from "../common/CheckListItem.jsx";
import parking from "../../assets/trust/parking.webp";
import parkingLight from "../../assets/trust/parking_light.webp";
import parkingMobile from "../../assets/trust/parking-mobile.webp";
import parkingLightMobile from "../../assets/trust/parking-light-mobile.webp";

export default function TrustHighlights() {
  const { t } = useTranslation();

  return (
    <section
      className="relative overflow-hidden max-md:[clip-path:inset(0)] w-full max-w-[1340px] mx-auto xl:h-[606px] font-display"
    >
      {/* Background swaps with the theme. Desktop: bg-fixed gives the
          "photo stays put" parallax. Phones: the wrapper becomes a
          viewport-tall position:fixed layer, clipped to the section by its
          clip-path (pure CSS, so it tracks the scroll with no JS lag on
          iOS/Android) — with portrait versions of the photo on phones, so
          the whole scene fills the screen. The images are CSS variables
          picked per breakpoint, so each device downloads only the one it
          shows. */}
      <div
        className="absolute inset-0 z-0 max-md:fixed max-md:bottom-auto max-md:h-[100lvh]"
      >
        <div
          className="dark-only absolute inset-0 bg-cover bg-center bg-fixed bg-[image:var(--bg-wide)] max-md:bg-scroll max-md:bg-[image:var(--bg-tall)]"
          style={{
            "--bg-wide": `url(${parking})`,
            "--bg-tall": `url(${parkingMobile})`,
          }}
        />
        <div
          className="light-only absolute inset-0 bg-cover bg-center bg-fixed bg-[image:var(--bg-wide)] max-md:bg-scroll max-md:bg-[image:var(--bg-tall)]"
          style={{
            "--bg-wide": `url(${parkingLight})`,
            "--bg-tall": `url(${parkingLightMobile})`,
          }}
        />
      </div>

      {/* Theme-specific overlay */}
      <div className="dark-only absolute inset-0 bg-page/70 max-md:bg-page/75 z-[1]" />
      <div className="light-only absolute inset-0 bg-page/30 z-[1]" />

      <div className="relative z-10 pt-10 md:pt-[44px] px-6 md:px-[60px] pb-12 xl:pb-0 text-start max-md:py-12">
        {/* Figma: a single line, ~974px wide at 30px → 0.15em tracking. */}
        <SectionEyebrow className="w-full max-w-[1045px] xl:max-w-none xl:whitespace-nowrap text-2xl md:text-[30px] leading-[110%] xl:leading-[100%] tracking-[0.15em] max-md:text-[clamp(19px,5.6vw,24px)] max-md:leading-[1.35] max-md:tracking-[0.08em]">
          {t("home.trust.eyebrow")}
        </SectionEyebrow>

        <p className="w-full text-base md:text-[20px] font-medium leading-relaxed md:leading-[1.5] text-fg mt-[38px] max-md:text-[15px] max-md:leading-[1.7] max-md:mt-5">
          {t("home.trust.description")}
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 md:gap-y-[62px] mt-[45px] max-md:mt-7 max-sm:gap-y-3">
          {t("home.trust.items", { returnObjects: true }).map((item, index) => (
            <CheckListItem
              key={item}
              // xl: the second column sits 200px further toward the end side
              // (right in English, left in Arabic). Tablets and small
              // laptops have no room for that, so the items stay in their
              // columns and may wrap.
              className={`md:max-xl:whitespace-normal ${
                index % 2 !== 0
                  ? "xl:ltr:translate-x-[200px] xl:rtl:-translate-x-[200px]"
                  : ""
              }`}
            >
              {item}
            </CheckListItem>
          ))}
        </div>
      </div>
    </section>
  );
}
