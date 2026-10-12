import { adminApi, fromMock } from "./adminApi.js";
import {
  deleteCustomer,
  getCustomer,
  listCustomers,
  updateCustomer,
} from "./mockCustomers.js";

// Customer accounts. TODO(api): replace each `queryFn` with the `query`
// in the comment above it.
const customersApi = adminApi
  .enhanceEndpoints({ addTagTypes: ["Customer"] })
  .injectEndpoints({
    endpoints: (build) => ({
      // query: (params) => ({ url: "/customers", params })
      getCustomers: build.query({
        queryFn: (params) => fromMock(listCustomers(params)),
        providesTags: [
          { type: "Customer", id: "LIST" },
          { type: "Booking", id: "LIST" },
        ],
      }),

      // query: (id) => `/customers/${id}`
      // Also refetched after booking changes, for its booking numbers.
      getCustomer: build.query({
        queryFn: (id) => fromMock(getCustomer(id)),
        providesTags: (result, error, id) => [
          { type: "Customer", id },
          { type: "Booking", id: "LIST" },
        ],
      }),

      // query: ({ id, ...changes }) => ({ url: `/customers/${id}`, method: "PATCH", body: changes })
      updateCustomer: build.mutation({
        queryFn: (args) => fromMock(updateCustomer(args)),
        invalidatesTags: (result, error, { id }) => [
          { type: "Customer", id },
          { type: "Customer", id: "LIST" },
        ],
      }),

      // query: (id) => ({ url: `/customers/${id}`, method: "DELETE" })
      deleteCustomer: build.mutation({
        queryFn: (id) => fromMock(deleteCustomer(id)),
        invalidatesTags: [{ type: "Customer", id: "LIST" }],
      }),
    }),
  });

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApi;
