import PrimaryButton from "../common/PrimaryButton.jsx";
import CheckListItem from "../common/CheckListItem.jsx";
import LayeredGraphicStage from "../common/LayeredGraphicStage.jsx";
import { buildLayerLayout } from "../../utils/layerLayout.js";
import smoke from "../../assets/smoke.png";
import blackCar from "../../assets/black-car.png";
import building from "../../assets/building.png";

const heroHighlights = [
  "Specialized Expertise",
  "International Standards",
  "Pickup And Delivery Service",
  "Ongoing Support",
];

const { layers: heroIllustrationLayers, box: heroIllustrationBox } =
  buildLayerLayout([
    {
      src: building,
      alt: "",
      top: 71,
      left: 518,
      width: 922,
      height: 760,
      objectFit: "cover",
      zIndex: 10,
    },
    {
      src: smoke,
      alt: "",
      top: 539,
      left: 136,
      width: 1084,
      height: 608,
      opacity: 0.3,
      zIndex: 40,
    },
    {
      src: blackCar,
      alt: "",
      top: 642,
      left: 490,
      width: 1000,
      height: 335,
      objectFit: "cover",
      zIndex: 30,
    },
  ]);

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden font-display -mt-[37px]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 65% 40%, rgba(63,224,176,0.10), transparent 55%)",
        }}
      />

      <div
        className="relative w-full pl-[50px] pr-[128px] pt-[195px] pb-24 mr-[128px]"
        style={{
          minHeight: heroIllustrationBox.top + heroIllustrationBox.height,
        }}
      >
        {/* Left Content */}
        <div className="relative z-10 w-[565px]">
          <p className="text-[25px] font-normal leading-[100%] tracking-[0%] capitalize mb-[26px]">
            Specialized Services For Luxury Cars
          </p>

          <h1 className="w-[565px] text-[50px] font-normal leading-[61px] tracking-[0%] capitalize mb-[45px]">
            A Sophisticated Experience Befitting Your{" "}
            <span className="relative inline-block font-semibold text-teal-accent">
              Luxury Car
              <span className="absolute left-0 bottom-[-8px] w-[281px] border-b border-white"></span>
            </span>
          </h1>

          <PrimaryButton className="w-[365px] h-[50px] rounded-[10px] text-[20px] font-normal leading-[100%] tracking-[0%] capitalize font-display mb-[47px]">
            Quickly Book Your Luxury Ride
          </PrimaryButton>

          <ul className="w-[318px] h-[144px] space-y-5 mt-[30px]">
            {heroHighlights.map((item) => (
              <CheckListItem key={item}>{item}</CheckListItem>
            ))}
          </ul>
        </div>
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: 772,
            top: 501,
            width: 446,
            height: 450,
            backgroundColor: "#24B9A5",
            // Figma layer-blur 702.6 doesn't map 1:1 to CSS blur; these values
            // reproduce Figma's subtle localized glow instead of a harsh wash.
            filter: "blur(190px)",
            opacity: 0.45,
            zIndex: 0,
          }}
        />
        <LayeredGraphicStage
          layers={heroIllustrationLayers}
          style={{
            position: "absolute",
            left: heroIllustrationBox.left,
            // Pull the illustration flush under the (black) header so it hugs
            // the nav with no black gap, matching the Overview page in Figma.
            top: 0,
            width: heroIllustrationBox.width,
            height: heroIllustrationBox.height,
            zIndex: 0,
          }}
        />
      </div>
    </section>
  );
}
