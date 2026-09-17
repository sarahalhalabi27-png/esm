import CompanyTimelineItem from "./CompanyTimelineItem.jsx";
import { companyTimeline } from "../../data/aboutTimelineData.js";

export default function CompanyTimeline() {
  return (
    <section className="border-t border-white/5">
      <div className="max-w-content mx-auto px-6 py-16">
        {companyTimeline.map((item, index) => (
          <CompanyTimelineItem
            key={item.id}
            item={item}
            isLast={index === companyTimeline.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
