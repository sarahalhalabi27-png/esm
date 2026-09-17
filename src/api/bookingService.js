// TODO(api): swap for POST /bookings once the backend is ready.
export async function submitBookingRequest(payload) {
  // return apiRequest("/bookings", { method: "POST", body: JSON.stringify(payload) });
  console.info("Booking request (mock submit):", payload);
  return Promise.resolve({ success: true, payload });
}
