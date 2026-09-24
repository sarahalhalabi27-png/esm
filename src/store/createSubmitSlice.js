import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SUBMIT_STATUS } from "./constants.js";

// Factory for the "submit a form" slices (booking, contact, comment).
// They only differ by name and which API call runs, so this captures the
// shared shape: a status/error state, a submit thunk, and a reset reducer.
//
//   const slice = createSubmitSlice({ name: "booking", submitFn: submitBookingRequest });
//   export const submitBooking = slice.submit;         // the async thunk
//   export const resetBookingStatus = slice.reset;     // the reset action
//   export const selectBookingStatus = slice.selectStatus;
//   export default slice.reducer;
export function createSubmitSlice({ name, submitFn }) {
  const submit = createAsyncThunk(
    `${name}/submit`,
    async (arg) => await submitFn(arg)
  );

  const slice = createSlice({
    name,
    initialState: {
      status: SUBMIT_STATUS.IDLE,
      error: null,
    },
    reducers: {
      // Reset the status to idle and clear any error.
      reset: (state) => {
        state.status = SUBMIT_STATUS.IDLE;
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(submit.pending, (state) => {
          state.status = SUBMIT_STATUS.SUBMITTING;
          state.error = null;
        })
        .addCase(submit.fulfilled, (state) => {
          state.status = SUBMIT_STATUS.SUCCESS;
        })
        .addCase(submit.rejected, (state, action) => {
          state.status = SUBMIT_STATUS.ERROR;
          state.error = action.error.message;
        });
    },
  });

  return {
    reducer: slice.reducer,
    submit,
    reset: slice.actions.reset,
    selectStatus: (state) => state[name].status,
  };
}
