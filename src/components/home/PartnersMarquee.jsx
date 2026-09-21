import SectionEyebrow from "../common/SectionEyebrow.jsx";
import uberLogo from "../../assets/uber.png";
import boltLogo from "../../assets/bolt.png";
import yangoLogo from "../../assets/yango.png";

export default function PartnersMarquee() {
  return (
    <section className="font-display">
      <div className="w-[1341px] h-[75px] ml-[50px] -mt-[30px] flex items-center">
        <div className="flex items-center gap-10">

          {/* Section Title */}
          <SectionEyebrow
            className="
              w-[232px]
              h-[30px]
              shrink-0
              text-[25px]
              font-semibold
              leading-[100%]
              tracking-[0%]
              capitalize
              mb-0
            "
          >
            Our Best Partners
          </SectionEyebrow>

          {/* Partners */}
          <div className="flex items-center ml-[154px] gap-[152px] opacity-80">
            <img
              src={uberLogo}
              alt="Uber"
              className="w-[127px] h-[51px] object-contain"
            />

            <img
              src={boltLogo}
              alt="Bolt"
              className="object-contain"
            />

            <img
              src={yangoLogo}
              alt="Yango"
              className="object-contain"
            />

            <img
              src={uberLogo}
              alt="Uber"
              className="w-[127px] h-[51px] object-contain"
            />
          </div>

        </div>
      </div>
    </section>
  );
}