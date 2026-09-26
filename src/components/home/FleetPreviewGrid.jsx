import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import FleetShowcaseCard from "./FleetShowcaseCard.jsx";
import {
  fetchFleet,
  selectFeaturedCars,
  selectFleetStatus,
} from "../../store/fleetSlice.js";
import { STATUS } from "../../store/constants.js";

export default function FleetPreviewGrid() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const featuredCars = useSelector(selectFeaturedCars);
  const status = useSelector(selectFleetStatus);

  useEffect(() => {
    if (status === STATUS.IDLE) dispatch(fetchFleet());
  }, [status, dispatch]);

  return (
    <section className="font-display mb-[80px] max-md:mb-14">
      <div className="w-full max-w-[1340px] mx-auto max-md:px-6">
        <SectionEyebrow className="font-display !font-semibold !text-[25px] max-md:!text-[22px] !leading-[100%] !tracking-[0%] capitalize">
          {t("home.fleet.eyebrow")}
        </SectionEyebrow>
        <p
          className="
    w-full
    max-w-[824px]
    min-h-[54px]
    font-medium
    text-[22px]
    leading-[27 px]
    tracking-[0%]
    capitalize
    mb-20
      pt-[20px]
    max-md:min-h-0
    max-md:text-lg
    max-md:leading-snug
    max-md:pt-3
    max-md:mb-8
  "
        >
          {t("home.fleet.description")}
        </p>
        {/* Phones: Card Snap Carousel (see .mobile-carousel--snap in index.css). */}
        <div className="mobile-carousel mobile-carousel--snap flex flex-wrap lg:flex-nowrap justify-center gap-[51px] max-md:gap-3 max-md:py-4">
          {featuredCars.map((car) => (
            <div key={car.id} className="lg:shrink-0 max-w-full max-md:max-w-none">
              <FleetShowcaseCard car={car} />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-[63px] max-md:justify-center max-md:mt-8">
          <Link
            to="/fleet"
            className="inline-flex w-[300px] max-w-full h-[50px] rounded-[10px] items-center justify-center transition-transform hover:scale-[1.02]"
            style={{ background: "#072E2A" }}
          >
            <span className="font-display font-medium text-[20px] leading-[100%] text-white">
              {t("home.fleet.cta")}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
