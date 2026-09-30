import { useTranslation } from "react-i18next";

// One pillar on the About timeline: a ringed dot on the line plus its text on
// one side (`side` = "start" | "end" of the line) on md+.
// Figma (1440): ring 66 / dot 21 (same as the Services connector), text
// starts 11px past the ring (title left 764 = line 720 + 44), title 22px
// medium centred on the dot, description 20px regular 13px below it (max
// 647 wide), and dots 232px apart (166px gap + 66px ring).
// data-timeline-* hooks drive the reveal in CompanyTimeline (data-from = the
// side the text slides in from, toward the line).
export default function CompanyTimelineItem({ item, side, isLast }) {
  const { t } = useTranslation();
  const text = (from) => (
    <div
      data-timeline-text
      data-from={from}
      className="pt-[20px] max-w-[647px] max-md:pt-[9px]"
    >
      <h3 className="text-[22px] font-medium leading-[27px] capitalize text-teal-accent max-md:text-lg max-md:leading-[28px]">
        {t(`aboutPage.pillars.${item.id}.title`)}
      </h3>
      <p className="mt-[13px] text-[20px] font-normal leading-[24px] capitalize text-fg max-md:mt-2 max-md:text-[15px] max-md:leading-snug">
        {t(`aboutPage.pillars.${item.id}.description`)}
      </p>
    </div>
  );

  return (
    <div
      data-timeline-row
      className={`grid grid-cols-[1fr_66px_1fr] gap-x-[11px] max-md:grid-cols-[46px_1fr] max-md:gap-x-4 ${
        isLast ? "" : "min-h-[232px] max-md:min-h-0 max-md:pb-10"
      }`}
    >
      {/* Start side (md+): only when this item sits before the line */}
      <div className="flex justify-end text-end max-md:hidden">
        {side === "start" ? text("start") : null}
      </div>

      {/* Dot on the line */}
      <div
        data-timeline-dot
        className="relative w-[66px] h-[66px] rounded-full grid place-items-center max-md:w-[46px] max-md:h-[46px]"
        style={{ background: "#24B9A530" }}
      >
        <span
          className="w-[21px] h-[21px] rounded-full max-md:w-[15px] max-md:h-[15px]"
          style={{ background: "rgb(var(--accent))" }}
        />
      </div>

      {/* End side (md+) — and every item on phones */}
      <div className="text-start">
        <div className={side === "end" ? "" : "md:hidden"}>{text("end")}</div>
      </div>
    </div>
  );
}
