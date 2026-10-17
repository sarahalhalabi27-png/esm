import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../api/apiClient.js";
import { sessionExpired } from "../store/adminSessionSlice.js";
import { USE_MOCK } from "./config.js";

// The dashboard's data layer (RTK Query): caching, loading states and
// refetching after changes. Each tab adds its endpoints with
// adminApi.injectEndpoints (see e.g. bookingsApi.js).
//
// Each endpoint is declared with `endpoint({ mock, query, ... })`: `mock` is
// the mock service call and `query` the real request (see docs/admin-api.md).
// Which one runs is decided once, by VITE_ADMIN_MOCK (see ./config.js), so
// connecting the backend needs no change to the screens.

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/admin`,
  prepareHeaders: (headers, { getState }) => {
    const { token } = getState().adminSession;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// Errors reach the screens as { status, message }, where `message` is the
// backend's error code (e.g. "EMAIL_TAKEN", see docs/admin-api.md), the same
// shape the mocks give. A 401 means the token expired or was revoked: sign
// out, and the auth gate sends the user to the login page.
async function baseQuery(args, api, extraOptions) {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (!result.error) return result;
  if (result.error.status === 401) api.dispatch(sessionExpired());
  return {
    ...result,
    error: {
      status: result.error.status,
      message: result.error.data?.code ?? "REQUEST_FAILED",
    },
  };
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery,
  tagTypes: ["Booking"],
  endpoints: () => ({}),
});

// Runs a mock service call as an RTK Query `queryFn`: its value becomes
// `data`, a thrown error becomes `error` ({ status, message }).
export async function fromMock(promise) {
  try {
    return { data: await promise };
  } catch (error) {
    return {
      error: { status: error.status ?? "MOCK_ERROR", message: error.message },
    };
  }
}

// Query parameters without the empty ones: the filters use "" for "off", and
// the backend should get nothing at all for them.
export function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== undefined && value !== null
    )
  );
}

// An endpoint's definition, either from the mock service or from the API:
//   mock:  (arg, api) => Promise   a mock service call (api has getState)
//   query: (arg) => request        what to send to the backend
// Anything else (tags, polling, ...) passes straight through.
export function endpoint({ mock, query, ...options }) {
  return USE_MOCK
    ? { queryFn: (arg, api) => fromMock(mock(arg, api)), ...options }
    : { query, ...options };
}
