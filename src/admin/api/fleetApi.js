import { adminApi, fromMock } from "./adminApi.js";
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
  uploadImage,
} from "./mockFleet.js";

// Fleet endpoints (cars, categories) and image uploads. TODO(api): replace
// each `queryFn` with the `query` in the comment above it.
const fleetApi = adminApi
  .enhanceEndpoints({ addTagTypes: ["Car", "Category"] })
  .injectEndpoints({
    endpoints: (build) => ({
      // query: (params) => ({ url: "/fleet/cars", params })
      getCars: build.query({
        queryFn: (params) => fromMock(listCars(params)),
        providesTags: (result) => [
          { type: "Car", id: "LIST" },
          ...(result?.items ?? []).map(({ id }) => ({ type: "Car", id })),
        ],
      }),

      // query: (id) => `/fleet/cars/${id}`
      getCar: build.query({
        queryFn: (id) => fromMock(getCar(id)),
        providesTags: (result, error, id) => [{ type: "Car", id }],
      }),

      // query: (car) => ({ url: "/fleet/cars", method: "POST", body: car })
      createCar: build.mutation({
        queryFn: (car) => fromMock(createCar(car)),
        invalidatesTags: [
          { type: "Car", id: "LIST" },
          { type: "Category", id: "LIST" },
        ],
      }),

      // query: ({ id, ...changes }) => ({ url: `/fleet/cars/${id}`, method: "PATCH", body: changes })
      updateCar: build.mutation({
        queryFn: (args) => fromMock(updateCar(args)),
        invalidatesTags: (result, error, { id }) => [
          { type: "Car", id },
          { type: "Car", id: "LIST" },
          { type: "Category", id: "LIST" },
        ],
      }),

      // query: (id) => ({ url: `/fleet/cars/${id}`, method: "DELETE" })
      deleteCar: build.mutation({
        queryFn: (id) => fromMock(deleteCar(id)),
        invalidatesTags: [
          { type: "Car", id: "LIST" },
          { type: "Category", id: "LIST" },
        ],
      }),

      // query: () => "/fleet/categories"
      getCategories: build.query({
        queryFn: () => fromMock(listCategories()),
        providesTags: [{ type: "Category", id: "LIST" }],
      }),

      // query: (category) => ({ url: "/fleet/categories", method: "POST", body: category })
      createCategory: build.mutation({
        queryFn: (category) => fromMock(createCategory(category)),
        invalidatesTags: [{ type: "Category", id: "LIST" }],
      }),

      // query: ({ id, ...changes }) => ({ url: `/fleet/categories/${id}`, method: "PATCH", body: changes })
      updateCategory: build.mutation({
        queryFn: (args) => fromMock(updateCategory(args)),
        invalidatesTags: [{ type: "Category", id: "LIST" }],
      }),

      // query: (id) => ({ url: `/fleet/categories/${id}`, method: "DELETE" })
      deleteCategory: build.mutation({
        queryFn: (id) => fromMock(deleteCategory(id)),
        invalidatesTags: [{ type: "Category", id: "LIST" }],
      }),

      // query: (file) => { const body = new FormData(); body.append("file", file);
      //   return { url: "/uploads", method: "POST", body }; }
      uploadImage: build.mutation({
        queryFn: (file) => fromMock(uploadImage(file)),
      }),
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
  useUploadImageMutation,
} = fleetApi;
