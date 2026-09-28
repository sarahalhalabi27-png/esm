import SceneHero from "../common/SceneHero.jsx";
import aboutScene from "../../assets/about/about-hero.webp";

export default function AboutPageHero() {
  return (
    <>
      <SceneHero image={aboutScene} title="About ESM Limo" />

      {/* Intro line under the scene (Figma: 1341 wide, 140px under the arc,
          centered 25px medium, two 30px lines) */}
      <p className="font-display w-full max-w-[1341px] mx-auto mt-[100px] px-6 md:px-0 text-center text-[25px] font-medium leading-[30px] capitalize text-fg max-md:mt-6 max-md:text-lg max-md:leading-snug">
        At ESM Limo, We Place Our Clients First, Delivering Luxury
        Transportation Defined By Comfort And Precision.
      </p>
    </>
  );
}
