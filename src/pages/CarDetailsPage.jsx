import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/layout/PageLayout.jsx";
import CarDetailsHero from "../components/carDetails/CarDetailsHero.jsx";
import CarFeatureList from "../components/carDetails/CarFeatureList.jsx";
import CarInteriorGallery from "../components/carDetails/CarInteriorGallery.jsx";
import CarReservationForm from "../components/carDetails/CarReservationForm.jsx";
import { fetchCarById, selectCarById } from "../store/fleetSlice.js";
import { STATUS } from "../store/constants.js";

// Opened from a car on Our Fleet or a "Book Now" on the home page
// (/fleet/:carId).
export default function CarDetailsPage() {
  const { t } = useTranslation();
  const { carId } = useParams();
  const dispatch = useDispatch();
  // undefined = not fetched yet, null = no car with this id.
  const car = useSelector(selectCarById(carId));
  const carStatus = useSelector((state) => state.fleet.carStatus);

  useEffect(() => {
    if (car === undefined) dispatch(fetchCarById(carId));
  }, [carId, car, dispatch]);

  if (!car) {
    const notFound = car === null || carStatus === STATUS.FAILED;
    return (
      <PageLayout>
        <div className="font-display px-6 py-32 text-center text-fg/70">
          {notFound ? (
            <>
              <p className="text-xl">{t("carDetails.notFound")}</p>
              <Link
                to="/fleet"
                className="inline-block mt-6 text-teal-accent underline underline-offset-4"
              >
                {t("carDetails.backToFleet")}
              </Link>
            </>
          ) : (
            <p>{t("carDetails.loading")}</p>
          )}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <CarDetailsHero car={car} />
      <CarFeatureList car={car} />
      <CarInteriorGallery car={car} />
      <CarReservationForm car={car} />
    </PageLayout>
  );
}
