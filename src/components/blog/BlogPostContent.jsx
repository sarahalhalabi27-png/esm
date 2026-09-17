import CheckListItem from "../common/CheckListItem.jsx";
import { trustHighlights } from "../../data/trustHighlightsData.js";

export default function BlogPostContent({ post }) {
  return (
    <section className="border-b border-white/5">
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        {post.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="text-lg font-medium text-teal-accent mb-3">
              {section.heading}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              {section.body}
            </p>
          </div>
        ))}
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3 pt-4">
          {trustHighlights.map((item) => (
            <CheckListItem key={item}>{item}</CheckListItem>
          ))}
        </div>
      </div>
    </section>
  );
}
