export default function ServiceTimelineCard({ service, flip = false }) {
  const { layout } = service;

  return (
    <div className={`flex items-center gap-6 ${flip ? "sm:mt-10" : ""}`}>
      <img
        src={service.illustration}
        alt={service.title}
        className={layout ? "object-contain shrink-0" : "w-48 h-32 object-contain shrink-0"}
        style={layout ? { width: layout.width, height: layout.height } : undefined}
      />
      <div>
        <p className="font-semibold text-base mb-1 text-fg">{service.title}</p>
        <p className="text-sm text-muted">{service.description}</p>
      </div>
    </div>
  );
}
