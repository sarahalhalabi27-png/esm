import gsap from "gsap";
import useSectionReveal, {
  slideInFromStart,
} from "../carDetails/useSectionReveal.js";

// Reveal (each section as it scrolls into view, again on every return): the
// heading slides in from the start side, then the paragraphs rise in under it.
function buildSectionReveal({ root, tl, direction }) {
  const heading = root.querySelector("h2");
  const paragraphs = root.querySelectorAll("p");

  gsap.set([heading, ...paragraphs], { autoAlpha: 0 });

  slideInFromStart(tl, heading, direction).fromTo(
    paragraphs,
    { autoAlpha: 0, y: 18 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      clearProps: "transform",
    },
    "-=0.5"
  );
}

// One numbered section of a text page: a teal heading and its paragraphs,
// under a hairline. `number` is shown as 01, 02...
export default function LegalSection({ number, heading, paragraphs }) {
  const ref = useSectionReveal(buildSectionReveal, {
    key: heading,
    replay: true,
  });

  return (
    <section ref={ref} className="border-t border-line/15 pt-10 max-md:pt-7">
      <h2 className="flex items-baseline gap-4 text-[25px] font-semibold leading-[30px] capitalize text-teal-accent max-md:text-xl max-md:leading-snug">
        <span className="text-fg/40" aria-hidden="true">
          {String(number).padStart(2, "0")}
        </span>
        {heading}
      </h2>
      <div className="mt-5 flex flex-col gap-4 ps-[46px] max-md:ps-0">
        {paragraphs.map((text) => (
          <p
            key={text}
            className="text-[20px] font-medium leading-[135%] text-fg/85 max-md:text-[16px] max-md:leading-relaxed"
          >
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}
