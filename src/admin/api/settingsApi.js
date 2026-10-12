import { adminApi, fromMock } from "./adminApi.js";
import { getSettings, updateSettings } from "./mockSettings.js";

// Site settings. TODO(api): replace each `queryFn` with the `query` in the
// comment above it.
const settingsApi = adminApi
  .enhanceEndpoints({ addTagTypes: ["Settings"] })
  .injectEndpoints({
    endpoints: (build) => ({
      // query: () => "/settings"
      getSettings: build.query({
        queryFn: () => fromMock(getSettings()),
        providesTags: ["Settings"],
      }),

      // query: (changes) => ({ url: "/settings", method: "PATCH", body: changes })
      updateSettings: build.mutation({
        queryFn: (changes) => fromMock(updateSettings(changes)),
        invalidatesTags: ["Settings"],
      }),
    }),
  });

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
