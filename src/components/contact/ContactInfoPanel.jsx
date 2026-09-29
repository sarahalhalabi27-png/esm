import { Trans, useTranslation } from "react-i18next";
import { Headset, MapPin, Phone } from "lucide-react";
import { companyInfo } from "../../data/companyInfo.js";

// WhatsApp mark in the same outline style as the lucide icons (lucide has no
// brand icons): a speech bubble with a handset inside.
function WhatsAppIcon({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" />
      <path d="M9.2 8.3c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .5-.1.6l-.5.6c.6 1.2 1.5 2.1 2.7 2.7l.6-.5c.2-.2.4-.2.6-.1l1.4.6c.3.1.4.3.4.5v.5c0 .3-.2.6-.5.8-.6.4-1.4.5-2.1.2-2.1-.8-3.8-2.5-4.6-4.6-.3-.7-.2-1.5.1-2.1z" />
    </svg>
  );
}

const digits = (phone) => phone.replace(/[^\d+]/g, "");

// Left column of Contact Us (Figma, 1440 frame): the two-line heading
// (Semibold 20px, "ESM" and "Take Care" teal), the intro (18px) with a
// 300px teal rule under it, "Keep Close" after a 55px teal line, then the
// address and the three numbers, each with a teal icon (tap to call / chat).
export default function ContactInfoPanel() {
  const { t } = useTranslation();
  const accent = <span className="text-teal-accent" />;

  const rows = [
    {
      icon: <MapPin size={28} strokeWidth={1.5} aria-hidden="true" />,
      label: t("contactPage.addressLabel"),
      text: t("contactPage.address"),
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyInfo.address)}`,
      external: true,
    },
    {
      icon: <Headset size={28} strokeWidth={1.5} aria-hidden="true" />,
      label: t("contactPage.landlineLabel"),
      text: companyInfo.secondaryPhone,
      href: `tel:${digits(companyInfo.secondaryPhone)}`,
    },
    {
      icon: <Phone size={28} strokeWidth={1.5} aria-hidden="true" />,
      label: t("contactPage.phoneLabel"),
      text: companyInfo.phone,
      href: `tel:${digits(companyInfo.phone)}`,
    },
    {
      icon: <WhatsAppIcon />,
      label: t("contactPage.whatsappLabel"),
      text: companyInfo.whatsapp,
      href: `https://wa.me/${digits(companyInfo.whatsapp).replace("+", "")}`,
      external: true,
    },
  ];

  return (
    <div className="font-display">
      <h2 className="text-[20px] font-semibold leading-[30px] capitalize text-fg max-md:text-lg max-md:leading-snug">
        <Trans i18nKey="contactPage.headingLine1" components={{ accent }} />
        <br />
        <Trans i18nKey="contactPage.headingLine2" components={{ accent }} />
      </h2>
      <p className="mt-4 max-w-[620px] text-[18px] font-medium leading-[30px] capitalize text-fg/85 max-md:text-base max-md:leading-relaxed">
        {t("contactPage.intro")}
      </p>
      <span
        aria-hidden="true"
        className="block mt-1 w-[300px] max-w-full h-[1.5px] bg-teal-accent"
      />

      <p className="mt-[100px] flex items-center gap-4 text-[17px] font-medium text-fg max-md:mt-12">
        <span aria-hidden="true" className="w-[55px] h-px bg-teal-accent" />
        {t("contactPage.keepClose")}
      </p>

      <ul className="mt-[50px] flex flex-col gap-[42px] max-md:mt-8 max-md:gap-7">
        {rows.map((row) => (
          <li key={row.label}>
            <a
              href={row.href}
              aria-label={`${row.label}: ${row.text}`}
              {...(row.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group flex items-center gap-4 max-w-[560px] text-[20px] font-medium leading-[28px] text-fg transition-colors hover:text-teal-accent max-md:text-base max-md:leading-snug"
            >
              <span className="shrink-0 text-teal-accent transition-transform group-hover:-translate-y-0.5">
                {row.icon}
              </span>
              <span
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
