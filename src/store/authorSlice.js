import { createSlice } from "@reduxjs/toolkit";

// Holds the blog commenter's identity when they tick "Remember Me".
// This slice is persisted to localStorage via redux-persist (see store/index.js),
// so the fields pre-fill on the next visit.
const initialState = {
  name: "",
  email: "",
  website: "",
  remember: false,
};

const authorSlice = createSlice({
  name: "author",
  initialState,
  reducers: {
    // Save the commenter's details (called on submit when Remember Me is on).
    saveAuthor: (state, action) => {
      const { name, email, website } = action.payload;
      state.name = name ?? "";
      state.email = email ?? "";
      state.website = website ?? "";
      state.remember = true;
    },
    // Forget the commenter (called on submit when Remember Me is off).
    clearAuthor: () => initialState,
  },
});

export const { saveAuthor, clearAuthor } = authorSlice.actions;
export const selectRememberedAuthor = (state) => state.author;

export default authorSlice.reducer;
