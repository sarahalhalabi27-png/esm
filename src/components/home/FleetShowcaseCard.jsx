import { Link } from "react-router-dom";
import RatingStars from "../common/RatingStars.jsx";
import smokeBg from "../../assets/smoke-bg.png";
import lexus from "../../assets/lexus.png";
import passengersIcon from "../../assets/passengers.svg";
import luggageIcon from "../../assets/luggage.svg";

export default function FleetShowcaseCard({ car }) {
  return (
    <div className="relative w-[416px] max-w-full h-[575px] rounded-[10px] overflow-hidden font-display transition-transform duration-300 ease-out hover:scale-105 hover:z-30">
      {/* Green background - Rectangle 10 */}
      <div className="absolute top-0 left-0 w-full h-[319px] rounded-t-[10px] bg-[#24B9A4]/[0.20] z-0" />

      {/* Smoke — rotated -90°; origin-top-left keeps the rotated box at
          Figma's Top 5 / Left 30 so it spans down behind the Book Now button. */}
      <img
        src={smokeBg}
        alt=""
        className="absolute top-[584px] left-[30px] w-[579px] h-[334px] max-w-none origin-top-left -rotate-90 opacity-[0.14] z-0"
      />

      {/* Black background - Rectangle 11 */}
      <div className="absolute inset-[0.5px] rounded-[9.5px] bg-page/[0.14] backdrop-blur-[39.3px] z-[1]" />

      {/* Card Content */}
      <div className="relative z-10 w-full h-full">
        {/* Car Image */}
        <div className="absolute top-[58px] left-[10px] w-[392px] max-w-[calc(100%-20px)] h-[203px]">
          <img
            src={car.image || lexus}
            alt={car.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Car Name */}
        <h3 className="absolute top-[295px] left-[24px] w-[251px] h-[30px] whitespace-nowrap font-semibold text-[25px] leading-[100%] tracking-[5.5px] capitalize">
          {car.name}
        </h3>

        {/* Reviews + Stars */}
        <div className="absolute top-[355px] left-[24px] flex items-center gap-2 font-normal text-[20px] leading-[100%] capitalize">
          <span>{car.reviewsCount} Reviews</span>
          <RatingStars rating={car.rating} size={16} />
        </div>

        {/* Price */}
        <p className="absolute top-[389px] left-[24px] w-[204px] h-[41px] font-normal text-[20px] leading-[100%] tracking-[0%] capitalize">
          AED {car.pricePerHour.toFixed(2)}{" "}
          <span className="text-[15px] font-normal">/ Per Hour</span>
        </p>

        {/* Divider */}
        <div className="absolute top-[433px] left-[26px] w-[365px] h-0 border-t-[0.5px] border-line" />

        {/* Passengers + Luggage */}
        <div className="absolute top-[449px] left-[26px] w-[365px] flex items-center">
          {/* Passengers */}
          <div className="flex items-center font-normal text-[20px] leading-[100%] capitalize">
            <img
              src={passengersIcon}
              alt=""
              className="w-[25px] h-[20px] shrink-0 me-2"
            />

            <span>{car.passengers} Passengers</span>
          </div>

          {/* Luggage */}
          <div className="ms-auto flex items-center font-normal text-[20px] leading-[100%] capitalize">
            <img
              src={luggageIcon}
              alt=""
              className="w-[25px] h-[20px] shrink-0 me-2"
            />

            <span>{car.luggage} Luggage</span>
          </div>
        </div>

        {/* Book Button */}
        <Link
          to={`/fleet/${car.id}`}
          className="absolute top-[513px] left-[24px] w-[367px] h-[41px] rounded-[10px]"
        >
          {/* Rectangle 9 — Turquoise glow behind the button */}
          <div
            className="absolute left-0 w-full rounded-[10px] z-0"
            style={{
              top: "12px",
              height: "17px",
              background: "#24B9A5",
            }}
          />

          {/* Rectangle 10 — Black glass over the glow */}
          <div
            className="absolute inset-0 rounded-[10px] z-[1]"
            style={{
              background: "rgba(0,0,0,0.7)",
              border: "0.5px solid #FFFFFF",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
            }}
          />

          <span className="relative z-10 flex w-full h-full items-center justify-center font-display font-medium text-[18px] leading-[100%]">
            Book Now
          </span>
        </Link>
      </div>

      {/* Gradient border - always on top */}
      <div
  className="absolute inset-0 rounded-[10px] pointer-events-none z-20 border-[0.5px] border-white"
/>
    </div>
  );
}