import { useEffect, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import CarSectionHeading from "./CarSectionHeading.jsx";
import MaskIcon from "../common/MaskIcon.jsx";
import descriptionIcon from "../../assets/car-details/description.svg";
import featuresIcon from "../../assets/car-details/features.svg";
import wifiIcon from "../../assets/car-details/wifi.svg";
import fuelIcon from "../../assets/car-details/gas-station.svg";
import modelIcon from "../../assets/car-details/car-model.svg";
import passengersIcon from "../../assets/car-details/passengers.svg";
import luggageIcon from "../../assets/car-details/luggages.svg";
import climateIcon from "../../assets/car-details/climate.svg";
import electricIcon from "../../assets/car-details/electric.svg";

gsap.registerPlugin(ScrollTrigger, SplitText);

// The hero's intro (CarDetailsHero) settles the car ~1.6s after load; when
// the description is already on screen by then, it waits its turn.
const HERO_INTRO_S = 1.6;

// Description reveal, played once when the section scrolls into view (skipped
// when the viewer prefers reduced motion): the title slides in from the start
// side, the price badge pops up and counts its price up from zero, then the
// description rises in line by line.
function useDescriptionReveal(car, isRtl) {
  const rowRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const row = rowRef.current;
    const text = textRef.current;
    const mountedAt = performance.now();
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const [heading, badge] = row.children;
      const priceEl = badge.querySelector("[data-price]");
      const direction = isRtl ? -1 : 1;
      let split;

      // Fix the price's width at its final value so the badge's centred text
      // doesn't shift while the digits count up.
      priceEl.style.minWidth = `${priceEl.offsetWidth}px`;
      gsap.set([heading, badge, text], { autoAlpha: 0 });

      const price = { value: 0 };
      const tl = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .fromTo(
          heading,
          { autoAlpha: 0, x: -30 * direction },
          { autoAlpha: 1, x: 0, duration: 0.8 }
        )
        .fromTo(
          badge,
          { autoAlpha: 0, scale: 0.9, y: 10 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            ease: "back.out(1.6)",
          },
          "-=0.5"
        )
        .to(
          price,
          {
            value: car.pricePerHour,
            duration: 1.1,
            ease: "power2.out",
            onUpdate: () => {
              priceEl.textContent = price.value.toFixed(2);
            },
          },
          "<0.1"
        )
        // The description's lines are split only now (fonts are loaded by
        // then) and put back together once they're in.
        .add(() => {
          split = SplitText.create(text, { type: "lines", mask: "lines" });
          gsap.set(text, { autoAlpha: 1 });
          gsap.from(split.lines, {
            yPercent: 100,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            onComplete: () => split.revert(),
          });
        }, "-=0.9");

      ScrollTrigger.create({
        trigger: row,
        start: "top 85%",
        once: true,
        onEnter: () => {
          const sinceMount = (performance.now() - mountedAt) / 1000;
          tl.delay(Math.max(0, HERO_INTRO_S - sinceMount)).play();
        },
      });

      return () => {
        split?.revert();
        priceEl.style.minWidth = "";
        priceEl.textContent = car.pricePerHour.toFixed(2);
      };
    });

    return () => mm.revert();
  }, [car.id, car.pricePerHour, isRtl]);

  return { rowRef, textRef };
}

// Car Features reveal, played once when it scrolls into view (skipped when
// the viewer prefers reduced motion): the title slides in like the
// description's, then the features follow one after another — each icon
// wiped in from the start side (a "drawn" feel; the Figma icons are filled
// shapes, so a true stroke draw isn't possible) with its name sliding in.
function useFeaturesReveal(car, isRtl) {
  const blockRef = useRef(null);

  useEffect(() => {
    const block = blockRef.current;
    const mountedAt = performance.now();
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const heading = block.querySelector("h2");
      const items = [...block.querySelectorAll("li")];
      const icons = items.map((item) => item.querySelector("[data-icon]"));
      const direction = isRtl ? -1 : 1;
      // Hidden side of the wipe: the end side, so it opens from the start.
      const clipped = isRtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";

      gsap.set([heading, ...items], { autoAlpha: 0 });

      const tl = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .fromTo(
          heading,
          { autoAlpha: 0, x: -30 * direction },
          { autoAlpha: 1, x: 0, duration: 0.8 }
        )
        .fromTo(
          items,
          { autoAlpha: 0, x: -16 * direction },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.12,
            clearProps: "transform",
          },
          "-=0.4"
        )
        .fromTo(
          icons,
          { clipPath: clipped },
          {
            clipPath: "inset(0 0% 0 0%)",
            duration: 0.7,
            ease: "power2.inOut",
            stagger: 0.12,
            clearProps: "clipPath",
          },
          "<"
        );

      ScrollTrigger.create({
        trigger: block,
        start: "top 85%",
        once: true,
        onEnter: () => {
          // Already in view on load (a tall screen): let the hero and the
          // description go first.
          const sinceMount = (performance.now() - mountedAt) / 1000;
          tl.delay(Math.max(0, HERO_INTRO_S + 0.8 - sinceMount)).play();
        },
      });
    });

    return () => mm.revert();
  }, [car.id, isRtl]);

  return blockRef;
}

// Figma exports at their Figma sizes, centred on their label. Petrol and
// hybrid share the fuel pump; electric has its own charging-station icon
// (drawn to match, same box).
const fuel = {
  src: fuelIcon,
  className: "w-[23.97px] h-[29px]",
};
const featureIcons = {
  wifi: { src: wifiIcon, className: "w-[23.82px] h-[20.68px]" },
  petrol: fuel,
  hybrid: fuel,
  electric: {
    src: electricIcon,
    className: "w-[23.97px] h-[29px]",
  },
  model: { src: modelIcon, className: "w-[38px] h-[20.26px]" },
  passengers: {
    src: passengersIcon,
    className: "w-[31px] h-[22px]",
  },
  luggage: { src: luggageIcon, className: "w-[34px] h-[34px]" },
  climate: { src: climateIcon, className: "w-[29.28px] h-[32px]" },
};

// Resolves a car's feature keys into { key, label } — "fuel" becomes the
// car's own fuel type, counts/years are filled in from the car.
function useCarFeatures(car) {
  const { t } = useTranslation();
  return (car.features ?? []).map((feature) => {
    const key = feature === "fuel" ? car.fuel : feature;
    return {
      key,
      label: t(`carDetails.features.${key}`, {
        year: car.modelYear,
        count:
          key === "passengers"
            ? car.passengers
            : key === "luggage"
              ? car.luggage
              : undefined,
      }),
    };
  });
}

const accent = <span className="text-teal-accent" />;

// Figma (1440 frame), measured from the bottom of the hero's arc:
// - "Description About <car>" (icon 32 x 28 + 13px gap + 25px semibold title,
//   30px line) 88px below it, at the start (Figma: 124, tightened on review);
// - price button (289 x 50, radius 10) at the end of the line, centered on
//   the title (78px below the arc). The space between the two
//   (592px for Mercedes-Benz EQC) follows from the car name's length;
// - the description 25px under the title (15px under the button, which
//   reaches 10px lower than the title), indented to the title's text
//   (45px), 20px medium, 135% line height.
// Then "Car Features" (same title style, features icon 37.6 x 27.4), 100px
// under the description; the features row 25px under it, indented 37px:
// each feature its icon (own size, centred on the name, see featureIcons)
// + 12px + its name (20px), 65px between features: the row is
// capped at Figma's 1298.6px and spread across it, which gives ~65px at full
// width and lets the gaps give a little (instead of wrapping) when a desktop
// scrollbar eats into the 1440 frame.
export default function CarFeatureList({ car }) {
  const { t, i18n } = useTranslation();
  const features = useCarFeatures(car);
  const isRtl = i18n.dir() === "rtl";
  const { rowRef, textRef } = useDescriptionReveal(car, isRtl);
  const featuresRef = useFeaturesReveal(car, isRtl);

  return (
    <section className="font-display px-[50px] mt-[60px] max-md:px-6 max-md:mt-12">
      <div
        ref={rowRef}
        className="flex items-start justify-between gap-6 flex-wrap max-md:items-center max-md:gap-4"
      >
        <CarSectionHeading
          iconSrc={descriptionIcon}
          iconClassName="w-8 h-[28.17px] max-md:w-6 max-md:h-[21px]"
          className="mt-[40px] gap-[13px] text-[25px] max-md:mt-0 max-md:text-[19px] max-md:gap-2.5 max-md:leading-snug"
        >
          <Trans
            i18nKey="carDetails.descriptionTitle"
            values={{ car: car.name }}
            components={{ accent }}
          />
        </CarSectionHeading>

        {/* Price badge: teal with dark text; light mode #072E2A with white text */}
        {/* Text centered both ways whatever the price's length; the three
            parts share one line of text so they sit on a common baseline and
            the 20px space between them is kept (a lone-space flex item
            collapses). */}
        <p className="mt-[30px] flex items-center justify-center shrink-0 w-[289px] h-[50px] px-4 rounded-[10px] bg-[#24B9A5] text-[#072E2A] [[data-theme=light]_&]:bg-[#072E2A] [[data-theme=light]_&]:text-white leading-none capitalize whitespace-nowrap max-md:mt-0 max-md:w-auto max-md:h-10">
          <span>
            <span className="text-[25px] font-semibold text-black [[data-theme=light]_&]:text-white max-md:text-lg">
              {t("common.currency")}{" "}
              <span data-price className="inline-block text-start tabular-nums">
                {car.pricePerHour.toFixed(2)}
              </span>
            </span>
            <span className="text-[20px] font-normal max-md:text-[15px]">
              {" "}
            </span>
            <span className="text-[20px] font-normal text-[#072E2A]/70 [[data-theme=light]_&]:text-white/70 max-md:text-[15px]">
              /{t("common.perHour")}
            </span>
          </span>
        </p>
      </div>

      <p
        ref={textRef}
        className="mt-[25px] ps-[45px] text-[20px] font-medium leading-[135%] capitalize text-fg max-md:mt-5 max-md:ps-0 max-md:text-[15px] max-md:leading-[150%]"
      >
        {car.description || t("carDetails.description")}
      </p>

      <div ref={featuresRef} className="mt-[100px] max-md:mt-12">
        <CarSectionHeading
          iconSrc={featuresIcon}
          iconClassName="w-[37.6px] h-[27.42px] max-md:w-7 max-md:h-5"
          className="gap-[13px] text-[25px] max-md:text-[19px] max-md:gap-2.5 max-md:leading-snug"
        >
          <Trans i18nKey="carDetails.featuresTitle" components={{ accent }} />
        </CarSectionHeading>

        <ul className="mt-[25px] ms-[37px] max-w-[1298.64px] flex flex-wrap justify-between gap-x-10 gap-y-6 max-md:ms-0 max-md:mt-6 max-md:grid max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-5">
          {features.map(({ key, label }) => {
            const icon = featureIcons[key] ?? featureIcons.model;
            return (
              <li
                key={key}
                className="group flex items-center gap-[12px] h-[34px] text-[20px] leading-[34px] capitalize text-fg max-md:h-auto max-md:text-[15px] max-md:leading-snug max-md:gap-2"
              >
                {/* Lifts a little on hover */}
                <span data-icon className="flex">
                  <MaskIcon
                    src={icon.src}
                    className={`${icon.className} transition-transform duration-300 ease-out group-hover:-translate-y-1 max-md:scale-[0.8]`}
                  />
                </span>
                {label}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
