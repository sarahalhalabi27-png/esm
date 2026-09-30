import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Armchair, ZoomIn } from "lucide-react";
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
  const { t } = useTranslation();
  const sectionRef = useSectionReveal(buildGalleryReveal, {
    key: car.id,
    waitOnLoad: CAR_DETAILS_INTRO.interior,
  });
  const [openPhoto, setOpenPhoto] = useState(null);
  const images = car.interiorImages ?? [];
  if (!images.length) return null;
  // The viewer steps through the real photos only (not empty slots).
  const photos = images.filter(Boolean);

  return (
    <section
      ref={sectionRef}
      className="font-display px-[50px] mt-[100px] max-md:px-6 max-md:mt-12"
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

      {/* Phones: a swipeable row instead of five squeezed columns */}
      <div className="mt-[35px] ps-[48px] grid grid-cols-[repeat(5,minmax(0,230px))] justify-between gap-x-6 max-md:ps-0 max-md:flex max-md:gap-3 max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:-me-6 max-md:pe-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
              className={`h-[135px] flex items-center justify-center transition-transform duration-300 ease-out hover:-translate-y-1 max-md:shrink-0 max-md:w-[60vw] max-md:max-w-[230px] max-md:h-auto max-md:aspect-[230/135] max-md:snap-start ${
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
