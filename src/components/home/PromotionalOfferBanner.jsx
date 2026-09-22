import { ArrowRight } from "lucide-react";

import SectionEyebrow from "../common/SectionEyebrow.jsx";
import offerCar from "../../assets/offer_car.png";
import smoke1 from "../../assets/smoke1.png";

export default function PromotionalOfferBanner() {
  return (
    <section className="font-display">
      <div className="max-w-content mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <SectionEyebrow>Our Special Offers For You</SectionEyebrow>

          <h2 className="text-2xl font-semibold mt-[40px] mb-[11px]">
            Enjoy 10% Off Your Next Ride!
          </h2>

          <p className="text-fg font-['Montserrat_Alternates'] font-normal text-[20px] leading-[130%] tracking-[0%] capitalize w-[703px] h-[48px] mb-6">
            Book Your Luxury Limousine Today And Save 10% On Premium Chauffeur
            Services Across The UAE.
          </p>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 w-[300px] h-[50px] rounded-[10px] font-display font-medium text-[18px] leading-[100%] tracking-[0%] capitalize text-white"
            style={{ background: "#072E2A" }}
          >
            Claim Discount
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Offer car + smoke */}
        <div className="relative flex justify-end translate-x-[-160px]">
          {/* Smoke */}
          <img
            src={smoke1}
            alt=""
            className="absolute w-[587px] h-[392px] object-contain opacity-[0.66] z-0 translate-x-[200px] translate-y-[20px]"
          />

          {/* Car */}
          <img
            src={offerCar}
            alt="Luxury limousine"
            className="relative z-10 w-[450px] h-[276px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}