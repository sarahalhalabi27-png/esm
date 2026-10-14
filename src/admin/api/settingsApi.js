import { adminApi, endpoint } from "./adminApi.js";
import { getSettings, updateSettings } from "./mockSettings.js";

// Site settings (mock or API, see ./config.js).
const settingsApi = adminApi
  .enhanceEndpoints({ addTagTypes: ["Settings"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getSettings: build.query(
        endpoint({
          mock: () => getSettings(),
          query: () => "/settings",
          providesTags: ["Settings"],
        })
      ),

      updateSettings: build.mutation(
        endpoint({
          mock: (changes) => updateSettings(changes),
          query: (changes) => ({
            url: "/settings",
            method: "PATCH",
            body: changes,
          }),
          invalidatesTags: ["Settings"],
        })
      ),
    }),
  });

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
