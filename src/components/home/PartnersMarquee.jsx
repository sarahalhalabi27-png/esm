import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import uberLogo from "../../assets/partners/uber.png";
import boltLogo from "../../assets/partners/bolt.png";
import yangoLogo from "../../assets/partners/yango.png";

const partners = [
  { src: uberLogo, alt: "Uber", className: "w-[127px] h-[51px]" },
  { src: boltLogo, alt: "Bolt" },
  { src: yangoLogo, alt: "Yango" },
];

export default function PartnersMarquee() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Track holds the logo set twice back-to-back; looping it exactly
      // halfway and jumping back makes the loop seamless. In RTL the track is
      // anchored to the right edge, so it must travel right (+50): moving left
      // slid the logos out of view, leaving an empty strip before the jump.
      gsap.to(trackRef.current, {
        xPercent: isRTL ? 50 : -50,
        duration: 15,
        ease: "none",
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, [isRTL]);

  return (
    <section className="font-display -mt-[90px] md:[[data-theme=light]_&]:-mt-[130px] max-md:mt-0 max-md:py-10">
      {/* Phones: heading centered above a full-width marquee (instead of a
          squeezed side-by-side row); the GSAP loop itself is unchanged. */}
      <div className="w-full max-w-[1341px] h-[75px] px-6 md:px-0 md:ms-[50px] md:-mt-[30px] flex items-center max-md:h-auto max-md:flex-col max-md:gap-7">
        {/* Section Title */}
        <SectionEyebrow
          className="
            w-auto
            md:w-[232px]
            h-[30px]
            shrink-0
            text-xl
            md:text-[25px]
            font-semibold
            leading-[100%]
            tracking-[0%]
            capitalize
            mb-0
            max-md:h-auto
            max-md:text-center
            max-md:text-[22px]
          "
        >
          {t("home.partners.eyebrow")}
        </SectionEyebrow>

        {/* Partners — looping marquee */}
        <div className="relative overflow-hidden ms-6 md:ms-[154px] flex-1 max-md:ms-0 max-md:w-full max-md:[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div
            ref={trackRef}
            className="flex items-center gap-[152px] max-md:gap-16 opacity-80 w-max"
          >
            {[...partners, ...partners].map((partner, index) => (
              <img
                key={`${partner.alt}-${index}`}
                src={partner.src}
                alt={partner.alt}
                // The logo files are white; in light mode render them black
                // (brightness 0 keeps their transparent cut-outs, e.g. Yango).
                className={`object-contain shrink-0 max-md:h-[40px] max-md:w-auto [[data-theme=light]_&]:brightness-0 ${partner.className ?? ""}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
