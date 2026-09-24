import { createSubmitSlice } from "./createSubmitSlice.js";
import { submitBookingRequest } from "../api/bookingService.js";

// POST /bookings
const bookingSlice = createSubmitSlice({
  name: "booking",
  submitFn: submitBookingRequest,
});

export const submitBooking = bookingSlice.submit;
export const resetBookingStatus = bookingSlice.reset;
export const selectBookingStatus = bookingSlice.selectStatus;

export default bookingSlice.reducer;
