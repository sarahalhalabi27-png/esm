import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { submitContactMessage } from "../api/contactService.js";
import { SUBMIT_STATUS } from "./constants.js";

// POST /contact-messages
export const submitContact = createAsyncThunk(
  "contact/submitContact",
  async (payload) => await submitContactMessage(payload)
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    status: SUBMIT_STATUS.IDLE,
    error: null,
  },
  reducers: {
    resetContactStatus: (state) => {
      state.status = SUBMIT_STATUS.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContact.pending, (state) => {
        state.status = SUBMIT_STATUS.SUBMITTING;
        state.error = null;
      })
      .addCase(submitContact.fulfilled, (state) => {
        state.status = SUBMIT_STATUS.SUCCESS;
      })
      .addCase(submitContact.rejected, (state, action) => {
        state.status = SUBMIT_STATUS.ERROR;
        state.error = action.error.message;
      });
  },
});

export const { resetContactStatus } = contactSlice.actions;
export const selectContactStatus = (state) => state.contact.status;

export default contactSlice.reducer;
