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

const rootReducer = combineReducers({
  fleet: fleetReducer,
  blog: blogReducer,
  booking: bookingReducer,
  contact: contactReducer,
  comment: commentReducer,
  author: authorReducer,
});

// Only the "author" slice is persisted (the Remember Me identity).
// Data caches and transient submit statuses are intentionally left out.
const persistConfig = {
  key: "esm-limo",
  storage,
  whitelist: ["author"],
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
