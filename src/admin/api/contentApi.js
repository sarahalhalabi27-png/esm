import { adminApi, fromMock } from "./adminApi.js";
import { getContent, saveContent } from "./mockContent.js";

// Editable website content blocks (FAQ, offer, partners, legal pages), each
// read and saved whole by its key. TODO(api): replace each `queryFn` with
// the `query` in the comment above it.
const contentApi = adminApi
  .enhanceEndpoints({ addTagTypes: ["Content"] })
  .injectEndpoints({
    endpoints: (build) => ({
      // query: (key) => `/content/${key}`
      getContent: build.query({
        queryFn: (key) => fromMock(getContent(key)),
        providesTags: (result, error, key) => [{ type: "Content", id: key }],
      }),

      // query: ({ key, value }) => ({ url: `/content/${key}`, method: "PUT", body: value })
      saveContent: build.mutation({
        queryFn: (args) => fromMock(saveContent(args)),
        invalidatesTags: (result, error, { key }) => [
          { type: "Content", id: key },
        ],
      }),
    }),
  });

export const { useGetContentQuery, useSaveContentMutation } = contentApi;
