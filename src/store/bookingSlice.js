import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { submitBookingRequest } from "../api/bookingService.js";
import { SUBMIT_STATUS } from "./constants.js";

// POST /bookings
export const submitBooking = createAsyncThunk(
  "booking/submitBooking",
  async (payload) => await submitBookingRequest(payload)
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    status: SUBMIT_STATUS.IDLE,
    error: null,
  },
  // لإعادة حالة الحجز للوضع الأساسي ومسح أي خطأ
  reducers: {
    resetBookingStatus: (state) => {
      state.status = SUBMIT_STATUS.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBooking.pending, (state) => {
        state.status = SUBMIT_STATUS.SUBMITTING;
        state.error = null;
      })
      .addCase(submitBooking.fulfilled, (state) => {
        state.status = SUBMIT_STATUS.SUCCESS;
      })
      .addCase(submitBooking.rejected, (state, action) => {
        state.status = SUBMIT_STATUS.ERROR;
        state.error = action.error.message;
      });
  },
});

export const { resetBookingStatus } = bookingSlice.actions;
export const selectBookingStatus = (state) => state.booking.status;

export default bookingSlice.reducer;
