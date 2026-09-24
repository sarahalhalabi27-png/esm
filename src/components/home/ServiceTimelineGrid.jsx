import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import { limoServices } from "../../data/servicesData.js";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

function PositionedService({ service }) {
  const { layout } = service;
  return (
    <>
      {/* Dark mode: original white/gray line art, unchanged */}
      <img
        src={service.illustration}
        alt={service.title}
        className="dark-only absolute object-contain"
        style={{
          top: layout.image.top,
          left: layout.image.left,
          width: layout.image.width,
          height: layout.image.height,
        }}
      />
      {/* Light mode: same artwork recolored via mask so it's visible on a
          white background (the source SVGs are white/gray line art). */}
      <div
        role="img"
        aria-label={service.title}
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
      <p
        className="absolute font-semibold text-center capitalize text-fg"
        style={{
          top: layout.title.top,
          left: layout.title.left,
          width: layout.title.width,
          fontSize: 25,
          lineHeight: layout.title.lineHeight ?? "100%",
          letterSpacing: "0%",
          fontWeight: 600,
        }}
      >
        {service.title}
      </p>
      <p
        className="absolute font-normal capitalize text-fg"
        style={{
          top: layout.description.top,
          left: layout.description.left,
          width: layout.description.width,
          fontSize: 25,
          lineHeight: layout.description.lineHeight ?? "120%",
          letterSpacing: "0%",
          fontWeight: 400,
        }}
      >
        {service.description}
      </p>
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

export default function ServiceTimelineGrid() {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const travelerRef = useRef(null);
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
    const ctx = gsap.context(() => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="font-display relative"
      style={{ minHeight: sectionMinHeight }}
    >
      <div className="max-w-content mx-auto px-6 py-20">
      <div className="text-center mb-14">
  <SectionEyebrow>ESM Limo Services</SectionEyebrow>

  <p
    className="
      w-full
      max-w-[1350px]
      min-h-[72px]
      ml-[0px]
      mt-[30px]
      text-[22px]
      font-medium
      leading-[164%]
      tracking-[0%]
      text-center
      capitalize
      text-fg
    "
  >
    ESM Limo Offers Premium Transportation Solutions Tailored To Meet Your
    Every Need. From Luxury Rides To Professional Chauffeur Services, We
    Ensure A Seamless And Stylish Travel Experience Across The UAE.
  </p>
</div>
      </div>

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
      <div
        ref={travelerRef}
        className="absolute top-0 left-0 pointer-events-none"
        style={{ width: CONNECTOR.glow.size, height: CONNECTOR.glow.size }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(36,185,165,0.65) 0%, rgba(36,185,165,0.35) 35%, rgba(7,46,42,0.9) 60%, rgba(7,46,42,0) 78%)",
            filter: "blur(140px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: CONNECTOR.ring.size,
            height: CONNECTOR.ring.size,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "#24B9A530",
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: CONNECTOR.dot.size,
              height: CONNECTOR.dot.size,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              background: "#24B9A5",
            }}
          />
        </div>
      </div>
    </section>
  );
}
