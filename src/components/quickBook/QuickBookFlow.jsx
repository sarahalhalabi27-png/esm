import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
// Step two is its own history entry (a router state flag on the same URL), so
// the browser's Back button returns to step one - with its fields still
// filled in - instead of leaving the page; Forward goes to step two again.
export default function QuickBookFlow() {
  const [details, setDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const next = (values) => {
    setDetails(values);
    navigate(location.pathname, { state: { quickBookStep: "service" } });
  };

  // After a reload the state flag survives but the details do not: start over
  const inStepTwo = location.state?.quickBookStep === "service" && details;
  if (!inStepTwo) {
    return <QuickBookForm initialValues={details} onNext={next} />;
  }

  const ServiceForm = SERVICE_FORMS[details.service];
  return <ServiceForm key={details.service} details={details} />;
}
