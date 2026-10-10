import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SectionEyebrow from "../common/SectionEyebrow.jsx";
import { BookingButton } from "../common/BookingFields.jsx";
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
    <section className="font-display mt-[100px] mb-[80px] max-md:mt-6 max-md:mb-14">
      <div className="px-6 md:px-10 lg:px-[50px]">
        <SectionEyebrow className="font-display !font-semibold !text-[30px] max-md:!text-[22px] !leading-[100%] !tracking-[0%] capitalize">
          {t("home.fleet.eyebrow")}
        </SectionEyebrow>
        <p className="w-full max-w-[824px] min-h-[54px] font-medium text-[20px] leading-[1.5] tracking-[0%] capitalize mb-12 pt-[20px] max-md:min-h-0 max-md:text-lg max-md:leading-snug max-md:pt-3 max-md:mb-4">
          {t("home.fleet.description")}
        </p>
        {/* xl+: three equal columns across the content, 32px apart, so the
            row's edges line up with the page gutters and the button below.
            Narrower screens wrap the 416px cards (2 + 1), centred. Phones:
            Card Snap Carousel (see .mobile-carousel--snap in index.css). */}
        <div className="mobile-carousel mobile-carousel--snap flex flex-wrap justify-center gap-8 xl:grid xl:grid-cols-3 max-md:gap-3 max-md:py-4">
          {featuredCars.map((car) => (
            <div key={car.id} className="min-w-0 max-w-full max-md:max-w-none">
              <FleetShowcaseCard car={car} />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-10 max-md:justify-center max-md:mt-4">
          <BookingButton as={Link} variant="page" to="/fleet" className="px-12">
            {t("home.fleet.cta")}
          </BookingButton>
        </div>
      </div>
    </section>
  );
}
