export default function CompanyTimelineItem({ item, isLast }) {
  return (
    <div className="relative ps-10 pb-10">
      {!isLast ? (
        <span className="absolute left-[7px] top-3 bottom-0 w-px bg-white/15" />
      ) : null}
      <span className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-teal-accent bg-black" />
      <h3 className="text-sm font-medium text-teal-accent mb-1">
        {item.title}
      </h3>
      <p className="text-sm text-gray-400 max-w-xl">{item.description}</p>
    </div>
  );
}
