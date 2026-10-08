import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

// One question: a card whose header opens and closes the answer (the answer's
// height animates through a grid row going 0fr -> 1fr).
function FaqItem({ question, answer, open, onToggle }) {
  const id = useId();

  return (
    <div
      className={`rounded-[15px] border-[0.5px] light:border-[1px] bg-[#24B9A5]/10 transition-colors duration-300 light:bg-[#24B9A5]/[0.08] ${
        open
          ? "border-teal-accent"
          : "border-white/40 light:border-[#072E2A]/45"
      }`}
    >
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          className="flex w-full items-center justify-between gap-6 px-8 py-6 text-start text-[22px] font-semibold leading-[27px] capitalize text-fg max-md:px-5 max-md:py-5 max-md:text-[17px] max-md:leading-snug"
        >
          {question}
          <ChevronDown
            size={24}
            strokeWidth={1.5}
            aria-hidden="true"
            className={`shrink-0 text-teal-accent transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-8 pb-7 text-[20px] font-medium leading-[135%] text-fg/85 max-md:px-5 max-md:pb-5 max-md:text-[16px] max-md:leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

// The FAQ: a stack of question cards, one open at a time.
export default function FaqList({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col gap-5">
      {items.map((item, index) => (
        <FaqItem
          key={item.q}
          question={item.q}
          answer={item.a}
          open={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
        />
      ))}
    </div>
  );
}
