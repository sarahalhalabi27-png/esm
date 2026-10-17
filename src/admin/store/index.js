import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import adminSessionReducer, {
  adminLogin,
  adminLogout,
  sessionExpired,
} from "./adminSessionSlice.js";
import { adminApi } from "../api/adminApi.js";

// The dashboard's own store, separate from the website's (store/index.js),
// so none of it ships to site visitors. It lives in the lazy /admin bundle.

// Only the session token survives a reload; the user and permissions are
// fetched again from the backend each load.
const persistedSessionReducer = persistReducer(
  { key: "esm-limo-admin", storage, whitelist: ["token"] },
  adminSessionReducer
);

// Drop all cached dashboard data whenever who is signed in changes, so one
// staff member never sees another's cached results.
const sessionListener = createListenerMiddleware();
sessionListener.startListening({
  matcher: isAnyOf(adminLogin.fulfilled, adminLogout.fulfilled, sessionExpired),
  effect: (_, api) => api.dispatch(adminApi.util.resetApiState()),
});

export const adminStore = configureStore({
  reducer: combineReducers({
    adminSession: persistedSessionReducer,
    [adminApi.reducerPath]: adminApi.reducer,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .prepend(sessionListener.middleware)
      .concat(adminApi.middleware),
});

export const adminPersistor = persistStore(adminStore);
