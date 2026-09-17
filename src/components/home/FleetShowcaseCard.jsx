import { Link } from "react-router-dom";
import RatingStars from "../common/RatingStars.jsx";
import smokeBg from "../../assets/smoke-bg.png";
import lexus from "../../assets/lexus.png";

export default function FleetShowcaseCard({ car }) {
  return (
    <div className="relative w-[416px] h-[575px] rounded-[10px] overflow-hidden font-display">
      {/* Green background - Rectangle 10 */}
      <div className="absolute top-0 left-0 w-[416px] h-[319px] rounded-t-[10px] bg-[#24B9A4]/[0.20] z-0" />

      {/* Smoke */}
      <img
        src={smokeBg}
        alt=""
        className="absolute top-[5px] left-[30px] w-[579px] h-[334px] -rotate-90 opacity-[0.14] z-0"
      />

      {/* Black background - Rectangle 11 */}
      <div className="absolute inset-[0.5px] rounded-[9.5px] bg-black/[0.14] backdrop-blur-[39.3px] z-[1]" />

      {/* Card Content */}
      <div className="relative z-10 w-full h-full">
        {/* Car Image */}
        <div className="absolute top-[58px] left-[10px] w-[392px] h-[203px]">
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
        <div className="absolute top-[433px] left-[26px] w-[365px] h-0 border-t-[0.5px] border-white" />

        {/* Passengers + Luggage */}
        <div className="absolute top-[449px] left-[26px] w-[365px] flex items-center">
          {/* Passengers */}
          <div className="flex items-center font-normal text-[20px] leading-[100%] capitalize">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-[40px] h-[36px] shrink-0 mr-2"
            >
              <g
                fill="none"
                stroke="#24B9A5"
                strokeWidth="36"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="188" cy="188" r="70" />

                <path d="M 68 360 C 68 285, 120 270, 188 270 C 256 270, 308 285, 308 360 L 308 370" />

                <path d="M 300 135 A 68 68 0 0 1 300 245" />

                <path d="M 352 285 C 390 295, 412 315, 412 370" />
              </g>
            </svg>

            <span>{car.passengers} Passengers</span>
          </div>

          {/* Luggage */}
          <div className="ml-auto flex items-center font-normal text-[20px] leading-[100%] capitalize">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="90 90 340 330"
              className="w-[20px] h-[18px] shrink-0 mr-2"
            >
              <rect
                x="100"
                y="160"
                width="312"
                height="240"
                rx="30"
                ry="30"
                fill="none"
                stroke="#24B9A5"
                strokeWidth="24"
              />

              <rect
                x="200"
                y="100"
                width="112"
                height="112"
                rx="20"
                ry="20"
                fill="none"
                stroke="#24B9A5"
                strokeWidth="24"
              />

              <rect
                x="200"
                y="200"
                width="24"
                height="200"
                rx="10"
                ry="10"
                fill="none"
                stroke="#24B9A5"
                strokeWidth="24"
              />

              <rect
                x="288"
                y="200"
                width="24"
                height="200"
                rx="10"
                ry="10"
                fill="none"
                stroke="#24B9A5"
                strokeWidth="24"
              />

              <path d="M 450 450 l 8 -8 l 8 8 l -8 8 z" fill="#c0c0c0" />
            </svg>

            <span>{car.luggage} Luggage</span>
          </div>
        </div>

        {/* Book Button */}
        <Link
          to={`/fleet/${car.id}`}
          className="absolute top-[513px] left-[24px] w-[367px] h-[41px] rounded-[10px]"
        >
          {/* Rectangle 9 — التوهج التركوازي، بالخلف، منزّل لتحت جوا مساحة الزر */}
          <div
            className="absolute left-0 w-full rounded-[10px] z-0"
            style={{ top: "12px", height: "17px", background: "#24B9A5" }}
          />

          {/* Rectangle 10 — الزجاج الأسود، فوق، بيخلي التوهج يبين من تحته بس */}
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
        className="absolute inset-0 rounded-[10px] pointer-events-none z-20"
        style={{
          padding: "0.5px",
          background: "linear-gradient(180deg, #797979 0%, #FFFFFF 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
    </div>
  );
}
