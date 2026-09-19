import CheckListItem from "../common/CheckListItem.jsx";
import { trustHighlights } from "../../data/trustHighlightsData.js";
import parking from "../../assets/parking.png";

export default function TrustHighlights() {
  return (
    <section
      className="relative w-[1380px] mx-auto h-[606px] bg-cover bg-center bg-fixed font-display"
      style={{ backgroundImage: `url(${parking})` }}
    >
      {/* Dark Overlay - Figma #000000B2 */}
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 pl-[50px] pr-[50px] pt-[60px] text-left">
        <h2 className="w-[1045px] whitespace-nowrap text-[30px] font-semibold leading-[100%] tracking-[0.2em] text-teal-accent">
          Trusted & Best Limousine Service Across The UAE
        </h2>
        <p className="w-full text-[25px] font-medium leading-[30px] text-white mt-[38px]">
          Experience Luxury Limousine Service In The UAE With Our Reliable
          Airport Transfers, Corporate Travel, And VIP Chauffeur Service. Our
          Professional Chauffeurs And Premium Fleet Ensure A Comfortable And
          Stylish Travel Experience Across Dubai, Abu Dhabi, And Beyond!
        </p>

        <div className="w-full grid grid-cols-2 gap-x-16 gap-y-[62px] mt-[45px] -mr-[30px]">
          {trustHighlights.map((item) => (
            <CheckListItem key={item}>{item}</CheckListItem>
          ))}
        </div>
      </div>
    </section>
  );
}
