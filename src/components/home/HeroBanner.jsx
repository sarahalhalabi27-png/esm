import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PrimaryButton from "../common/PrimaryButton.jsx";
import CheckListItem from "../common/CheckListItem.jsx";
import LayeredGraphicStage from "../common/LayeredGraphicStage.jsx";
import { buildLayerLayout } from "../../utils/layerLayout.js";
import smoke from "../../assets/smoke.png";
import blackCar from "../../assets/black-car.png";
import building from "../../assets/building.png";

gsap.registerPlugin(ScrollTrigger);

const heroHighlights = [
  "Specialized Expertise",
  "International Standards",
  "Pickup And Delivery Service",
  "Ongoing Support",
];

// Shrink the building + car illustration so the whole thing fits above the
// fold without scrolling, while staying centered in its original position.
const HERO_ILLUSTRATION_SCALE = 0.7;
// Nudge the illustration vertically (negative = raise it up).
const HERO_ILLUSTRATION_OFFSET_Y = -60;

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
  const highlightsListRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(highlightsListRef.current.children, {
        opacity: 0,
        x: -24,
        duration: 1,
        stagger: 0.3,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: highlightsListRef.current,
          start: "top 85%",
          toggleActions: "restart none restart none",
        },
      });
    });
    return () => ctx.revert();
  }, []);

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
          // Tall enough to contain the whole scaled illustration (centered
          // vertically) so overflow-hidden never clips the car at the bottom.
          minHeight:
            (heroIllustrationBox.height * (1 + HERO_ILLUSTRATION_SCALE)) / 2,
        }}
      >
        {/* Left Content */}
        <div className="relative z-10 w-[565px] -translate-y-[130px]">
          <p className="text-[25px] font-normal leading-[100%] tracking-[0%] capitalize mb-[26px]">
            Specialized Services For Luxury Cars
          </p>

          <h1 className="w-[565px] text-[50px] font-normal leading-[61px] tracking-[0%] capitalize mb-[45px]">
            A Sophisticated Experience Befitting Your{" "}
            <span className="luxury-shine relative inline-block font-semibold">
              Luxury Car
              <span className="absolute left-0 bottom-[-8px] w-[281px] border-b border-fg"></span>
            </span>
          </h1>

          <PrimaryButton className="w-[365px] h-[50px] rounded-[10px] text-[20px] font-normal leading-[100%] tracking-[0%] capitalize font-display mb-[47px]">
            Quickly Book Your Luxury Ride
          </PrimaryButton>

          <ul
            ref={highlightsListRef}
            className="w-[318px] h-[144px] space-y-5 mt-[30px]"
          >
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
            // Vertical placement (negative raises it toward the nav).
            top: HERO_ILLUSTRATION_OFFSET_Y,
            width: heroIllustrationBox.width,
            height: heroIllustrationBox.height,
            // Scale down anchored at the buildings' own centre (~65% across,
            // vertically centred): keeps the buildings in their original spot,
            // gives the tops clearance, and lifts the car fully into view.
            transform: `scale(${HERO_ILLUSTRATION_SCALE})`,
            transformOrigin: "65% center",
            zIndex: 0,
          }}
        />
      </div>
    </section>
  );
}
