import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/layout/PageLayout.jsx";
import FleetPageHero from "../components/fleet/FleetPageHero.jsx";
import FleetCategorySection from "../components/fleet/FleetCategorySection.jsx";
import SectionEyebrow from "../components/common/SectionEyebrow.jsx";
import {
  fetchFleet,
  selectFleetCategories,
  selectFleetStatus,
} from "../store/fleetSlice.js";
import { STATUS } from "../store/constants.js";
import SmokeBackdrop from "../components/common/SmokeBackdrop.jsx";

export default function OurFleetPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const categories = useSelector(selectFleetCategories);
  const status = useSelector(selectFleetStatus);

  useEffect(() => {
    if (status === STATUS.IDLE) dispatch(fetchFleet());
  }, [status, dispatch]);

  return (
    <PageLayout>
      <FleetPageHero />

      {/* Fleet Collection timeline (Figma: 50px page gutter, the trunk line
          runs down the start edge from the eyebrow to the last category) */}
      <section className="relative isolate font-display w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-[50px] mt-[130px] mb-[130px] max-md:mt-8 max-md:mb-16">
        <SmokeBackdrop />
        <div className="relative pb-[110px] max-md:pb-12">
          <SectionEyebrow className="!text-[22px] max-md:!text-xl">
            {t("fleetPage.eyebrow")}
          </SectionEyebrow>
          <span
            aria-hidden="true"
            className="absolute start-0 top-[26px] bottom-0 w-[1.5px] bg-teal-accent"
          />
        </div>

        {categories.map((category, index) => (
          <FleetCategorySection
            key={category.id}
            category={category}
            isLast={index === categories.length - 1}
          />
        ))}
      </section>
    </PageLayout>
  );
}
