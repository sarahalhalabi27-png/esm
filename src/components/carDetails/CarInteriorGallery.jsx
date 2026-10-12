import { useCallback, useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Armchair, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import gsap from "gsap";
import CarSectionHeading from "./CarSectionHeading.jsx";
import InteriorLightbox from "./InteriorLightbox.jsx";
import useSectionReveal, {
  CAR_DETAILS_INTRO,
  slideInFromStart,
} from "./useSectionReveal.js";
import interiorIcon from "../../assets/car-details/car-interior.svg";

// Reveal: the title slides in like the ones above, then the photos open one
// after another like a curtain — each wiped in from the start side while
// rising a little.
function buildGalleryReveal({ root: section, tl, direction }) {
  const heading = section.querySelector("h2");
  const tiles = [...section.querySelectorAll("[data-tile]")];
  const clipped = direction < 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";

  gsap.set([heading, ...tiles], { autoAlpha: 0 });

  slideInFromStart(tl, heading, direction).fromTo(
    tiles,
    { autoAlpha: 1, clipPath: clipped, y: 16 },
    {
      clipPath: "inset(0 0% 0 0%)",
      y: 0,
      duration: 0.9,
      ease: "power2.inOut",
      stagger: 0.1,
      // Hand transform back to CSS so the hover lift works.
      clearProps: "clipPath,transform",
    },
    "-=0.4"
  );
}

// Same title style as the sections above ("Car Interior", icon 35 x 40.6),
// 100px under the features line; five 230 x 135 interior photos in a row
// 35px under the title, the first starting right under the word "Car"
// (icon 35 + 13px gap = 48px in), spread to the end of the line.
// Empty slots (no photo yet) show a quiet placeholder. Photos lift and
// brighten a little on hover, and open full size in InteriorLightbox.
export default function CarInteriorGallery({ car }) {
  const { t, i18n } = useTranslation();
  const sectionRef = useSectionReveal(buildGalleryReveal, {
    key: car.id,
    waitOnLoad: CAR_DETAILS_INTRO.interior,
  });
  const [openPhoto, setOpenPhoto] = useState(null);
  const images = car.interiorImages ?? [];

  // Tablets: arrows over the swipeable row, each shown only while there is
  // more to scroll to on that side (scrollLeft is negative in Arabic, so the
  // distance travelled is read as an absolute value).
  const rowRef = useRef(null);
  const [canScroll, setCanScroll] = useState({ start: false, end: false });
  const updateArrows = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const travelled = Math.abs(row.scrollLeft);
    const max = row.scrollWidth - row.clientWidth;
    setCanScroll({ start: travelled > 2, end: travelled < max - 2 });
  }, []);
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return undefined;
    // Switching language flips the scroll direction without a scroll event,
    // so measure again once the new direction has laid out.
    updateArrows();
    const timer = setTimeout(updateArrows, 100);
    const observer = new ResizeObserver(updateArrows);
    observer.observe(row);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [updateArrows, images.length, i18n.language]);
  const scrollRow = (towardEnd) => {
    const row = rowRef.current;
    if (!row) return;
    const rtl = getComputedStyle(row).direction === "rtl";
    const step = row.clientWidth * 0.8;
    row.scrollBy({
      left: (towardEnd ? 1 : -1) * (rtl ? -1 : 1) * step,
      behavior: "smooth",
    });
  };

  if (!images.length) return null;
  // The viewer steps through the real photos only (not empty slots).
  const photos = images.filter(Boolean);

  return (
    <section
      ref={sectionRef}
      className="font-display px-6 md:px-10 lg:px-[50px] mt-[100px] max-md:mt-12"
    >
      <CarSectionHeading
        iconSrc={interiorIcon}
        iconClassName="w-[35px] h-[40.63px] max-md:w-[26px] max-md:h-[30px]"
        className="gap-[13px] text-[25px] max-md:text-[19px] max-md:gap-2.5 max-md:leading-snug"
      >
        <Trans
          i18nKey="carDetails.interiorTitle"
          components={{ accent: <span className="text-teal-accent" /> }}
        />
      </CarSectionHeading>

      {/* Phones and tablets: a swipeable row instead of five squeezed columns
          (on tablets it starts at the page gutter and runs off the end edge, so
          the next photo peeks in) */}
      <div className="relative mt-[35px]">
        <div
          ref={rowRef}
          onScroll={updateArrows}
          className="ps-[48px] grid grid-cols-[repeat(5,minmax(0,230px))] justify-between gap-x-6 max-md:ps-0 max-md:flex max-md:gap-3 max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:-me-6 max-md:pe-6 md:max-xl:ps-0 md:max-xl:flex md:max-xl:justify-start md:max-xl:gap-4 md:max-xl:overflow-x-auto md:max-xl:snap-x md:max-xl:snap-mandatory md:max-xl:-me-10 md:max-xl:pe-10 lg:max-xl:-me-[50px] lg:max-xl:pe-[50px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => {
            const Tile = image ? "button" : "div";
            return (
              // The Figma photos come with their rounded corners and thin frame
              // baked in; only an empty slot draws its own.
              <Tile
                key={index}
                data-tile
                {...(image
                  ? {
                      type: "button",
                      // Its place among the real photos (by position, not source:
                      // tiles may share an image).
                      onClick: () =>
                        setOpenPhoto(
                          images.slice(0, index).filter(Boolean).length
                        ),
                      "aria-label": t("carDetails.gallery.open", {
                        index: index + 1,
                      }),
                    }
                  : {})}
                className={`h-[135px] flex items-center justify-center transition-transform duration-300 ease-out hover:-translate-y-1 md:max-xl:shrink-0 md:max-xl:w-[clamp(230px,calc((100vw_-_72px)_/_2.5),300px)] lg:max-xl:w-[clamp(230px,calc((100vw_-_82px)_/_2.5),300px)] md:max-xl:h-auto md:max-xl:aspect-[230/135] md:max-xl:snap-start max-md:shrink-0 max-md:w-[60vw] max-md:max-w-[230px] max-md:h-auto max-md:aspect-[230/135] max-md:snap-start ${
                  image
                    ? "group relative cursor-zoom-in rounded-[8px] outline-none focus-visible:ring-2 focus-visible:ring-teal-accent"
                    : "rounded-[8px] border border-line/15 bg-gradient-to-br from-fg/[0.06] to-fg/[0.02]"
                }`}
              >
                {image ? (
                  <img
                    src={image}
                    alt={t("carDetails.interiorAlt", {
                      car: car.name,
                      index: index + 1,
                    })}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Armchair
                    size={30}
                    strokeWidth={1.2}
                    className="text-fg/25"
                    aria-hidden="true"
                  />
                )}
                {image && (
                  <>
                    {/* Pointer devices: on hover/focus the photo dims and a
                      zoom badge rises in its centre. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center rounded-[8px] bg-black/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:hidden"
                    >
                      <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white/15 border border-white/40 text-white backdrop-blur-sm scale-75 transition-transform duration-300 ease-out group-hover:scale-100 group-focus-visible:scale-100">
                        <ZoomIn size={20} strokeWidth={1.75} />
                      </span>
                    </span>
                    {/* Touch devices (no hover): a small zoom badge that's
                      always there. */}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-2 end-2 hidden items-center justify-center w-7 h-7 rounded-full bg-black/45 border border-white/30 text-white [@media(hover:none)]:flex"
                    >
                      <ZoomIn size={14} strokeWidth={2} />
                    </span>
                  </>
                )}
              </Tile>
            );
          })}
        </div>

        {/* Phones and tablets (max-xl:flex): arrows that scroll the row, so it is
            clear there is more. Each hides when that side is already reached. */}
        {canScroll.start && (
          <button
            type="button"
            onClick={() => scrollRow(false)}
            aria-label={t("carDetails.gallery.previous")}
            className="hidden max-xl:flex absolute top-1/2 -translate-y-1/2 start-2 z-10 w-10 h-10 items-center justify-center rounded-full bg-black/55 border border-white/35 text-white backdrop-blur-sm transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent"
          >
            <ChevronLeft
              size={20}
              strokeWidth={2}
              className="rtl:-scale-x-100"
              aria-hidden="true"
            />
          </button>
        )}
        {canScroll.end && (
          <button
            type="button"
            onClick={() => scrollRow(true)}
            aria-label={t("carDetails.gallery.next")}
            className="hidden max-xl:flex absolute top-1/2 -translate-y-1/2 end-2 z-10 w-10 h-10 items-center justify-center rounded-full bg-black/55 border border-white/35 text-white backdrop-blur-sm transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent"
          >
            <ChevronRight
              size={20}
              strokeWidth={2}
              className="rtl:-scale-x-100"
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {openPhoto !== null && (
        <InteriorLightbox
          images={photos}
          index={openPhoto}
          onIndexChange={setOpenPhoto}
          onClose={() => setOpenPhoto(null)}
          carName={car.name}
        />
      )}
    </section>
  );
}
