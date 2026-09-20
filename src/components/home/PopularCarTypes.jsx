import carIcon from "../../assets/car.svg";

const popularTypes = [
  { id: "mercedes-1", brand: "Mercedes", count: "15 Car" },
  { id: "mercedes-2", brand: "Mercedes", count: "15 Car" },
  { id: "mercedes-3", brand: "Mercedes", count: "15 Car" },
  { id: "mercedes-4", brand: "Mercedes", count: "15 Car" },
];

export default function PopularCarTypes() {
  return (
    <section className="font-display">
      <div className="max-w-content mx-auto px-6 py-20">

        {/* Section Title */}
        <h2
          className="
            w-[367px]
            h-[30px]
            mx-auto
            text-center
            text-[25px]
            font-semibold
            leading-[100%]
            tracking-[0%]
            capitalize
            text-[#24B9A5]
          "
        >
          Most Popular Types Of Cars
        </h2>

        {/* Description */}
        <p
          className="
            w-[828px]
            h-[30px]
            mx-auto
            mt-[27px]
            text-center
            text-[25px]
            font-medium
            leading-[100%]
            tracking-[0%]
            capitalize
            text-white
          "
        >
          Explore Our Luxurious Fleet Designed To Elevate Every Occasion:
        </p>

        {/* Car Types — cards match Figma (257x172, teal gradient border) */}
        <div className="flex justify-center gap-[40px] mt-[45px]">
          {popularTypes.map((type) => (
            <div
              key={type.id}
              className="relative w-[257px] h-[172px] rounded-[10px] flex flex-col items-center pt-[26px]"
            >
              {/* 1px teal gradient border (Figma) */}
              <div
                className="absolute inset-0 rounded-[10px] pointer-events-none"
                style={{
                  padding: "1px",
                  background:
                    "linear-gradient(360deg, rgba(36,185,165,0.8) 0%, rgba(23,148,135,0) 100%)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />

              <img
  src={carIcon}
  alt=""
  className="w-[50px] h-[50px] object-contain"
/>
              <p className="mt-[16px] w-[98.68px] h-[31.77px] text-[22px] font-medium leading-[100%] capitalize text-white/[0.83] text-center">
  {type.brand}
</p>
              <p className="mt-[4px] text-[20px] font-medium leading-[100%] capitalize text-teal-accent">
                {type.count}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}