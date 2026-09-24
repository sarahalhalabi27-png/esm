import { useEffect } from "react";
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
  const dispatch = useDispatch();
  const featuredCars = useSelector(selectFeaturedCars);
  const status = useSelector(selectFleetStatus);

  useEffect(() => {
    if (status === STATUS.IDLE) dispatch(fetchFleet());
  }, [status, dispatch]);

  return (
    <section className="font-display mb-[80px]">
      <div className="w-full max-w-[1340px] mx-auto">
        <SectionEyebrow className="font-display !font-semibold !text-[25px] !leading-[100%] !tracking-[0%] capitalize">
          Our Luxury Fleet
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
  "
        >
          Luxury Cars Carefully Selected To Embody The Highest Levels Of Quality
          And Sophistication.
        </p>
        <div className="flex justify-center gap-[51px]">
          {featuredCars.map((car) => (
            <div key={car.id} className="shrink-0">
              <FleetShowcaseCard car={car} />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-[63px]">
          <Link
            to="/fleet"
            className="inline-flex w-[300px] h-[50px] rounded-[10px] items-center justify-center transition-transform hover:scale-[1.02]"
            style={{ background: "#072E2A" }}
          >
            <span className="font-display font-medium text-[20px] leading-[100%] text-white">
              Explore Our Fleet
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
