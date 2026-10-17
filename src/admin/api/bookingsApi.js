import { adminApi, cleanParams, endpoint } from "./adminApi.js";
import {
  deleteBooking,
  getBooking,
  getBookingStats,
  listBookings,
  updateBooking,
} from "./mockBookings.js";

// Bookings endpoints (mock or API, see ./config.js).
export const bookingsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getBookings: build.query(
      endpoint({
        mock: (params) => listBookings(params),
        query: (params) => ({ url: "/bookings", params: cleanParams(params) }),
        providesTags: (result) => [
          { type: "Booking", id: "LIST" },
          ...(result?.items ?? []).map(({ id }) => ({ type: "Booking", id })),
        ],
      })
    ),

    // Refetched after any booking change (it provides the LIST tag).
    getBookingStats: build.query(
      endpoint({
        mock: () => getBookingStats(),
        query: () => "/bookings/stats",
        providesTags: [{ type: "Booking", id: "LIST" }],
      })
    ),

    getBooking: build.query(
      endpoint({
        mock: (id) => getBooking(id),
        query: (id) => `/bookings/${id}`,
        providesTags: (result, error, id) => [{ type: "Booking", id }],
      })
    ),

    updateBooking: build.mutation(
      endpoint({
        mock: (args) => updateBooking(args),
        query: ({ id, ...changes }) => ({
          url: `/bookings/${id}`,
          method: "PATCH",
          body: changes,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "Booking", id },
          { type: "Booking", id: "LIST" },
        ],
      })
    ),

    deleteBooking: build.mutation(
      endpoint({
        mock: (id) => deleteBooking(id),
        query: (id) => ({ url: `/bookings/${id}`, method: "DELETE" }),
        invalidatesTags: [{ type: "Booking", id: "LIST" }],
      })
    ),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingQuery,
  useGetBookingStatsQuery,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} = bookingsApi;
