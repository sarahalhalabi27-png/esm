import { ArrowRight } from "lucide-react";

import SectionEyebrow from "../common/SectionEyebrow.jsx";
import PrimaryButton from "../common/PrimaryButton.jsx";
import CarLineArtIllustration from "../common/CarLineArtIllustration.jsx";

export default function PromotionalOfferBanner() {
  return (
    <section className="font-display">
      <div className="max-w-content mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">

        <div>
          <SectionEyebrow>Our Special Offers For You</SectionEyebrow>

          <h2 className="text-2xl font-semibold mt-[40px] mb-[11px]">
            Enjoy 10% Off Your Next Ride!
          </h2>

          <p className="text-fg font-['Montserrat_Alternates'] font-normal text-[20px] leading-[100%] tracking-[0%] capitalize w-[703px] h-[48px] mb-6">
            Book Your Luxury Limousine Today And Save 10% On Premium Chauffeur
            Services Across The UAE.
          </p>

          <PrimaryButton icon={ArrowRight}>Claim Discount</PrimaryButton>
        </div>

        <CarLineArtIllustration className="w-full max-w-md ml-auto" />

      </div>
    </section>
  );
}