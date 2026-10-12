import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../api/apiClient.js";
import { sessionExpired } from "../store/adminSessionSlice.js";

// The dashboard's data layer (RTK Query): caching, loading states and
// refetching after changes. Each tab adds its endpoints with
// adminApi.injectEndpoints (see e.g. bookingsApi.js).
//
// Until the backend exists, endpoints answer from mock services through
// `queryFn`; switching one to the API means replacing its `queryFn` with a
// `query` (the URL and method are noted next to each).

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/admin`,
  prepareHeaders: (headers, { getState }) => {
    const { token } = getState().adminSession;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// A 401 means the token expired or was revoked: sign out, and the auth gate
// sends the user to the login page.
async function baseQuery(args, api, extraOptions) {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) api.dispatch(sessionExpired());
  return result;
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
