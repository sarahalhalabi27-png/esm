import SectionEyebrow from "../common/SectionEyebrow.jsx";
import CheckListItem from "../common/CheckListItem.jsx";
import { trustHighlights } from "../../data/trustHighlightsData.js";
import parking from "../../assets/parking.png";

export default function TrustHighlights() {
  return (
    <section
      className="relative w-[1340px] mx-auto h-[606px] bg-cover bg-center bg-fixed font-display"
      style={{ backgroundImage: `url(${parking})` }}
    >
      <div className="absolute inset-0 bg-page/70" />

      <div className="relative z-10 pt-[60px] px-[60px] text-left">
        <SectionEyebrow
          className="w-[1045px] whitespace-nowrap text-[30px] leading-[100%] tracking-[0.2em]"
        >
          Trusted & Best Limousine Service Across The UAE
        </SectionEyebrow>

        <p className="w-full text-[25px] font-medium leading-[30px] text-fg mt-[38px]">
          Experience Luxury Limousine Service In The UAE With Our Reliable
          Airport Transfers, Corporate Travel, And VIP Chauffeur Service. Our
          Professional Chauffeurs And Premium Fleet Ensure A Comfortable And
          Stylish Travel Experience Across Dubai, Abu Dhabi, And Beyond!
        </p>

        <div className="w-full grid grid-cols-2 gap-x-16 gap-y-[62px] mt-[45px]">
          {trustHighlights.map((item, index) => (
            <CheckListItem
              key={item}
              className={index % 2 !== 0 ? "translate-x-[200px]" : ""}
            >
              {item}
            </CheckListItem>
          ))}
        </div>
      </div>
    </section>
  );
}