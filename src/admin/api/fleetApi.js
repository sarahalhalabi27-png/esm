import { adminApi, cleanParams, endpoint } from "./adminApi.js";
import {
  createCar,
  createCategory,
  deleteCar,
  deleteCategory,
  getCar,
  listCars,
  listCategories,
  updateCar,
  updateCategory,
} from "./mockFleet.js";

// Fleet endpoints: cars and categories (mock or API, see ./config.js).
const fleetApi = adminApi
  .enhanceEndpoints({ addTagTypes: ["Car", "Category"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getCars: build.query(
        endpoint({
          mock: (params) => listCars(params),
          query: (params) => ({
            url: "/fleet/cars",
            params: cleanParams(params),
          }),
          providesTags: (result) => [
            { type: "Car", id: "LIST" },
            ...(result?.items ?? []).map(({ id }) => ({ type: "Car", id })),
          ],
        })
      ),

      getCar: build.query(
        endpoint({
          mock: (id) => getCar(id),
          query: (id) => `/fleet/cars/${id}`,
          providesTags: (result, error, id) => [{ type: "Car", id }],
        })
      ),

      createCar: build.mutation(
        endpoint({
          mock: (car) => createCar(car),
          query: (car) => ({ url: "/fleet/cars", method: "POST", body: car }),
          invalidatesTags: [
            { type: "Car", id: "LIST" },
            { type: "Category", id: "LIST" },
          ],
        })
      ),

      updateCar: build.mutation(
        endpoint({
          mock: (args) => updateCar(args),
          query: ({ id, ...changes }) => ({
            url: `/fleet/cars/${id}`,
            method: "PATCH",
            body: changes,
          }),
          invalidatesTags: (result, error, { id }) => [
            { type: "Car", id },
            { type: "Car", id: "LIST" },
            { type: "Category", id: "LIST" },
          ],
        })
      ),

      deleteCar: build.mutation(
        endpoint({
          mock: (id) => deleteCar(id),
          query: (id) => ({ url: `/fleet/cars/${id}`, method: "DELETE" }),
          invalidatesTags: [
            { type: "Car", id: "LIST" },
            { type: "Category", id: "LIST" },
          ],
        })
      ),

      getCategories: build.query(
        endpoint({
          mock: () => listCategories(),
          query: () => "/fleet/categories",
          providesTags: [{ type: "Category", id: "LIST" }],
        })
      ),

      createCategory: build.mutation(
        endpoint({
          mock: (category) => createCategory(category),
          query: (category) => ({
            url: "/fleet/categories",
            method: "POST",
            body: category,
          }),
          invalidatesTags: [{ type: "Category", id: "LIST" }],
        })
      ),

      updateCategory: build.mutation(
        endpoint({
          mock: (args) => updateCategory(args),
          query: ({ id, ...changes }) => ({
            url: `/fleet/categories/${id}`,
            method: "PATCH",
            body: changes,
          }),
          invalidatesTags: [{ type: "Category", id: "LIST" }],
        })
      ),

      deleteCategory: build.mutation(
        endpoint({
          mock: (id) => deleteCategory(id),
          query: (id) => ({
            url: `/fleet/categories/${id}`,
            method: "DELETE",
          }),
          invalidatesTags: [{ type: "Category", id: "LIST" }],
        })
      ),
    }),
  });

export const {
  useGetCarsQuery,
  useGetCarQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = fleetApi;
