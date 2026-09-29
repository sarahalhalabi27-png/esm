import { useTranslation } from "react-i18next";
import { companyInfo } from "../../data/companyInfo.js";

// The office on a map (Figma: 1390 x 423, radius 10): Google Maps' keyless
// embed of the company address. Dark mode inverts and re-hues the map so it
// sits dark like the rest of the page; light mode shows it as is.
export default function LocationMapPanel() {
  const { t } = useTranslation();
  const src = `https://www.google.com/maps?q=${encodeURIComponent(
    companyInfo.address
  )}&z=15&output=embed`;

  return (
    <div className="w-full max-w-[1390px] mx-auto h-[423px] rounded-[10px] overflow-hidden border-[0.5px] border-white/20 [[data-theme=light]_&]:border-[#072E2A]/25 max-md:h-[300px]">
      <iframe
        title={t("contactPage.mapTitle")}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full border-0 [filter:invert(0.9)_hue-rotate(180deg)_saturate(0.85)_brightness(0.95)] [[data-theme=light]_&]:[filter:none]"
      />
    </div>
  );
}
