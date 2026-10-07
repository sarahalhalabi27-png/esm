import gsap from "gsap";
import highlightWords from "../../utils/highlightWords.jsx";
import useLocalizedPost from "./useLocalizedPost.js";
import useSectionReveal from "../carDetails/useSectionReveal.js";

const accent = "text-teal-accent";

// The two teal glows in the title band (temporarily off).
const SHOW_BAND_GLOWS = false;

// Blog post top (Figma, 1440 frame):
// - a 615px band right under the header: the post's photo, full width, under
//   a 76% black overlay with a 13px backdrop blur, and the title (Semibold
//   25px, 987 wide, 230px from the band top, accent words teal);
// - 32px below, the photo itself (870 x 437, radius 15, mirrored crop);
// - 32px below that, the title again on one line (Semibold 25px, 1026 wide).
// Reveal, once the photo scrolls into view: it is wiped in from the start side
// (the box is mirrored, so its clip runs the other way round), then the title
// under it rises in.
function buildPhotoReveal({ root, tl, direction }) {
  const photo = root.querySelector("[data-hero-photo]");
  const caption = root.querySelector("p");
  const clipped = direction < 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";

  gsap.set(caption, { autoAlpha: 0 });

  tl.fromTo(
    photo,
    { clipPath: clipped },
    {
      clipPath: "inset(0 0% 0 0%)",
      duration: 1,
      ease: "power2.inOut",
      clearProps: "clipPath",
    }
  ).fromTo(
    caption,
    { autoAlpha: 0, y: 14 },
    { autoAlpha: 1, y: 0, duration: 0.7, clearProps: "transform" },
    "-=0.4"
  );
}

// Reveal, as the band comes into view: the title's words rise in one after
// another, then the accent words (teal) glow once.
function buildTitleReveal({ root, tl }) {
  const words = root.querySelectorAll("[data-word]");
  const accents = root.querySelectorAll("[data-accent]");

  gsap.set(words, { autoAlpha: 0 });

  tl.fromTo(
    words,
    { autoAlpha: 0, y: 18 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.09,
      clearProps: "transform",
    }
  ).fromTo(
    accents,
    { textShadow: "0 0 0px rgba(36, 185, 165, 0)" },
    {
      textShadow: "0 0 18px rgba(36, 185, 165, 0.9)",
      duration: 0.45,
      ease: "sine.inOut",
      yoyo: true,
      repeat: 1,
      clearProps: "textShadow",
    },
    "-=0.3"
  );
}

// The band title split into words (one inline-block span each, so they can
// move on their own), keeping its line breaks and the accent words teal.
function TitleWords({ title, accents }) {
  const bare = (word) => word.replace(/[^\p{L}\p{N}]+$/u, "");
  return title.split("\n").map((line, lineIndex) => (
    <span key={lineIndex} className="block">
      {line.split(" ").map((word, index) => {
        const isAccent = accents?.includes(bare(word));
        return (
          <span key={index}>
            {index > 0 ? " " : null}
            <span
              data-word
              {...(isAccent ? { "data-accent": "" } : {})}
              className={`inline-block ${isAccent ? accent : ""}`}
            >
              {word}
            </span>
          </span>
        );
      })}
    </span>
  ));
}

export default function BlogPostHero({ post }) {
  const { title, titleAccents, heroImage } = useLocalizedPost(post);
  const photoRef = useSectionReveal(buildPhotoReveal, {
    key: post.id,
    replay: true,
  });
  const bandRef = useSectionReveal(buildTitleReveal, {
    key: post.id,
    replay: true,
  });
  const oneLineTitle = title.replace(/\s*\n\s*/g, " ");

  return (
    <section className="font-display">
      <div
        ref={bandRef}
        className="relative h-[615px] overflow-hidden max-md:h-[300px]"
      >
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#000000C2] backdrop-blur-[6.1px]"
        />
        {/* Teal glows (Figma ellipses, 100 x 100, layer blur 242) - switched
            off for now, see SHOW_BAND_GLOWS */}
        {SHOW_BAND_GLOWS && (
          <>
            <div
              aria-hidden="true"
              className="hidden md:block pointer-events-none absolute top-[207px] left-[calc(50%-376px)] w-[100px] h-[100px] rounded-full bg-[#24B9A5]/50 blur-[121px]"
            />
            <div
              aria-hidden="true"
              className="hidden md:block pointer-events-none absolute top-[294px] left-[calc(50%+216px)] w-[100px] h-[100px] rounded-full bg-[#24B9A5]/50 blur-[121px]"
            />
          </>
        )}
        <h1 className="absolute inset-x-0 top-[230px] mx-auto w-[987px] max-w-full px-6 whitespace-pre-line text-center text-[25px] font-semibold leading-[120%] capitalize text-white max-md:top-1/2 max-md:-translate-y-1/2 max-md:px-4 max-md:text-lg max-md:leading-snug">
          <TitleWords title={title} accents={titleAccents} />
        </h1>
      </div>

      <div ref={photoRef} className="px-6 mt-[32px] max-md:mt-6">
        {/* The same photo, mirrored and cropped to the glass pane (its black
            frame and the dim sides trimmed off): 1113 x 478 inside 870 x 437. */}
        <div
          data-hero-photo
          className="relative -scale-x-100 w-[870px] max-w-full aspect-[870/437] mx-auto rounded-[15px] overflow-hidden"
        >
          <img
            src={heroImage}
            alt={oneLineTitle}
            className="absolute top-0 left-[-13.56%] w-[127.93%] max-w-none h-auto"
          />
        </div>
        <p className="mt-[32px] mx-auto w-[1026px] max-w-full min-h-[30px] text-center text-[25px] font-semibold leading-[100%] capitalize text-fg max-md:mt-6 max-md:text-lg max-md:leading-snug">
          {highlightWords(oneLineTitle, titleAccents, accent)}
        </p>
      </div>
    </section>
  );
}
