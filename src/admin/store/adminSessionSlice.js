import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import {
  adminLoginRequest,
  adminLogoutRequest,
  getAdminMeRequest,
} from "../api/adminAuthService.js";
import { STATUS } from "../../store/constants.js";

// The signed-in staff member, with the permission keys the backend gave them.
// Only the token is persisted (see store/index.js); the user and permissions
// are fetched again from /admin/auth/me on every load, so a role changed on
// the backend takes effect after a reload.

export const adminLogin = createAsyncThunk(
  "adminSession/login",
  async (credentials) => await adminLoginRequest(credentials)
);

export const fetchAdminMe = createAsyncThunk(
  "adminSession/fetchMe",
  async (_, { getState }) =>
    await getAdminMeRequest(getState().adminSession.token)
);

export const adminLogout = createAsyncThunk(
  "adminSession/logout",
  async (_, { getState }) => {
    try {
      await adminLogoutRequest(getState().adminSession.token);
    } catch {
      // Signing out locally still matters if the request fails.
    }
  }
);

const initialState = {
  token: null,
  user: null,
  permissions: [],
  meStatus: STATUS.IDLE,
  meError: null,
  loginStatus: STATUS.IDLE,
  loginError: null,
};

const signedOutState = { ...initialState };

const adminSessionSlice = createSlice({
  name: "adminSession",
  initialState,
  reducers: {
    resetAdminLoginStatus: (state) => {
      state.loginStatus = STATUS.IDLE;
      state.loginError = null;
    },
    // The backend answered 401 (token expired or revoked).
    sessionExpired: () => signedOutState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loginStatus = STATUS.LOADING;
        state.loginError = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        const { token, user, permissions } = action.payload;
        state.loginStatus = STATUS.SUCCEEDED;
        state.token = token;
        state.user = user;
        state.permissions = permissions;
        state.meStatus = STATUS.SUCCEEDED;
        state.meError = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loginStatus = STATUS.FAILED;
        state.loginError = action.error.message;
      })
      .addCase(fetchAdminMe.pending, (state) => {
        state.meStatus = STATUS.LOADING;
        state.meError = null;
      })
      .addCase(fetchAdminMe.fulfilled, (state, action) => {
        state.meStatus = STATUS.SUCCEEDED;
        state.user = action.payload.user;
        state.permissions = action.payload.permissions;
      })
      .addCase(fetchAdminMe.rejected, (state, action) => {
        // An invalid or expired token signs the user out; any other failure
        // (e.g. offline) keeps the token so a retry can still work.
        if (action.error.message === "UNAUTHORIZED") return signedOutState;
        state.meStatus = STATUS.FAILED;
        state.meError = action.error.message;
      })
      .addCase(adminLogout.fulfilled, () => signedOutState);
  },
});

export const { resetAdminLoginStatus, sessionExpired } =
  adminSessionSlice.actions;

export const selectAdminToken = (state) => state.adminSession.token;
export const selectAdminUser = (state) => state.adminSession.user;
export const selectAdminMeStatus = (state) => state.adminSession.meStatus;
export const selectAdminMeError = (state) => state.adminSession.meError;
export const selectAdminLoginStatus = (state) => state.adminSession.loginStatus;
export const selectAdminLoginError = (state) => state.adminSession.loginError;

// The permission keys as a Set, for quick `has` checks.
export const selectAdminPermissionSet = createSelector(
  [(state) => state.adminSession.permissions],
  (permissions) => new Set(permissions)
);

export default adminSessionSlice.reducer;
