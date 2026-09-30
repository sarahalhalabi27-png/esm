import { useTranslation } from "react-i18next";
import MaskIcon from "./MaskIcon.jsx";
import starsIcon from "../../assets/our-luxury-fleet/stars.svg";

// The stars strip (97x17) filled with the theme accent: #24B9A5 in dark
// mode, #072E2A in light mode. Announced as "<rating> out of 5 stars".
export default function RatingStars({ rating = 0, size = 12 }) {
  const { t } = useTranslation();
  return (
    <MaskIcon
      src={starsIcon}
      display="block"
      label={t("common.ratingLabel", { rating })}
      style={{ width: (size * 97) / 17, height: size }}
    />
  );
}
