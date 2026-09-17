// TODO(api): replace with GET /api/fleet - keep this exact shape so
// components do not need to change when the real endpoint lands.
export const fleetCategories = [
  {
    id: "suv-class",
    name: "SUV Class",
    cars: [
      {
        id: "lexus-es-300h-1",
        name: "Lexus ES 300h",
        image: null,
        pricePerHour: 200,
        rating: 4,
        reviewsCount: 50,
        passengers: 4,
        luggage: 2,
      },
      {
        id: "lexus-es-300h-2",
        name: "Lexus ES 300h",
        image: null,
        pricePerHour: 200,
        rating: 4,
        reviewsCount: 50,
        passengers: 4,
        luggage: 2,
      },
      {
        id: "lexus-es-300h-3",
        name: "Lexus ES 300h",
        image: null,
        pricePerHour: 200,
        rating: 4,
        reviewsCount: 50,
        passengers: 4,
        luggage: 2,
      },
    ],
  },
  {
    id: "first-class",
    name: "First Class",
    cars: [
      {
        id: "lexus-es-300h-4",
        name: "Lexus ES 300h",
        image: null,
        pricePerHour: 200,
        rating: 4,
        reviewsCount: 50,
        passengers: 4,
        luggage: 2,
      },
      {
        id: "lexus-es-300h-5",
        name: "Lexus ES 300h",
        image: null,
        pricePerHour: 200,
        rating: 4,
        reviewsCount: 50,
        passengers: 4,
        luggage: 2,
      },
      {
        id: "lexus-es-300h-6",
        name: "Lexus ES 300h",
        image: null,
        pricePerHour: 200,
        rating: 4,
        reviewsCount: 50,
        passengers: 4,
        luggage: 2,
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
