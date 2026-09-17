import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PageLayout from "../components/layout/PageLayout.jsx";
import CarDetailsHero from "../components/carDetails/CarDetailsHero.jsx";
import CarFeatureList from "../components/carDetails/CarFeatureList.jsx";
import CarInteriorGallery from "../components/carDetails/CarInteriorGallery.jsx";
import CarReservationForm from "../components/carDetails/CarReservationForm.jsx";
import { carDetailsFallback } from "../data/carDetailsData.js";
import { fetchCarById, selectCarById } from "../store/fleetSlice.js";
import { STATUS } from "../store/constants.js";

export default function CarDetailsPage() {
  const { carId } = useParams();
  const dispatch = useDispatch();
  const rawCar = useSelector(selectCarById(carId));
  const carStatus = useSelector((state) => state.fleet.carStatus);

  useEffect(() => {
    if (!rawCar) dispatch(fetchCarById(carId));
  }, [carId, rawCar, dispatch]);

  // Merge the fetched car over the shared fallback so missing fields stay filled.
  // Once the request settles with no match, fall back to the placeholder details.
  const car = rawCar
    ? { ...carDetailsFallback, ...rawCar }
    : carStatus === STATUS.SUCCEEDED || carStatus === STATUS.FAILED
      ? carDetailsFallback
      : null;

  if (!car) {
    return (
      <PageLayout>
        <div className="max-w-content mx-auto px-6 py-24 text-center text-gray-500">
          Loading car...
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
