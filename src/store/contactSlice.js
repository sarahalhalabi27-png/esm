import { createSubmitSlice } from "./createSubmitSlice.js";
import { submitContactMessage } from "../api/contactService.js";

// POST /contact-messages
const contactSlice = createSubmitSlice({
  name: "contact",
  submitFn: submitContactMessage,
});

export const submitContact = contactSlice.submit;
export const resetContactStatus = contactSlice.reset;
export const selectContactStatus = contactSlice.selectStatus;

export default contactSlice.reducer;
