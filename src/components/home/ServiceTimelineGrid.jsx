import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import { limoServices } from "../../data/servicesData.js";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

function PositionedService({ service }) {
  const { t, i18n } = useTranslation();
  const { layout } = service;

  const isRTL = i18n.dir() === "rtl";

  const title = t(`home.services.items.${service.id}.title`);
  const description = t(`home.services.items.${service.id}.description`);

  return (
    <>
      <img
        src={service.illustration}
        alt={title}
        className="dark-only absolute object-contain"
        style={{
          top: layout.image.top,
          left: layout.image.left,
          width: layout.image.width,
          height: layout.image.height,
        }}
      />

      <div
        role="img"
        aria-label={title}
        className="light-only absolute"
        style={{
          top: layout.image.top,
          left: layout.image.left,
          width: layout.image.width,
          height: layout.image.height,
          WebkitMaskImage: `url(${service.illustration})`,
          maskImage: `url(${service.illustration})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          background: "rgb(var(--muted))",
        }}
      />

      {/* Title + Description */}
      <div
  dir={isRTL ? "rtl" : "ltr"}
  className="absolute text-center"
  style={{
    top: layout.title.top,
    left: layout.title.left,
    width: 300,
  }}
>
  <p
    className="font-semibold capitalize text-fg"
    style={{
      margin: 0,
      height: 30,
      fontSize: 25,
      lineHeight: "30px",
      fontWeight: 600,
      whiteSpace: "nowrap",
    }}
  >
    {title}
  </p>

  <p
    className="font-normal capitalize text-fg"
    style={{
      margin: "12px 0 0",
      fontSize: 25,
      lineHeight: "30px",
      fontWeight: 400,
      whiteSpace: "nowrap",
    }}
  >
    {description}
  </p>
</div>
    </>
  );
}

// Decorative teal connector — curved line + glow dot linking the four
// illustrations. Coordinates are section-relative (Figma 1440 frame).
const CONNECTOR = {
  glow: { size: 311 },
  line: { top: 480.35, left: 341.85, width: 746.65, height: 911.2 },
  ring: { size: 66 },
  dot: { size: 21 },
};

// Below xl: the same connector + traveler, scaled to the phone layout.
const MOBILE_CONNECTOR = {
  glow: { size: 250, blur: 70 },
  ring: { size: 46 },
  dot: { size: 15 },
};

// The desktop connector's three curves, each expressed relative to its own
// endpoints (A → B, dx/dy = B − A), read off the Figma path above. Reusing
// them keeps the mobile line the same shape: out sideways from the first
// illustration, sweeping back and forth through each illustration in turn.
//   c1 = A + (c1x·dx, c1y·dy),  c2 = B + (c2x·dx, c2y·dy)
const CONNECTOR_CURVES = [
  { c1x: 0.633, c1y: 0.12, c2x: 0.034, c2y: -0.715 }, // first: A → B
  { c1x: 0.045, c1y: 0.936, c2x: -0.06, c2y: -0.8 }, // middle curves
  { c1x: -0.054, c1y: 0.747, c2x: -0.565, c2y: 0.31 }, // last
];

// Builds the mobile connector through every illustration
// (marked data-connector-point), in the list's own pixel space.
function buildMobileConnectorPath(listEl) {
  const box = listEl.getBoundingClientRect();
  const points = [...listEl.querySelectorAll("[data-connector-point]")].map((el) => {
    const r = el.getBoundingClientRect();
    // Lower part of the illustration, like desktop — keeps the sweep
    // under the neighbouring title/description instead of through it.
    return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height * 0.78 };
  });
  if (points.length < 2) return null;

  const round = (n) => Math.round(n * 10) / 10;
  let d = `M${round(points[0].x)} ${round(points[0].y)}`;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const curve =
      i === 1 ? CONNECTOR_CURVES[0] : i === points.length - 1 ? CONNECTOR_CURVES[2] : CONNECTOR_CURVES[1];
    d += ` C${round(a.x + curve.c1x * dx)} ${round(a.y + curve.c1y * dy)} ${round(b.x + curve.c2x * dx)} ${round(b.y + curve.c2y * dy)} ${round(b.x)} ${round(b.y)}`;
  }
  return { d, width: box.width, height: box.height };
}

// Glow + ring + dot that rides a connector path on scroll (both themes).
function ConnectorTraveler({ travelerRef, glow, ring, dot, className = "" }) {
  return (
    <div
      ref={travelerRef}
      className={`absolute top-0 left-0 pointer-events-none ${className}`}
      style={{ width: glow.size, height: glow.size }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(36,185,165,0.65) 0%, rgba(36,185,165,0.35) 35%, rgba(7,46,42,0.9) 60%, rgba(7,46,42,0) 78%)",
          filter: `blur(${glow.blur}px)`,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: ring.size,
          height: ring.size,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "#24B9A530",
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: dot.size,
            height: dot.size,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "#24B9A5",
          }}
        />
      </div>
    </div>
  );
}

export default function ServiceTimelineGrid() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const travelerRef = useRef(null);
  const mobileListRef = useRef(null);
  const mobilePathRef = useRef(null);
  const mobileTravelerRef = useRef(null);
  const positionedServices = limoServices.filter((service) => service.layout);

  // Grows automatically as more services get exact Figma coordinates, so the
  // section always fully contains its absolutely-positioned content and
  // never collapses into the next section below.
  const contentBottom = Math.max(
    0,
    ...positionedServices.flatMap((service) =>
      [service.layout.image, service.layout.title, service.layout.description].map(
        (box) => box.top + box.height,
      ),
    ),
  );
  const sectionMinHeight = contentBottom + 100;

  useEffect(() => {
    // Each layout animates its own visible connector: the desktop one is
    // display:none below xl, so animating only it did nothing on phones.
    const mm = gsap.matchMedia(sectionRef);

    // Desktop (unchanged): the traveler rides the Figma connector across the
    // whole section.
    mm.add("(min-width: 1280px)", () => {
      gsap.to(travelerRef.current, {
        motionPath: {
          path: pathRef.current,
          align: pathRef.current,
          alignOrigin: [0.5, 0.5],
          autoRotate: false,
        },
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });
    });

    // Below xl: the path is measured from the real layout (it runs through
    // each illustration's centre), so (re)build it — and the tween, which
    // snapshots the path — whenever the list's size changes (images loading,
    // rotation, font swap). The trigger tracks the list so the traveler
    // crosses the illustrations while they're on screen.
    mm.add("(max-width: 1279.98px)", () => {
      const listEl = mobileListRef.current;
      const pathEl = mobilePathRef.current;
      let tween;

      const build = () => {
        const connector = buildMobileConnectorPath(listEl);
        if (!connector) return;
        pathEl.ownerSVGElement.setAttribute(
          "viewBox",
          `0 0 ${connector.width} ${connector.height}`,
        );
        pathEl.setAttribute("d", connector.d);

        tween?.scrollTrigger?.kill();
        tween?.kill();
        tween = gsap.to(mobileTravelerRef.current, {
          motionPath: {
            path: pathEl,
            align: pathEl,
            alignOrigin: [0.5, 0.5],
            autoRotate: false,
          },
          ease: "none",
          scrollTrigger: {
            trigger: listEl,
            start: "top 65%",
            end: "bottom 55%",
            scrub: 1.5,
          },
        });
      };

      let buildTimer;
      const listObserver = new ResizeObserver(() => {
        clearTimeout(buildTimer);
        buildTimer = setTimeout(build, 100);
      });
      build();
      listObserver.observe(listEl);

      return () => {
        clearTimeout(buildTimer);
        listObserver.disconnect();
        tween?.scrollTrigger?.kill();
        tween?.kill();
      };
    });

    // Content above (fetched fleet cards, images) can finish loading after the
    // triggers were measured, leaving their start/end stale. Re-measure
    // whenever the page height changes (debounced).
    let refreshTimer;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    resizeObserver.observe(document.body);

    return () => {
      clearTimeout(refreshTimer);
      resizeObserver.disconnect();
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="font-display relative xl:min-h-[var(--svc-min)]"
      style={{ "--svc-min": `${sectionMinHeight}px` }}
    >
      <div className="max-w-content mx-auto px-6 py-20 max-md:pt-14 max-md:pb-0">
      <div className="text-center mb-14 max-md:mb-10">
  <SectionEyebrow className="max-md:text-[22px]">{t("home.services.eyebrow")}</SectionEyebrow>

  <p
    className="
      w-full
      max-w-[1350px]
      min-h-[72px]
      ms-[0px]
      mt-[30px]
      text-[22px]
      font-medium
      leading-[164%]
      tracking-[0%]
      text-center
      capitalize
      text-fg
      max-md:min-h-0
      max-md:mt-4
      max-md:text-base
      max-md:leading-relaxed
    "
  >
    {t("home.services.description")}
  </p>
</div>
      </div>

      {/* Below xl: the desktop zig-zag, condensed — illustration and text
          side by side, alternating sides per row. As on desktop, the connector
          sweeps through each illustration in turn and the glowing traveler
          rides it on scroll (path built in the effect above). */}
      <div className="xl:hidden max-w-content mx-auto px-6 pb-16">
        <div ref={mobileListRef} className="relative flex flex-col gap-14 md:gap-20">
          <svg
            className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
            fill="none"
            aria-hidden="true"
            style={{ filter: "blur(0.7px)" }}
          >
            <path ref={mobilePathRef} stroke="#24B9A5" strokeWidth="1.3" />
          </svg>

          {positionedServices.map((service, index) => {
            const flipped = index % 2 === 1;
            return (
              <div
                key={service.id}
                className="relative z-10 grid grid-cols-2 items-center gap-x-12 md:gap-x-24"
              >
                <div data-connector-point className={flipped ? "order-2" : ""}>
                  <img
                    src={service.illustration}
                    alt=""
                    className="dark-only w-full h-auto object-contain"
                  />
                  <div
                    role="img"
                    aria-label={t(`home.services.items.${service.id}.title`)}
                    className="light-only w-full aspect-[3/2]"
                    style={{
                      WebkitMaskImage: `url(${service.illustration})`,
                      maskImage: `url(${service.illustration})`,
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskPosition: "center",
                      background: "rgb(var(--muted))",
                    }}
                  />
                </div>
                <div className={flipped ? "order-1 text-end" : "text-start"}>
                  <h3 className="text-base sm:text-lg md:text-2xl font-semibold capitalize text-fg leading-snug">
                    {t(`home.services.items.${service.id}.title`)}
                  </h3>
                  <p className="mt-1.5 text-sm sm:text-base md:text-xl capitalize text-fg/85 leading-snug">
                    {t(`home.services.items.${service.id}.description`)}
                  </p>
                </div>
              </div>
            );
          })}

          <ConnectorTraveler
            travelerRef={mobileTravelerRef}
            glow={MOBILE_CONNECTOR.glow}
            ring={MOBILE_CONNECTOR.ring}
            dot={MOBILE_CONNECTOR.dot}
            className="z-20"
          />
        </div>
      </div>

      {/* Desktop: exact Figma-positioned layout with connector + traveler */}
      <div className="hidden xl:block">
        {/* Curved teal connector line — same in both themes */}
        <svg
          className="absolute pointer-events-none"
        style={{
          top: CONNECTOR.line.top,
          left: CONNECTOR.line.left,
          width: CONNECTOR.line.width,
          height: CONNECTOR.line.height,
        }}
        viewBox="0 0 753 918"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#serviceConnectorBlur)">
          <path
            ref={pathRef}
            d="M6.45312 6.44489C472.953 -16.5549 767.451 87.4453 742.951 290.445C709.332 569.006 50.0369 349.309 6.45312 587.945C-34.5488 812.445 330.451 981.445 749.951 888.445"
            stroke="#24B9A5"
          />
        </g>
        <defs>
          <filter
            id="serviceConnectorBlur"
            x="-0.000195265"
            y="-0.000195265"
            width="752.86"
            height="917.799"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="1.4" result="effect1_foregroundBlur_1640_262" />
          </filter>
        </defs>
      </svg>

      {/* Services positioned per exact Figma spec (section-relative) */}
      {positionedServices.map((service) => (
        <PositionedService key={service.id} service={service} />
      ))}

      {/* Traveler: glow + ring + dot, all animated together along the path on
          scroll — same in both themes */}
      <ConnectorTraveler
        travelerRef={travelerRef}
        glow={{ size: CONNECTOR.glow.size, blur: 140 }}
        ring={CONNECTOR.ring}
        dot={CONNECTOR.dot}
      />
      </div>
    </section>
  );
}
