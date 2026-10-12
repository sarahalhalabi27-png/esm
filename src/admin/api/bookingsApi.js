import { adminApi, fromMock } from "./adminApi.js";
import {
  deleteBooking,
  getBooking,
  listBookings,
  updateBooking,
} from "./mockBookings.js";

// Bookings endpoints. TODO(api): replace each `queryFn` with the `query`
// in the comment above it.
export const bookingsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    // query: (params) => ({ url: "/bookings", params })
    getBookings: build.query({
      queryFn: (params) => fromMock(listBookings(params)),
      providesTags: (result) => [
        { type: "Booking", id: "LIST" },
        ...(result?.items ?? []).map(({ id }) => ({ type: "Booking", id })),
      ],
    }),

    // query: (id) => `/bookings/${id}`
    getBooking: build.query({
      queryFn: (id) => fromMock(getBooking(id)),
      providesTags: (result, error, id) => [{ type: "Booking", id }],
    }),

    // query: ({ id, ...changes }) => ({ url: `/bookings/${id}`, method: "PATCH", body: changes })
    updateBooking: build.mutation({
      queryFn: (args) => fromMock(updateBooking(args)),
      invalidatesTags: (result, error, { id }) => [
        { type: "Booking", id },
        { type: "Booking", id: "LIST" },
      ],
    }),

    // query: (id) => ({ url: `/bookings/${id}`, method: "DELETE" })
    deleteBooking: build.mutation({
      queryFn: (id) => fromMock(deleteBooking(id)),
      invalidatesTags: [{ type: "Booking", id: "LIST" }],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingQuery,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} = bookingsApi;
