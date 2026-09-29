import { useTranslation } from "react-i18next";
import CheckListItem from "../common/CheckListItem.jsx";
import highlightWords from "../../utils/highlightWords.jsx";
import useLocalizedPost from "./useLocalizedPost.js";

// Blog post body (Figma, 1440 frame): the sections from 96px in to the 50px
// gutter — each heading Semibold 22px with its accent words teal, the body
// 16px on 27px lines 28px under it, 110px between sections — then the eight
// services with check marks in four columns (two rows, 55px apart).
export default function BlogPostContent({ post }) {
  const { t } = useTranslation();
  const { sections } = useLocalizedPost(post);
  const services = t("home.trust.items", { returnObjects: true });

  return (
    <section className="font-display mt-[132px] ps-[96px] pe-[50px] max-md:mt-14 max-md:px-6">
      <div className="flex flex-col gap-[110px] max-md:gap-12">
        {sections.map((section) => (
          <article key={section.heading}>
            <h2 className="text-[22px] font-semibold leading-[30px] capitalize text-fg max-md:text-lg max-md:leading-snug">
              {highlightWords(
                section.heading,
                section.accents,
                "text-teal-accent"
              )}
            </h2>
            <p className="mt-[28px] text-[16px] leading-[27px] capitalize text-fg/90 max-md:mt-3 max-md:text-[15px] max-md:leading-[25px]">
              {section.body}
            </p>
          </article>
        ))}
      </div>

      <ul className="mt-[168px] -ms-[49px] grid grid-cols-[363px_325px_359px_1fr] gap-y-[55px] max-lg:grid-cols-2 max-lg:gap-x-8 max-md:ms-0 max-md:mt-14 max-md:grid-cols-1 max-md:gap-y-4">
        {Array.isArray(services) &&
          services.map((item) => (
            <li key={item}>
              <CheckListItem className="!text-[18px] !leading-[22px] max-md:!text-base">
                {item}
              </CheckListItem>
            </li>
          ))}
      </ul>
    </section>
  );
}
