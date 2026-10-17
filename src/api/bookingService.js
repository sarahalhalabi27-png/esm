import { apiRequest } from "./apiClient.js";
import { USE_MOCK } from "./config.js";

// POST /bookings
export async function submitBookingRequest(payload) {
  if (!USE_MOCK)
    return apiRequest("/bookings", { method: "POST", body: payload });
  console.info("Booking request (mock submit):", payload);
  return { success: true, payload };
}
