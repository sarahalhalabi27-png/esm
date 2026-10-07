import { useState } from "react";
import QuickBookForm from "./QuickBookForm.jsx";
import PointToPointForm from "./PointToPointForm.jsx";
import HourlyForm from "./HourlyForm.jsx";
import AirportTransferForm from "./AirportTransferForm.jsx";
import CityTourForm from "./CityTourForm.jsx";

// The form for each service (step two), keyed by the service id picked in
// step one (see QUICK_BOOK_SERVICES).
const SERVICE_FORMS = {
  pointToPoint: PointToPointForm,
  hourly: HourlyForm,
  airportTransfer: AirportTransferForm,
  cityTour: CityTourForm,
};

// "Quickly Book Your Luxury Ride": step one collects who and which service,
// then the page's form changes to the picked service's own form. The step-one
// values are kept (and sent with the booking).
export default function QuickBookFlow() {
  const [details, setDetails] = useState(null);

  const next = (values) => {
    setDetails(values);
    window.scrollTo(0, 0);
  };

  if (!details) return <QuickBookForm onNext={next} />;

  const ServiceForm = SERVICE_FORMS[details.service];
  return <ServiceForm key={details.service} details={details} />;
}
