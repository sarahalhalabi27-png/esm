import { createSelector, createSlice } from "@reduxjs/toolkit";

// Who is signed in, and each account's profile (name, mobile number, photo).
// Only the email identifies the session for now (no token until there is a
// real backend). Profiles are kept per email, so signing out and in again
// brings the same profile back, as a server would. Persisted to localStorage
// via redux-persist (see store/index.js), so the header keeps showing who is
// signed in after a reload.
const sessionSlice = createSlice({
  name: "session",
  initialState: { user: null, profiles: {} },
  reducers: {
    signedIn: (state, action) => {
      state.user = { email: action.payload.email };
    },
    signedOut: (state) => {
      state.user = null;
    },
    // Save the signed-in user's profile: { name, phone, photo }
    profileUpdated: (state, action) => {
      if (!state.user) return;
      const { name, phone, photo } = action.payload;
      state.profiles ??= {};
      state.profiles[state.user.email] = {
        name: name ?? "",
        phone: phone ?? "",
        photo: photo ?? "",
      };
    },
  },
});

export const { signedIn, signedOut, profileUpdated } = sessionSlice.actions;

// The signed-in user with their profile merged in: { email, name, phone,
// photo } (the profile fields are empty strings until they are saved), or
// null. Memoized, so the object only changes when the session does.
export const selectSessionUser = createSelector(
  [(state) => state.session.user, (state) => state.session.profiles],
  (user, profiles) =>
    user
      ? { name: "", phone: "", photo: "", ...profiles?.[user.email], ...user }
      : null
);

export default sessionSlice.reducer;
