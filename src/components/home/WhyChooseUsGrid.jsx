import { Check } from "lucide-react";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import { whyChooseUsItems } from "../../data/whyChooseUsData.js";

export default function WhyChooseUsGrid() {
  return (
    <section className="border-t border-white/5 bg-white/[0.015] font-display ">
      <div className="max-w-content mx-auto px-6 py-20">
        <SectionEyebrow>Why Choose ESM?</SectionEyebrow>
        <div className="grid sm:grid-cols-2 gap-x-16 gap-y-6 mt-8 max-w-3xl">
          {whyChooseUsItems.map((item) => (
            <div key={item.title} className="flex gap-3">
              <Check size={18} className="mt-0.5 shrink-0 text-teal-accent" />
              <div>
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
