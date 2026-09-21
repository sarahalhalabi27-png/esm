import CarLineArtIllustration from "../common/CarLineArtIllustration.jsx";

export default function ServiceTimelineCard({ service, flip = false }) {
  return (
    <div
      className={`rounded-2xl border border-line/10 bg-surface/[0.02] p-6 flex items-center gap-5 ${flip ? "sm:mt-10" : ""}`}
    >
      <CarLineArtIllustration className="w-28 h-16 shrink-0" flip={flip} />
      <div>
        <p className="font-medium text-sm mb-1">{service.title}</p>
        <p className="text-xs text-muted">{service.description}</p>
      </div>
    </div>
  );
}
