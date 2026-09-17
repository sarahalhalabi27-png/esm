import CheckListItem from "../common/CheckListItem.jsx";
import { trustHighlights } from "../../data/trustHighlightsData.js";
import parking from "../../assets/parking.png";

export default function TrustHighlights() {
  return (
    <section
      className="relative w-fullmax-w-[1300px] mx-auto h-[606px] border-t border-white/5 bg-cover bg-center bg-fixed font-display"
      style={{ backgroundImage: `url(${parking})` }}
    >
      {/* Dark Overlay - Figma #000000B2 */}
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 max-w-content mx-auto px-6 py-20 text-center">
        <h2 className="w-[1045px] h-[37px] text-[30px] font-semibold leading-[100%] tracking-[0.2em] text-teal-accent mb-4">
          Trusted & Best Limousine Service Across The UAE
        </h2>
        <p className="text-gray-400 text-sm max-w-3xl mx-auto ">
          Experience Luxury Limousine Service In The UAE With Our Reliable
          Airport Transfers, Corporate Travel, And VIP Chauffeur Service. Our
          Professional Chauffeurs And Premium Fleet Ensure A Comfortable And
          Stylish Travel Experience Across Dubai, Abu Dhabi, And Beyond!
        </p>

        <div className="grid sm:grid-cols-2 gap-x-16 gap-y-3 max-w-2xl mx-auto text-left">
          {trustHighlights.map((item) => (
            <CheckListItem key={item}>{item}</CheckListItem>
          ))}
        </div>
      </div>
    </section>
  );
}
