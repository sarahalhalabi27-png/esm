import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFleetCategories, getCarById } from "../api/fleetService.js";
import { STATUS } from "./constants.js";

// GET /fleet  -> list of categories (each with its cars)
export const fetchFleet = createAsyncThunk(
  "fleet/fetchFleet",
  async () => await getFleetCategories()
);

// GET /fleet/:carId -> a single car's details
export const fetchCarById = createAsyncThunk(
  "fleet/fetchCarById",
  async (carId) => await getCarById(carId)
);

const fleetSlice = createSlice({
  name: "fleet",
  initialState: {
    categories: [],
    categoriesStatus: STATUS.IDLE,
    carsById: {}, // cache of individual cars keyed by id
    carStatus: STATUS.IDLE,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ----- fetchFleet -----
      .addCase(fetchFleet.pending, (state) => {
        state.categoriesStatus = STATUS.LOADING;
      })
      .addCase(fetchFleet.fulfilled, (state, action) => {
        state.categoriesStatus = STATUS.SUCCEEDED;
        state.categories = action.payload;
      })
      .addCase(fetchFleet.rejected, (state, action) => {
        state.categoriesStatus = STATUS.FAILED;
        state.error = action.error.message;
      })
      // ----- fetchCarById -----
      .addCase(fetchCarById.pending, (state) => {
        state.carStatus = STATUS.LOADING;
      })
      .addCase(fetchCarById.fulfilled, (state, action) => {
        state.carStatus = STATUS.SUCCEEDED;
        if (action.payload) {
          state.carsById[action.meta.arg] = action.payload; // Store the fetched car in the cache using its ID as the key.
          // This lets us reuse the car data later without making another API request.
        }
      })
      .addCase(fetchCarById.rejected, (state, action) => {
        state.carStatus = STATUS.FAILED;
        state.error = action.error.message;
      });
  },
});

// ----- selectors -----
// يجيب بيانات السيارة المطلوبة من Redux
// باستخدام الـ carId.
export const selectFleetCategories = (state) => state.fleet.categories;
export const selectFleetStatus = (state) => state.fleet.categoriesStatus;
export const selectFeaturedCars = (state) =>
  state.fleet.categories.flatMap((category) => category.cars).slice(0, 3);
// بعطيها الـ ID → بتحددلي السيارة المطلوبة → Redux بيعطيها الـ state → بتجيب السيارة من الكاش.
export const selectCarById = (carId) => (state) => state.fleet.carsById[carId];

export default fleetSlice.reducer;
