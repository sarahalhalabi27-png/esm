import { fleetCategories, findCarById } from "../data/fleetData.js";

// TODO(api): swap the static fallbacks below for real apiRequest calls
// once GET /fleet and GET /fleet/:carId exist. Signatures are kept
// stable on purpose so pages don't need to change.

export async function getFleetCategories() {
  // return apiRequest("/fleet");
  return Promise.resolve(fleetCategories);
}

export async function getCarById(carId) {
  // return apiRequest(`/fleet/${carId}`);
  return Promise.resolve(findCarById(carId));
}
