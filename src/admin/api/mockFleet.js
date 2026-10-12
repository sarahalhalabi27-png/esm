import { fleetCategories } from "../../data/fleetData.js";

// Mock fleet "tables" and service until the backend exists, seeded from the
// website's data (data/fleetData.js). Changes last until the page reloads.
//
// A car, as the backend should send it:
// {
//   id, name, categoryId, published,      (published: shown on the website)
//   image: url | null, interiorImages: [url, ...]   (up to 5)
//   pricePerHour, passengers, luggage, modelYear,
//   fuel: "petrol" | "hybrid" | "electric",
//   features: ["wifi", "fuel", "model", "passengers", "luggage", "climate"],
//   description: { en, ar },              (empty = the site's shared text)
//   rating, reviewsCount,                 (read-only, from reviews)
// }
// A category: { id, name: { en, ar }, carCount }

export const CAR_FUELS = ["petrol", "hybrid", "electric"];
export const CAR_FEATURES = [
  "wifi",
  "fuel",
  "model",
  "passengers",
  "luggage",
  "climate",
];
export const MAX_INTERIOR_IMAGES = 5;

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
const copy = (value) => structuredClone(value);

function apiError(code, status) {
  const error = new Error(code);
  error.status = status;
  return error;
}

const CATEGORY_NAMES_AR = {
  "suv-class": "فئة SUV",
  "first-class": "الدرجة الأولى",
};

let categories = fleetCategories.map((category) => ({
  id: category.id,
  name: { en: category.name, ar: CATEGORY_NAMES_AR[category.id] ?? "" },
}));

let cars = fleetCategories.flatMap((category) =>
  category.cars.map((car) => ({
    id: car.id,
    name: car.name,
    categoryId: category.id,
    published: true,
    image: car.image ?? null,
    interiorImages: [...(car.interiorImages ?? [])],
    pricePerHour: car.pricePerHour,
    passengers: car.passengers,
    luggage: car.luggage,
    modelYear: car.modelYear,
    fuel: car.fuel,
    features: [...car.features],
    description: { en: car.description ?? "", ar: "" },
    rating: car.rating,
    reviewsCount: car.reviewsCount,
  }))
);

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "item";

function uniqueId(base, taken) {
  let id = slugify(base);
  for (let n = 2; taken.some((item) => item.id === id); n += 1) {
    id = `${slugify(base)}-${n}`;
  }
  return id;
}

// ----- cars -----

// GET /admin/fleet/cars?category&q -> { items }
export async function listCars({ category = "", q = "" } = {}) {
  await delay();
  const needle = q.trim().toLowerCase();
  return copy({
    items: cars.filter(
      (car) =>
        (!category || car.categoryId === category) &&
        (!needle || car.name.toLowerCase().includes(needle))
    ),
  });
}

// GET /admin/fleet/cars/:id
export async function getCar(id) {
  await delay(250);
  const car = cars.find((c) => c.id === id);
  if (!car) throw apiError("NOT_FOUND", 404);
  return copy(car);
}

// POST /admin/fleet/cars  { ...car fields }  -> the new car
export async function createCar(fields) {
  await delay();
  const car = {
    rating: 0,
    reviewsCount: 0,
    ...fields,
    id: uniqueId(fields.name, cars),
  };
  cars = [...cars, car];
  return copy(car);
}

// PATCH /admin/fleet/cars/:id  { ...changed fields }
export async function updateCar({ id, ...changes }) {
  await delay();
  const index = cars.findIndex((c) => c.id === id);
  if (index === -1) throw apiError("NOT_FOUND", 404);
  cars[index] = { ...cars[index], ...changes };
  return copy(cars[index]);
}

// DELETE /admin/fleet/cars/:id
export async function deleteCar(id) {
  await delay();
  if (!cars.some((c) => c.id === id)) throw apiError("NOT_FOUND", 404);
  cars = cars.filter((c) => c.id !== id);
  return { id };
}

// ----- categories -----

const withCount = (category) => ({
  ...category,
  carCount: cars.filter((car) => car.categoryId === category.id).length,
});

// GET /admin/fleet/categories -> [{ id, name: { en, ar }, carCount }]
export async function listCategories() {
  await delay(250);
  return copy(categories.map(withCount));
}

// POST /admin/fleet/categories  { name: { en, ar } }
export async function createCategory({ name }) {
  await delay();
  const category = { id: uniqueId(name.en, categories), name };
  categories = [...categories, category];
  return copy(withCount(category));
}

// PATCH /admin/fleet/categories/:id  { name: { en, ar } }
export async function updateCategory({ id, name }) {
  await delay();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) throw apiError("NOT_FOUND", 404);
  categories[index] = { ...categories[index], name };
  return copy(withCount(categories[index]));
}

// DELETE /admin/fleet/categories/:id  (409 CATEGORY_NOT_EMPTY while it has cars)
export async function deleteCategory(id) {
  await delay();
  if (cars.some((car) => car.categoryId === id)) {
    throw apiError("CATEGORY_NOT_EMPTY", 409);
  }
  categories = categories.filter((c) => c.id !== id);
  return { id };
}

// ----- uploads -----

// POST /admin/uploads  (multipart "file") -> { url }
// The mock keeps the image in memory as a data URL.
export async function uploadImage(file) {
  await delay(500);
  const url = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(apiError("UPLOAD_FAILED", 500));
    reader.readAsDataURL(file);
  });
  return { url };
}
