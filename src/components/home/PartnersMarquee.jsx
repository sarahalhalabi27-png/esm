import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import uberLogo from "../../assets/uber.png";
import boltLogo from "../../assets/bolt.png";
import yangoLogo from "../../assets/yango.png";

const partners = [
  { src: uberLogo, alt: "Uber", className: "w-[127px] h-[51px]" },
  { src: boltLogo, alt: "Bolt" },
  { src: yangoLogo, alt: "Yango" },
];

export default function PartnersMarquee() {
  const { t } = useTranslation();
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Track holds the logo set twice back-to-back; looping it exactly
      // halfway (xPercent -50) and jumping back makes the loop seamless.
      gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 15,
        ease: "none",
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="font-display max-md:py-10">
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
