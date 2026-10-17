import { fleetCategories, findCarById } from "../data/fleetData.js";
import { apiRequest } from "./apiClient.js";
import { USE_MOCK } from "./config.js";

// GET /fleet and GET /fleet/:carId. Signatures are kept stable on purpose so
// pages don't need to change.

export async function getFleetCategories() {
  if (!USE_MOCK) return apiRequest("/fleet");
  return fleetCategories;
}

export async function getCarById(carId) {
  if (!USE_MOCK) return apiRequest(`/fleet/${carId}`);
  return findCarById(carId);
}
