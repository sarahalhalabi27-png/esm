import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RatingStars from "../common/RatingStars.jsx";
import MaskIcon from "../common/MaskIcon.jsx";
import smokeBg from "../../assets/our-luxury-fleet/smoke-bg.webp";
import lexus from "../../assets/our-luxury-fleet/lexus.webp";
import passengersIcon from "../../assets/our-luxury-fleet/passenger.svg";
import luggageIcon from "../../assets/our-luxury-fleet/luggage.svg";

const specIconClass =
  "w-[25px] h-[20px] shrink-0 me-2 max-md:w-[20px] max-md:h-[16px] max-md:me-1.5";

// Teal SVG as-is in dark mode; in light mode the same outline (2px strokes)
// is used as a mask and filled #072E2A.
function SpecIcon({ src }) {
  return (
    <>
      <img src={src} alt="" className={`dark-only ${specIconClass}`} />
      <MaskIcon
        src={src}
        display="light-only"
        colorClassName="bg-[#072E2A]"
        className={specIconClass}
      />
    </>
  );
}

// The card's content flows top to bottom with even spacing (24px padding,
// 16-20px between the parts), so its height follows the content: about 430px
// (Figma's absolutely placed version was 575px). The green band behind the
// photo and name is a fixed-height layer that matches that top part.
// Phones (max-md:*): same card, a little tighter - fluid width so the next
// card peeks in the carousel.
export default function FleetShowcaseCard({ car }) {
  const { t } = useTranslation();
  return (
    <div className="group relative w-[416px] max-w-full xl:w-full max-md:w-[var(--snap-card-w,82vw)] max-md:max-w-[340px] rounded-[10px] overflow-hidden font-display transition-transform duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 hover:z-30">
      {/* Green background behind the photo and the name */}
      <div className="absolute top-0 start-0 w-full h-[232px] max-md:h-[188px] rounded-t-[10px] bg-[#24B9A4]/[0.20] z-0" />

      {/* Smoke — rotated -90°; origin-top-left, so it spans up from just
          below the card's bottom edge, behind the Book Now button. */}
      <img
        src={smokeBg}
        alt=""
        className="absolute top-[calc(100%+9px)] start-[30px] w-[579px] h-[334px] max-w-none origin-top-left -rotate-90 opacity-[0.14] z-0"
      />

      {/* Black background - Rectangle 11 */}
      <div className="absolute inset-[0.5px] rounded-[9.5px] bg-page/[0.14] backdrop-blur-[39.3px] z-[1]" />

      {/* Card Content */}
      <div className="relative z-10 px-6 pt-6 pb-6 max-md:px-5 max-md:pt-5 max-md:pb-5">
        {/* Car Image: 150px tall box (120px on phones), as wide as the text */}
        <div className="h-[150px] max-md:h-[120px]">
          <img
            src={car.image || lexus}
            alt={car.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Car Name */}
        <h3 className="mt-5 max-md:mt-3.5 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-[25px] leading-[30px] tracking-[3px] max-md:text-[clamp(16px,4.9vw,20px)] max-md:leading-[26px] max-md:tracking-[2px] capitalize text-teal-accent">
          {car.name}
        </h3>

        {/* Reviews + Stars */}
        <div className="mt-4 max-md:mt-3.5 flex items-center gap-2 font-normal text-[20px] max-md:text-base leading-[100%] capitalize">
          <span>
            {car.reviewsCount} {t("common.reviews")}
          </span>
          <RatingStars rating={car.rating} size={16} />
        </div>

        {/* Price */}
        <p className="mt-2.5 max-md:mt-2 whitespace-nowrap font-normal text-[20px] max-md:text-base leading-[100%] tracking-[0%] capitalize">
          {car.pricePerHour.toFixed(2)} {t("common.currency")}{" "}
          <span className="text-[15px] max-md:text-[13px] font-normal">
            / {t("common.perHour")}
          </span>
        </p>

        {/* Divider */}
        <div className="mt-4 max-md:mt-3.5 h-0 border-t-[0.5px] border-line" />

        {/* Passengers + Luggage */}
        <div className="mt-4 max-md:mt-3.5 flex items-center max-md:gap-2 max-md:whitespace-nowrap">
          {/* Passengers */}
          <div className="flex items-center font-normal text-[20px] max-md:text-[clamp(12px,3.7vw,16px)] leading-[100%] capitalize">
            <SpecIcon src={passengersIcon} />

            <span>
              {car.passengers} {t("common.passengers")}
            </span>
          </div>

          {/* Luggage */}
          <div className="ms-auto flex items-center font-normal text-[20px] max-md:text-[clamp(12px,3.7vw,16px)] leading-[100%] capitalize">
            <SpecIcon src={luggageIcon} />

            <span>
              {car.luggage} {t("common.luggage")}
            </span>
          </div>
        </div>

        {/* Book Button */}
        <Link
          to={`/fleet/${car.id}`}
          className="relative mt-5 max-md:mt-[18px] block h-11 rounded-[10px] overflow-hidden"
        >
          {/* Dark Mode — Turquoise glow. Desktop: softened by the glass layer's
      backdrop-filter. Phones: that backdrop blur isn't applied reliably
      (mobile Chrome showed a hard teal band), so blur the glow itself. */}
          <div
            className="dark-only absolute start-0 w-full rounded-[10px] z-0 max-md:blur-[9px] max-md:opacity-80"
            style={{
              top: "13px",
              height: "17px",
              background: "rgb(var(--accent))",
            }}
          />

          {/* Dark Mode — Black glass */}
          <div
            className="dark-only absolute inset-0 rounded-[10px] z-[1]"
            style={{
              background: "rgba(0,0,0,0.7)",
              border: "0.5px solid #FFFFFF",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
            }}
          />

          {/* Light Mode — Solid button */}
          <div className="light-only absolute inset-0 rounded-[10px] z-0 bg-teal-accent" />

          <span className="relative z-10 flex w-full h-full items-center justify-center font-display font-medium text-[18px] leading-[100%] text-white">
            {t("common.bookNow")}
          </span>
        </Link>
      </div>

      {/* Hairline teal border, above everything; brightens on hover */}
      <div className="absolute inset-0 rounded-[10px] pointer-events-none z-20 border-[0.5px] border-[#24B9A5]/35 transition-colors duration-300 group-hover:border-[#24B9A5]/70" />

      {/* A streak of light always runs around the edge (index.css) */}
      <span
        aria-hidden="true"
        className="border-beam border-beam--always rounded-[10px] z-20"
      />
    </div>
  );
}
