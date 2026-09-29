// TODO(api): replace with GET /api/fleet - keep this exact shape so
// components do not need to change when the real endpoint lands.
// Placeholder photos — to be swapped for the final car images.
import gmcYukon from "../assets/our-luxury-fleet/gmc.webp";
import mercedesEqc from "../assets/our-luxury-fleet/mercedes.webp";
import mercedesEqb from "../assets/our-luxury-fleet/mercedes2.webp";
import bmw760 from "../assets/our-luxury-fleet/bmw.webp";
import audiA8 from "../assets/our-luxury-fleet/audi.webp";
import lexusEs from "../assets/our-luxury-fleet/lexus.webp";
import interiorPhoto from "../assets/car-details/car-interior.webp";

// Shared placeholder specs until each car gets its own.
// `features` are keys into carDetails.features.* (translations); "fuel" is
// replaced by the car's own fuel type (petrol / hybrid / electric).
// `description` (optional) overrides the shared description text, and
// `interiorImages` holds the Car Interior gallery (empty slots show a
// placeholder). For now every car shows the same placeholder photo.
function placeholderSpecs(fuel) {
  return {
    pricePerHour: 200,
    rating: 4,
    reviewsCount: 50,
    passengers: 4,
    luggage: 2,
    modelYear: 2025,
    fuel,
    features: ["wifi", "fuel", "model", "passengers", "luggage", "climate"],
    interiorImages: Array(5).fill(interiorPhoto),
  };
}

export const fleetCategories = [
  {
    id: "suv-class",
    name: "SUV Class",
    cars: [
      {
        id: "gmc-yukon",
        name: "GMC Yukon",
        image: gmcYukon,
        ...placeholderSpecs("petrol"),
      },
      {
        id: "mercedes-benz-eqc",
        name: "Mercedes-Benz EQC",
        image: mercedesEqc,
        ...placeholderSpecs("electric"),
      },
      {
        id: "mercedes-benz-eqb",
        name: "Mercedes-Benz EQB",
        image: mercedesEqb,
        ...placeholderSpecs("electric"),
      },
      {
        id: "cadillac-escalade",
        name: "Cadillac Escalade",
        // Placeholder: reuses the GMC photo until its own image lands.
        image: gmcYukon,
        ...placeholderSpecs("petrol"),
      },
    ],
  },
  {
    id: "first-class",
    name: "First Class",
    cars: [
      {
        id: "bmw-760li",
        name: "BMW 760Li",
        image: bmw760,
        ...placeholderSpecs("petrol"),
      },
      {
        id: "audi-a8",
        name: "Audi A8",
        image: audiA8,
        ...placeholderSpecs("petrol"),
      },
      // No photo yet — cards fall back to the default car image.
      {
        id: "mercedes-benz-eqs",
        name: "Mercedes-Benz EQS",
        image: null,
        ...placeholderSpecs("electric"),
      },
      {
        id: "lexus-es-300h",
        name: "Lexus ES 300h",
        image: lexusEs,
        ...placeholderSpecs("hybrid"),
      },
    ],
  },
];

export function findCarById(carId) {
  for (const category of fleetCategories) {
    const found = category.cars.find((car) => car.id === carId);
    if (found) return found;
  }
  return null;
}
