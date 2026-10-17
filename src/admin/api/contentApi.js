import { adminApi, endpoint } from "./adminApi.js";
import { getContent, saveContent } from "./mockContent.js";

// Editable website content blocks (FAQ, offer, partners, legal pages), each
// read and saved whole by its key (mock or API, see ./config.js).
const contentApi = adminApi
  .enhanceEndpoints({ addTagTypes: ["Content"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getContent: build.query(
        endpoint({
          mock: (key) => getContent(key),
          query: (key) => `/content/${key}`,
          providesTags: (result, error, key) => [{ type: "Content", id: key }],
        })
      ),

      saveContent: build.mutation(
        endpoint({
          mock: (args) => saveContent(args),
          query: ({ key, value }) => ({
            url: `/content/${key}`,
            method: "PUT",
            body: value,
          }),
          invalidatesTags: (result, error, { key }) => [
            { type: "Content", id: key },
          ],
        })
      ),
    }),
  });

export const { useGetContentQuery, useSaveContentMutation } = contentApi;
