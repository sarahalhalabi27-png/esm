import { useTranslation } from "react-i18next";
import carIcon from "../../assets/car.svg";

const popularTypes = [
  { id: "mercedes-1", brand: "Mercedes", count: "15" },
  { id: "mercedes-2", brand: "Mercedes", count: "15" },
  { id: "mercedes-3", brand: "Mercedes", count: "15" },
  { id: "mercedes-4", brand: "Mercedes", count: "15" },
];

export default function PopularCarTypes() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <section
      className="font-display"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-content mx-auto px-6 py-20 max-md:py-12">

        {/* Section Title */}
        <h2
          className="
            w-full
            max-w-[367px]
            mx-auto
            text-center
            text-[25px]
            font-semibold
            leading-[100%]
            tracking-[0%]
            capitalize
            text-teal-accent
            max-md:text-[22px]
          "
        >
          {t("home.popular.heading")}
        </h2>

        {/* Description */}
        <p
          className="
            w-full
            max-w-[828px]
            min-h-[30px]
            mx-auto
            mt-[27px]
            text-center
            text-[25px]
            font-medium
            leading-[100%]
            tracking-[0%]
            capitalize
            text-fg
            max-md:mt-4
            max-md:text-lg
            max-md:leading-snug
          "
        >
          {t("home.popular.description")}
        </p>

        {/* Car Types */}
        {/* Phones: Scroll Shelf (see .mobile-carousel--shelf in index.css). */}
        <div className="mobile-carousel mobile-carousel--shelf flex flex-wrap justify-center gap-[40px] mt-[45px] max-md:gap-4 max-md:mt-8">
          {popularTypes.map((type) => (
            <div
              key={type.id}
              className="
                relative
                w-[257px]
                h-[172px]
                max-md:w-[58vw]
                max-md:max-w-[240px]
                rounded-[10px]
                flex
                flex-col
                items-center
                pt-[26px]
              "
            >
              {/* 1px accent gradient border (bright teal in dark mode,
                  #072E2A in light mode) */}
              <div
                className="absolute inset-0 rounded-[10px] pointer-events-none"
                style={{
                  padding: "1px",
                  background:
                    "linear-gradient(360deg, rgb(var(--accent) / 0.8) 0%, rgb(var(--accent) / 0) 100%)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />

              {/* Car icon painted with the theme accent through the SVG as a
                  mask, so it follows light/dark like the text around it. */}
              <span
                aria-hidden="true"
                className="block w-[50px] h-[50px]"
                style={{
                  WebkitMaskImage: `url(${carIcon})`,
                  maskImage: `url(${carIcon})`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  background: "rgb(var(--accent))",
                }}
              />

              <p
                className="
                  mt-[16px]
                  w-[98.68px]
                  h-[31.77px]
                  text-[22px]
                  font-medium
                  leading-[100%]
                  capitalize
                  text-fg/[0.83]
                  text-center
                "
              >
                {type.brand}
              </p>

              <p
                className="
                  mt-[4px]
                  text-[20px]
                  font-medium
                  leading-[100%]
                  capitalize
                  text-teal-accent
                "
              >
                {type.count}{" "}
                <span className="text-fg">
                  {t("common.car")}
                </span>
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}