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

const isNumber = (row) =>
  row.href.startsWith("tel:") || row.href.includes("wa.me");

const digits = (phone) => phone.replace(/[^\d+]/g, "");

// Top of the Contact Us section, across the page width: the two-line heading
// ("ESM" and "Take Care" teal) at the start and the intro at the end side of
// the same row (xl+), bottom-aligned, the intro balanced over two even lines;
// under both a teal line running the full width and fading out toward the
// end. Stacked on smaller screens.
export function ContactIntro() {
  const { t } = useTranslation();
  const accent = <span className="text-teal-accent" />;

  return (
    <div className="font-display">
      <div className="grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)] xl:items-end xl:gap-16">
        <h2 className="text-[22px] font-semibold leading-[138%] capitalize text-fg max-md:text-lg max-md:leading-snug">
          <Trans i18nKey="contactPage.headingLine1" components={{ accent }} />
          <br />
          <Trans i18nKey="contactPage.headingLine2" components={{ accent }} />
        </h2>
        <p className="text-[20px] font-normal leading-[1.5] capitalize text-fg/85 [text-wrap:balance] xl:max-w-[720px] xl:justify-self-end max-md:text-base max-md:leading-relaxed">
          {t("contactPage.intro")}
        </p>
      </div>
      <span
        aria-hidden="true"
        className="block mt-6 h-px w-full bg-gradient-to-r from-teal-accent via-teal-accent/50 to-transparent rtl:bg-gradient-to-l max-md:mt-5"
      />
    </div>
  );
}

// The column beside the form: "Keep Close" after a 55px teal line, then the
// address and the three numbers, each with a teal icon (tap to call / chat).
export default function ContactInfoPanel() {
  const { t } = useTranslation();

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
    // min-w-0 lets the column narrow beside the form (its fixed-width lines
    // are max-w-full); xl: 40px down, so "Keep Close" lines up with the
    // form's first field.
    <div className="font-display min-w-0 xl:pt-10">
      <p className="flex items-center gap-[6px] text-[18px] font-medium leading-[27px] text-fg light:text-[#072E2A] max-md:gap-4 max-md:text-[17px] max-md:leading-normal">
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
              className="group flex items-center max-w-[660px] gap-[30px] text-[20px] font-medium leading-[30px] text-fg transition-colors hover:text-teal-accent max-md:gap-4 max-md:text-base max-md:leading-snug"
            >
              <span className="ms-[23px] flex h-[30px] shrink-0 items-center transition-transform group-hover:-translate-y-0.5 max-md:ms-0 max-md:h-auto">
                {row.icon}
              </span>
              {/* The address keeps Figma's 540px box; a number (always written
                  left to right) takes just its own width, so in Arabic it sits
                  next to its icon instead of at the far end of the box. */}
              <span
                className={isNumber(row) ? undefined : "w-[540px] max-w-full"}
                dir={isNumber(row) ? "ltr" : undefined}
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
