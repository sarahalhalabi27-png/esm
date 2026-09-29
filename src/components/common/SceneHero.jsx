import HorizonArc from "./HorizonArc.jsx";

// Page hero: a line-art scene with a curved "horizon" over its bottom edge
// (Services, About Us, Our Fleet).
// Figma (1440 frame): the scene spans left 50 / width 1341, and the arc sits
// over its bottom edge, filled with the page background (hiding the image
// below the curve). Both scale with the width (the arc overlaps the image by
// 19/1341).
// `fullBleed` (Our Fleet): the scene spans the whole 1440 frame instead, while
// the arc keeps its 1341 frame.
// `video` (Blog): a looping, muted background video in place of the image
// (switching source re-mounts it, so only the one in use downloads).
// `mediaClassName` adds classes to the image/video (e.g. a crop).
// `flushTop` (Blog) drops the 16px gap under the header.

export default function SceneHero({
  image,
  video,
  mediaClassName = "",
  title,
  fullBleed = false,
  flushTop = false,
}) {
  const top = flushTop ? "pt-0" : "pt-4";
  const arc = <HorizonArc covering overlap={19} />;
  const media = (base) => {
    const className = `${base} ${mediaClassName}`;
    return video ? (
      <video
        key={video}
        src={video}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    ) : (
      <img src={image} alt="" className={className} />
    );
  };

  if (fullBleed) {
    return (
      <section className={`font-display ${top} pb-10 max-md:pb-6`}>
        <h1 className="sr-only">{title}</h1>
        {media("block w-full max-w-[1440px] mx-auto h-auto")}
        {/* 1341 content + 2 x 50 gutter. The overlap is a % of this content
            box, i.e. of the arc's own frame. */}
        <div className="relative w-full max-w-[1441px] mx-auto px-6 md:px-[50px]">
          {arc}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`font-display px-6 md:px-[50px] ${top} pb-10 max-md:pb-6`}
    >
      <h1 className="sr-only">{title}</h1>

      <div className="relative w-full max-w-[1341px] mx-auto">
        {media("block w-full h-auto")}
        {arc}
      </div>
    </section>
  );
}
