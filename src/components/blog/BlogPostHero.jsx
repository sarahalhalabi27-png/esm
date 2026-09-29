import highlightWords from "../../utils/highlightWords.jsx";
import useLocalizedPost from "./useLocalizedPost.js";

const accent = "text-teal-accent";

// Blog post top (Figma, 1440 frame):
// - a 570px band right under the header: the post's photo, full width and
//   dimmed, with a rounded "glass" pane over its middle (1200 wide) and the
//   title centred on it (Semibold 22px, two 30px lines, accent words teal);
//   the band fades into the page at the bottom;
// - 86px below, the photo itself in a rounded frame (884 x 446);
// - 47px below that, the title again on one line.
export default function BlogPostHero({ post }) {
  const { title, titleAccents, heroImage } = useLocalizedPost(post);
  const oneLineTitle = title.replace(/\s*\n\s*/g, " ");

  return (
    <section className="font-display">
      <div className="relative h-[570px] overflow-hidden max-md:h-[300px]">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.28] scale-105 blur-[2px]"
        />
        {/* Fade into the page at the bottom */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-page"
        />
        <div className="relative h-full max-w-[1200px] mx-auto px-6 pb-8 max-md:px-4 max-md:pb-4">
          <div className="h-full rounded-b-[20px] border-x border-b border-white/10 bg-white/[0.04] backdrop-blur-[1px] flex items-center justify-center px-10 max-md:px-4">
            <h1 className="whitespace-pre-line text-center text-[22px] font-semibold leading-[30px] capitalize text-white max-md:text-lg max-md:leading-snug">
              {highlightWords(title, titleAccents, accent)}
            </h1>
          </div>
        </div>
      </div>

      <div className="px-6 mt-[86px] max-md:mt-10">
        <img
          src={heroImage}
          alt={oneLineTitle}
          className="block w-[884px] max-w-full aspect-[884/446] mx-auto rounded-[16px] object-cover"
        />
        <p className="mt-[47px] text-center text-[22px] font-semibold leading-[30px] capitalize text-fg max-md:mt-6 max-md:text-lg max-md:leading-snug">
          {highlightWords(oneLineTitle, titleAccents, accent)}
        </p>
      </div>
    </section>
  );
}
