import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PageLayout from "../components/layout/PageLayout.jsx";
import FleetPageHero from "../components/fleet/FleetPageHero.jsx";
import FleetCategorySection from "../components/fleet/FleetCategorySection.jsx";
import {
  fetchFleet,
  selectFleetCategories,
  selectFleetStatus,
} from "../store/fleetSlice.js";
import { STATUS } from "../store/constants.js";

export default function OurFleetPage() {
  const dispatch = useDispatch();
  const categories = useSelector(selectFleetCategories);
  const status = useSelector(selectFleetStatus);

  useEffect(() => {
    if (status === STATUS.IDLE) dispatch(fetchFleet());
  }, [status, dispatch]);

  return (
    <PageLayout>
      <FleetPageHero />
      <section className="max-w-content mx-auto px-6 py-16">
        {categories.map((category) => (
          <FleetCategorySection key={category.id} category={category} />
        ))}
      </section>
    </PageLayout>
  );
}
