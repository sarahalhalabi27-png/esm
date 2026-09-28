import { useTranslation } from "react-i18next";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import offerCar from "../../assets/promo/offer_car.webp";
import smoke1 from "../../assets/promo/smoke1.webp";

export default function PromotionalOfferBanner() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <section className="font-display max-md:overflow-x-clip">
      {/* Phones: the copy column dissolves (max-md:contents) into a named
          grid so the car sits beside the heading + description — like the
          desktop composition — with the eyebrow above and the CTA below. */}
      <div className="max-w-content mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center max-md:py-12 max-md:gap-x-3 max-md:gap-y-0 max-md:grid-cols-[minmax(0,1fr)_44%] max-md:[grid-template-areas:'eyebrow_eyebrow'_'heading_car'_'desc_car'_'cta_cta']">
        <div className="max-md:contents">
          <SectionEyebrow className="max-md:[grid-area:eyebrow] max-md:text-[22px]">
            {t("home.promo.eyebrow")}
          </SectionEyebrow>

          <h2 className="text-2xl font-semibold mt-[40px] mb-[11px] max-md:[grid-area:heading] max-md:self-end max-md:mt-6 max-md:mb-2 max-md:text-lg max-md:leading-snug">
            {t("home.promo.heading")}
          </h2>

      <p className="text-fg font-normal text-[20px] leading-[130%] tracking-[0%] capitalize w-full max-w-[703px] min-h-[48px] mb-6 max-md:[grid-area:desc] max-md:self-start max-md:min-h-0 max-md:mb-0 max-md:text-sm max-md:leading-relaxed">
  {t("home.promo.description")}
</p>

          <button
            type="button"
            className="relative w-[300px] max-w-full h-[50px] rounded-[10px] font-display text-white transition-transform hover:scale-[1.02] max-md:[grid-area:cta] max-md:mt-7"
            style={{ background: "#072E2A" }}
          >
            <span
  className="absolute top-[13px] h-[24px] flex items-center justify-center font-normal text-[20px] leading-[100%] tracking-[0%] capitalize"
  style={{
    right: "23px",
    left: "0",
    width: "232px",
    direction: isRTL ? "rtl" : "ltr",
    textAlign: isRTL ? "right" : "center",
  }}
>
  {t("home.promo.cta")}
</span>
            <svg
              className="absolute top-[20px]"
              style={{
                left: isRTL ? "32px" : "243px",
                transform: isRTL ? "scaleX(-1)" : "none",
              }}
              width="25"
              height="14"
              viewBox="0 0 25 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 7L24 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 1L24 7L17 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Offer car + smoke */}
      {/* Offer car + smoke */}
<div
  className={`relative flex justify-center md:justify-end max-md:[grid-area:car] max-md:self-center ${
    // English: pulled left so the smoke trailing behind the car (to its
    // right) stays inside the section instead of being cut at the edge.
    isRTL ? "md:ms-[120px]" : "md:-ms-[160px] xl:-translate-x-[190px]"
  }`}
>
  {/* Smoke: desktop keeps its original sideways offset; phones center it
      behind the smaller car. The image is a very faint teal (alpha ≤ 33%), so
      light mode runs it through #promo-smoke-light: recolored dark teal with
      its density tripled, so it reads on the white page. */}
  <svg width="0" height="0" className="absolute" aria-hidden="true">
    <filter id="promo-smoke-light" colorInterpolationFilters="sRGB">
      <feColorMatrix
        type="matrix"
        values="0 0 0 0 0.18  0 0 0 0 0.43  0 0 0 0 0.40  0 0 0 3 0"
      />
    </filter>
  </svg>
  <img
  src={smoke1}
  alt=""
  className={`absolute w-[587px] h-[392px] object-contain opacity-[0.66] z-0 [[data-theme=light]_&]:opacity-100 [[data-theme=light]_&]:[filter:url(#promo-smoke-light)] max-md:max-w-none max-md:w-[190%] max-md:h-auto max-md:left-1/2 max-md:top-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 ${
    isRTL ? "md:translate-x-[100px]" : "md:translate-x-[200px]"
  }`}
/>

  <img
    src={offerCar}
    alt="Luxury limousine"
    className="relative z-10 w-full max-w-[450px] h-auto object-contain"
  />
</div>
      </div>
    </section>
  );
}