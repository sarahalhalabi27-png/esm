import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/layout/PageLayout.jsx";
import BlogPageHero from "../components/blog/BlogPageHero.jsx";
import BlogPostCard from "../components/blog/BlogPostCard.jsx";
import SectionEyebrow from "../components/common/SectionEyebrow.jsx";
import {
  fetchBlogPosts,
  selectBlogPosts,
  selectBlogPostsStatus,
} from "../store/blogSlice.js";
import { STATUS } from "../store/constants.js";

export default function BlogPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const posts = useSelector(selectBlogPosts);
  const status = useSelector(selectBlogPostsStatus);

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
      <section className="font-display w-full max-w-[1440px] mx-auto px-[50px] mt-[60px] mb-[140px] max-md:px-6 max-md:mt-10 max-md:mb-16">
        <SectionEyebrow className="!leading-[30px] max-md:!text-xl max-md:!leading-snug">
          {t("blogPage.eyebrow")}
        </SectionEyebrow>
        <p className="mt-[27px] w-[1368px] max-w-[calc(100%+28px)] -me-[28px] text-[22px] font-medium leading-[27px] capitalize text-fg max-lg:w-auto max-lg:max-w-none max-lg:me-0 max-md:mt-4 max-md:text-base max-md:leading-snug">
          {t("blogPage.description")}
        </p>

        {/* Phones: Card Snap Carousel, like the home page (see
            .mobile-carousel--snap in index.css). */}
        <div className="mobile-carousel mobile-carousel--snap mt-[51px] grid grid-cols-[repeat(3,416px)] gap-x-[47px] gap-y-12 max-lg:grid-cols-2 max-lg:gap-x-8 max-md:mt-8 max-md:gap-3 max-md:py-4">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
