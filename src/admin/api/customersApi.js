import { adminApi, cleanParams, endpoint } from "./adminApi.js";
import {
  deleteCustomer,
  getCustomer,
  listCustomers,
  updateCustomer,
} from "./mockCustomers.js";

// Customer accounts (mock or API, see ./config.js).
const customersApi = adminApi
  .enhanceEndpoints({ addTagTypes: ["Customer"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getCustomers: build.query(
        endpoint({
          mock: (params) => listCustomers(params),
          query: (params) => ({
            url: "/customers",
            params: cleanParams(params),
          }),
          providesTags: [
            { type: "Customer", id: "LIST" },
            { type: "Booking", id: "LIST" },
          ],
        })
      ),

      // Also refetched after booking changes, for its booking numbers.
      getCustomer: build.query(
        endpoint({
          mock: (id) => getCustomer(id),
          query: (id) => `/customers/${id}`,
          providesTags: (result, error, id) => [
            { type: "Customer", id },
            { type: "Booking", id: "LIST" },
          ],
        })
      ),

      updateCustomer: build.mutation(
        endpoint({
          mock: (args) => updateCustomer(args),
          query: ({ id, ...changes }) => ({
            url: `/customers/${id}`,
            method: "PATCH",
            body: changes,
          }),
          invalidatesTags: (result, error, { id }) => [
            { type: "Customer", id },
            { type: "Customer", id: "LIST" },
          ],
        })
      ),

      deleteCustomer: build.mutation(
        endpoint({
          mock: (id) => deleteCustomer(id),
          query: (id) => ({ url: `/customers/${id}`, method: "DELETE" }),
          invalidatesTags: [{ type: "Customer", id: "LIST" }],
        })
      ),
    }),
  });

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApi;
