import { useTranslation } from "react-i18next";
import gsap from "gsap";
import CheckListItem from "../common/CheckListItem.jsx";
import highlightWords from "../../utils/highlightWords.jsx";
import useLocalizedPost from "./useLocalizedPost.js";
import useSectionReveal, {
  slideInFromStart,
} from "../carDetails/useSectionReveal.js";

// Blog post body (Figma, 1440 frame): the sections from 96px in to the 50px
// gutter — each heading Semibold 25px with its accent words teal, the body
// Medium 20px on 135% lines 28px under it, 102px between sections — then the eight
// services with check marks in four columns (two rows, 30px apart; 40px
// between columns), 145px under the last section.
// Row order of the services grid (Figma), as indexes into the shared
// home.trust.items list: airport, city tours, VIP, support / corporate, safe,
// weddings, premium.
const SERVICE_ORDER = [0, 1, 4, 5, 2, 3, 6, 7];

// Reveal (each section as it scrolls into view): the heading slides in from
// the start side, then the text rises in under it.
function buildArticleReveal({ root, tl, direction }) {
  const heading = root.querySelector("h2");
  const body = root.querySelector("p");

  gsap.set([heading, body], { autoAlpha: 0 });

  slideInFromStart(tl, heading, direction).fromTo(
    body,
    { autoAlpha: 0, y: 18 },
    { autoAlpha: 1, y: 0, duration: 0.8, clearProps: "transform" },
    "-=0.5"
  );
}

// Reveal: the services rise in row by row (the items of a row a beat apart),
// each check mark popping in with a small overshoot.
function buildServicesReveal({ root, tl }) {
  const items = [...root.children];
  const checks = items.map((item) => item.querySelector("span > :first-child"));
  const columns = getComputedStyle(root).gridTemplateColumns.split(" ").length;
  // Narrow layouts (2 columns) have four rows, so each row gets a longer
  // beat to read as "line by line"; the 4-column desktop keeps its pace.
  const rowStep = columns <= 2 ? 0.55 : 0.3;
  const delayOf = (index) =>
    Math.floor(index / columns) * rowStep +
    (index % columns) * (columns <= 2 ? 0.12 : 0.08);

  gsap.set(items, { autoAlpha: 0 });

  tl.fromTo(
    items,
    { autoAlpha: 0, y: 24 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      delay: delayOf,
      clearProps: "transform",
    },
    0
  ).fromTo(
    checks,
    { scale: 0 },
    {
      scale: 1,
      duration: 0.5,
      ease: "back.out(2.2)",
      delay: (index) => delayOf(index) + 0.25,
      clearProps: "transform",
    },
    0
  );
}

function BlogArticle({ section, postId }) {
  const ref = useSectionReveal(buildArticleReveal, {
    key: postId,
    replay: true,
  });
  return (
    <article ref={ref}>
      <h2 className="text-[25px] font-semibold leading-[100%] capitalize text-fg max-md:text-lg max-md:leading-snug">
        {highlightWords(section.heading, section.accents, "text-teal-accent")}
      </h2>
      <p className="mt-[28px] text-[20px] font-medium leading-[135%] capitalize text-fg/90 max-md:mt-3 max-md:text-[15px] max-md:leading-[25px]">
        {section.body}
      </p>
    </article>
  );
}

export default function BlogPostContent({ post }) {
  const { t } = useTranslation();
  const { sections } = useLocalizedPost(post);
  const items = t("home.trust.items", { returnObjects: true });
  const servicesRef = useSectionReveal(buildServicesReveal, {
    key: post.id,
    replay: true,
  });
  const services = Array.isArray(items)
    ? SERVICE_ORDER.map((index) => items[index]).filter(Boolean)
    : [];

  return (
    <section className="font-display mt-[132px] ps-[96px] pe-[50px] max-md:mt-14 max-md:px-6">
      <div className="flex flex-col gap-[102px] max-md:gap-12">
        {sections.map((section) => (
          <BlogArticle
            key={section.heading}
            section={section}
            postId={post.id}
          />
        ))}
      </div>

      <ul
        ref={servicesRef}
        className="mt-[145px] -ms-[49px] grid grid-cols-[repeat(4,max-content)] gap-x-[40px] gap-y-[30px] max-lg:grid-cols-2 max-lg:gap-x-8 max-md:ms-0 max-md:mt-14 max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-5"
      >
        {services.map((item) => (
          <li key={item}>
            <CheckListItem className="!gap-[5px] !text-[20px] max-md:!text-[14px] max-md:!gap-2">
              {item}
            </CheckListItem>
          </li>
        ))}
      </ul>
    </section>
  );
}
