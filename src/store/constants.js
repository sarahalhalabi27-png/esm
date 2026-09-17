// Shared async status values used across all slices.
// Import these instead of retyping the raw strings so the states stay consistent.
export const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
};

// Form-submission status values (bookings, contact, comments).
export const SUBMIT_STATUS = {
  IDLE: "idle",
  SUBMITTING: "submitting",
  SUCCESS: "success",
  ERROR: "error",
};
