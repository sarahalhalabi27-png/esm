import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MaskIcon from "../common/MaskIcon.jsx";
import calendarIcon from "../../assets/blog/calender.svg";
import placeholderImage from "../../assets/blog/car-news.webp";

// Formats an ISO date (YYYY-MM-DD) for the current language, e.g.
// "Jan 22, 2025" in English. Parsed as a local date so it never shifts a day.
function formatPostDate(isoDate, language) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat(language === "ar" ? "ar" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export default function BlogPostCard({ post }) {
  const { t, i18n } = useTranslation();
  const { title, excerpt } = {
    title: post.title,
    excerpt: post.excerpt,
    ...post.translations?.[i18n.language],
  };

  return (
    <Link
      to={`/blog/${post.id}`}
      aria-label={t("blogPage.readPost", { title })}
      className="group flex flex-col w-full max-w-[416px] mx-auto max-md:w-[var(--snap-card-w)] max-md:mx-0 rounded-[15px] bg-page [[data-theme=light]_&]:bg-[#24B9A5]/[0.08] font-display shadow-[0_0_0_0.5px_rgba(255,255,255,0.4)] [[data-theme=light]_&]:shadow-[0_0_0_0.5px_rgba(7,46,42,0.2),0_10px_30px_rgba(7,46,42,0.08)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgb(var(--accent))] [[data-theme=light]_&]:hover:shadow-[0_0_0_1px_#072E2A,0_16px_40px_rgba(7,46,42,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent"
    >
      <div className="overflow-hidden rounded-[15px] aspect-[416/372] bg-black">
        <img
          src={post.image || placeholderImage}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-col flex-1 ps-6 pe-[7px] pt-6 pb-9 max-md:pe-5 max-md:pb-7">
        <p className="flex items-center gap-[9px] h-[18px] text-[15px] leading-[18px] capitalize text-fg/55 [[data-theme=light]_&]:text-[#4B5563]">
          <MaskIcon
            src={calendarIcon}
            className="w-[15px] h-4"
            colorClassName="bg-fg/55 [[data-theme=light]_&]:bg-[#1F2937]"
          />
          <time dateTime={post.date}>
            {formatPostDate(post.date, i18n.language)}
          </time>
        </p>

        <div className="mt-[18px] ms-[2px] w-[365px] max-w-[calc(100%-20px)] border-t-[0.5px] border-white [[data-theme=light]_&]:border-[#4B5563]" />

        <h3 className="mt-[27px] whitespace-pre-line text-[18px] font-normal leading-[22px] capitalize text-fg [[data-theme=light]_&]:text-[#072E2A] max-md:mt-5 max-md:text-[17px]">
          {title}
        </h3>

        <p className="mt-[27px] text-[15px] font-normal leading-[18px] capitalize text-fg/55 [[data-theme=light]_&]:text-[#4B5563] max-md:mt-4 max-md:text-[14px]">
          {excerpt} . .{" "}
          <span className="text-teal-accent [[data-theme=light]_&]:font-medium group-hover:underline underline-offset-2">
            {t("blogPage.learnMore")}
          </span>
        </p>
      </div>
    </Link>
  );
}
