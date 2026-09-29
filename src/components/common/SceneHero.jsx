import HorizonArc from "./HorizonArc.jsx";

// Page hero: a line-art scene with a curved "horizon" over its bottom edge
// (Services, About Us, Our Fleet).
// Figma (1440 frame): the scene spans left 50 / width 1341, and the arc sits
// over its bottom edge, filled with the page background (hiding the image
// below the curve). Both scale with the width (the arc overlaps the image by
// 19/1341).
// `fullBleed` (Our Fleet): the scene spans the whole 1440 frame instead, while
// the arc keeps its 1341 frame.

export default function SceneHero({ image, title, fullBleed = false }) {
  const arc = <HorizonArc covering overlap={19} />;

  if (fullBleed) {
    return (
      <section className="font-display pt-4 pb-10 max-md:pb-6">
        <h1 className="sr-only">{title}</h1>
        <img
          src={image}
          alt=""
          className="block w-full max-w-[1440px] mx-auto h-auto"
        />
        {/* 1341 content + 2 x 50 gutter. The overlap is a % of this content
            box, i.e. of the arc's own frame. */}
        <div className="relative w-full max-w-[1441px] mx-auto px-6 md:px-[50px]">
          {arc}
        </div>
      </section>
    );
  }

  return (
    <section className="font-display px-6 md:px-[50px] pt-4 pb-10 max-md:pb-6">
      <h1 className="sr-only">{title}</h1>

      <div className="relative w-full max-w-[1341px] mx-auto">
        <img src={image} alt="" className="block w-full h-auto" />
        {arc}
      </div>
    </section>
  );
}
