import { Trans, useTranslation } from "react-i18next";
import MaskIcon from "../common/MaskIcon.jsx";
import locationIcon from "../../assets/contact/location.svg";
import landlineIcon from "../../assets/contact/landline.svg";
import phoneIcon from "../../assets/contact/phone.svg";
import whatsappIcon from "../../assets/contact/whatsapp.svg";
import { companyInfo } from "../../data/companyInfo.js";

// Each icon is its exported SVG (own size) drawn as a mask, so it takes the
// theme accent: teal in dark mode, dark teal in light mode.
const icon = (src, width, height) => (
  <MaskIcon
    src={src}
    display="block"
    className="max-md:!w-7 max-md:!h-auto max-md:aspect-square"
    style={{ width, height }}
  />
);

const digits = (phone) => phone.replace(/[^\d+]/g, "");

// Left column of Contact Us (Figma, 1440 frame): the two-line heading
// (Semibold 22px on 138% lines, 448 wide, "ESM" and "Take Care" teal), the intro (Regular 22px on 138% lines, 629 wide, 18px under the heading) with a
// 298px teal rule under it, "Keep Close" (Medium 22px, 102px under the rule) after a 55px teal line
// (10px apart), 49px above the list, then the
// address and the three numbers, each with a teal icon (tap to call / chat).
export default function ContactInfoPanel() {
  const { t } = useTranslation();
  const accent = <span className="text-teal-accent" />;

  const rows = [
    {
      icon: icon(locationIcon, 31, 40),
      label: t("contactPage.addressLabel"),
      text: t("contactPage.address"),
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyInfo.address)}`,
      external: true,
    },
    {
      icon: icon(landlineIcon, 39, 47),
      label: t("contactPage.landlineLabel"),
      text: companyInfo.secondaryPhone,
      href: `tel:${digits(companyInfo.secondaryPhone)}`,
    },
    {
      icon: icon(phoneIcon, 35, 35),
      label: t("contactPage.phoneLabel"),
      text: companyInfo.phone,
      href: `tel:${digits(companyInfo.phone)}`,
    },
    {
      icon: icon(whatsappIcon, 37, 38),
      label: t("contactPage.whatsappLabel"),
      text: companyInfo.whatsapp,
      href: `https://wa.me/${digits(companyInfo.whatsapp).replace("+", "")}`,
      external: true,
    },
  ];

  return (
    <div className="font-display">
      <h2 className="w-[448px] max-w-full text-[22px] font-semibold leading-[138%] capitalize text-fg max-md:w-auto max-md:text-lg max-md:leading-snug">
        <Trans i18nKey="contactPage.headingLine1" components={{ accent }} />
        <br />
        <Trans i18nKey="contactPage.headingLine2" components={{ accent }} />
      </h2>
      <p className="mt-[18px] w-[629px] max-w-full text-[22px] font-normal leading-[138%] capitalize text-fg/85 max-md:mt-4 max-md:w-auto max-md:text-base max-md:leading-relaxed">
        {t("contactPage.intro")}
      </p>
      <span
        aria-hidden="true"
        className="block mt-[10px] w-[298px] max-w-full h-px bg-teal-accent"
      />

      <p className="mt-[102px] flex items-center gap-[6px] text-[22px] font-medium leading-[27px] text-fg light:text-[#072E2A] max-md:mt-12 max-md:gap-4 max-md:text-[17px] max-md:leading-normal">
        <span
          aria-hidden="true"
          className="relative top-[8px] ms-[23px] w-[55px] h-px bg-teal-accent max-md:top-0 max-md:ms-0"
        />
        {t("contactPage.keepClose")}
      </p>

      {/* Figma: every row is Medium 25px in a 540-wide box starting 115px in (the
          icons 73px in, 30px before the text, centred on the text line), 52px apart. */}
      <ul className="mt-[49px] flex flex-col gap-[52px] max-md:mt-8 max-md:gap-7">
        {rows.map((row) => (
          <li key={row.label}>
            <a
              href={row.href}
              aria-label={`${row.label}: ${row.text}`}
              {...(row.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group flex items-center max-w-[660px] gap-[30px] text-[25px] font-medium leading-[30px] text-fg transition-colors hover:text-teal-accent max-md:gap-4 max-md:text-base max-md:leading-snug"
            >
              <span className="ms-[23px] flex h-[30px] shrink-0 items-center transition-transform group-hover:-translate-y-0.5 max-md:ms-0 max-md:h-auto">
                {row.icon}
              </span>
              <span
                className="w-[540px] max-w-full"
                dir={
                  row.href.startsWith("tel:") || row.href.includes("wa.me")
                    ? "ltr"
                    : undefined
                }
              >
                {row.text}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
