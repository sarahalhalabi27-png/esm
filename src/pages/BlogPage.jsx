import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import PageLayout from "../components/layout/PageLayout.jsx";
import BlogPageHero from "../components/blog/BlogPageHero.jsx";
import BlogPostCard from "../components/blog/BlogPostCard.jsx";
import SectionEyebrow from "../components/common/SectionEyebrow.jsx";
import SmokeBackdrop from "../components/common/SmokeBackdrop.jsx";
import {
  fetchBlogPosts,
  selectBlogPosts,
  selectBlogPostsStatus,
} from "../store/blogSlice.js";
import { STATUS } from "../store/constants.js";
import useSectionReveal from "../components/carDetails/useSectionReveal.js";

// Reveal of the post cards (each time the grid comes into view): one after
// another, each card is wiped in from the start side while sliding in the same
// way, and the next begins as it settles. The clip and transform are handed
// back to CSS afterwards so the hover lift and the card's ring keep working.
function buildCardsReveal({ root, tl, direction }) {
  const cards = [...root.children];
  const clipped = direction < 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";

  gsap.set(cards, { autoAlpha: 0 });

  cards.forEach((card, index) => {
    tl.fromTo(
      card,
      { autoAlpha: 1, clipPath: clipped, x: -40 * direction },
      {
        clipPath: "inset(0 0% 0 0%)",
        x: 0,
        duration: 0.8,
        ease: "power2.inOut",
        clearProps: "clipPath,transform",
      },
      index * 0.45
    );
  });
}

export default function BlogPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const posts = useSelector(selectBlogPosts);
  const status = useSelector(selectBlogPostsStatus);
  // The posts arrive after mount: rebuild the reveal once they are there.
  const gridRef = useSectionReveal(buildCardsReveal, {
    key: posts.length,
    replay: true,
  });

  useEffect(() => {
    if (status === STATUS.IDLE) dispatch(fetchBlogPosts());
  }, [status, dispatch]);

  return (
    <PageLayout>
      <BlogPageHero />

      {/* Latest Car News (Figma, 1440 frame): 100px under the hero's arc (its
          40px bottom padding + 60). The eyebrow (Semibold 25px, 30px line) at
          the 50px gutter; 27px under it the intro (Medium 22px, two 27px lines,
          1368 wide — 28px past the content edge); 51px under that, three
          416 x 624 cards, 47px apart. */}
      <section className="relative isolate font-display w-full max-w-[1440px] mx-auto px-[50px] mt-[60px] mb-[140px] max-md:px-6 max-md:mt-10 max-md:mb-16">
        <SmokeBackdrop />
        <SectionEyebrow className="!leading-[30px] max-md:!text-xl max-md:!leading-snug">
          {t("blogPage.eyebrow")}
        </SectionEyebrow>
        <p className="mt-[27px] w-[1368px] max-w-[calc(100%+28px)] -me-[28px] text-[22px] font-medium leading-[27px] capitalize text-fg max-lg:w-auto max-lg:max-w-none max-lg:me-0 max-md:mt-4 max-md:text-base max-md:leading-snug">
          {t("blogPage.description")}
        </p>

        {/* Phones: Card Snap Carousel, like the home page (see
            .mobile-carousel--snap in index.css). */}
        <div
          ref={gridRef}
          className="mobile-carousel mobile-carousel--snap mt-[51px] grid grid-cols-[repeat(3,416px)] gap-x-[47px] gap-y-12 max-lg:grid-cols-2 max-lg:gap-x-8 max-md:mt-8 max-md:gap-3 max-md:py-4"
        >
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
