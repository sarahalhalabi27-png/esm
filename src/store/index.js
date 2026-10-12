import { configureStore, combineReducers } from "@reduxjs/toolkit";
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
import fleetReducer from "./fleetSlice.js";
import blogReducer from "./blogSlice.js";
import bookingReducer from "./bookingSlice.js";
import contactReducer from "./contactSlice.js";
import commentReducer from "./commentSlice.js";
import authorReducer from "./authorSlice.js";
import sessionReducer from "./sessionSlice.js";
import {
  loginReducer,
  profileReducer,
  resendCodeReducer,
  signUpReducer,
  verifyEmailReducer,
} from "./accountSlices.js";

const rootReducer = combineReducers({
  fleet: fleetReducer,
  blog: blogReducer,
  booking: bookingReducer,
  contact: contactReducer,
  comment: commentReducer,
  author: authorReducer,
  session: sessionReducer,
  login: loginReducer,
  signUp: signUpReducer,
  verifyEmail: verifyEmailReducer,
  resendCode: resendCodeReducer,
  profile: profileReducer,
});

// Only the "author" (the Remember Me identity) and "session" (who is signed
// in) slices are persisted. Data caches and transient submit statuses are
// intentionally left out.
const persistConfig = {
  key: "esm-limo",
  storage,
  whitelist: ["author", "session"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist dispatches these internal actions with non-serializable payloads.
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
