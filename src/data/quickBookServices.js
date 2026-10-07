// The services offered on the quick-booking page, in the order shown in the
// dropdown. `id` is the form value and the key under quickBook.services in
// the translations. Picking one and pressing "Next" swaps the page's form for
// that service's own form (see QuickBookFlow).
export const QUICK_BOOK_SERVICES = [
  "pointToPoint",
  "hourly",
  "airportTransfer",
  "cityTour",
];

// Point-To-Point form dropdowns (keys under quickBook.pointToPoint).
export const POINT_TO_POINT_CAR_TYPES = [
  "businessClass",
  "businessVan",
  "sprinterClass",
];

// TODO(api): the cars (and their passenger counts) will depend on the car
// type; for now every type offers these.
export const POINT_TO_POINT_CARS = ["lexusEs300h", "mercedesEqe"];

export const POINT_TO_POINT_PASSENGERS = ["1", "2", "3"];
