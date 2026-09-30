import { Link } from "react-router-dom";
import defaultCar from "../../assets/our-luxury-fleet/lexus.webp";

// Figma: a 330 x 170 car photo with the name centered 28px under it.
// Touch has no hover, so a press shrinks the card slightly and tints the name.
// (The press scale lives on an inner wrapper: the Link itself is moved by the
// row's GSAP animations, which a CSS transform transition would fight.)
export default function FleetCarCard({ car }) {
  return (
    <Link
      to={`/fleet/${car.id}`}
      className="group block w-[330px] shrink-0 snap-start font-display text-center [-webkit-tap-highlight-color:transparent] max-md:w-[min(62vw,260px)]"
    >
      <div className="transition-transform duration-150 ease-out group-active:scale-95">
        <div className="h-[170px] flex items-center justify-center max-md:h-[130px]">
          <img
            src={car.image || defaultCar}
            alt={car.name}
            decoding="async"
            className="max-w-full max-h-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>
        <h3 className="mt-[28px] text-[22px] font-medium leading-[30px] capitalize text-fg transition-colors group-hover:text-teal-accent group-active:text-teal-accent max-md:mt-4 max-md:text-base max-md:leading-snug">
          {car.name}
        </h3>
      </div>
    </Link>
  );
}
