import { adminApi, fromMock } from "./adminApi.js";
import {
  deleteMessage,
  getMessage,
  getMessageStats,
  listMessages,
  updateMessage,
} from "./mockMessages.js";

// Contact Us messages. TODO(api): replace each `queryFn` with the `query`
// in the comment above it.
const messagesApi = adminApi
  .enhanceEndpoints({ addTagTypes: ["Message"] })
  .injectEndpoints({
    endpoints: (build) => ({
      // query: (params) => ({ url: "/messages", params })
      getMessages: build.query({
        queryFn: (params) => fromMock(listMessages(params)),
        providesTags: (result) => [
          { type: "Message", id: "LIST" },
          ...(result?.items ?? []).map(({ id }) => ({ type: "Message", id })),
        ],
      }),

      // query: () => "/messages/stats"
      getMessageStats: build.query({
        queryFn: () => fromMock(getMessageStats()),
        providesTags: [{ type: "Message", id: "LIST" }],
      }),

      // query: (id) => `/messages/${id}`
      getMessage: build.query({
        queryFn: (id) => fromMock(getMessage(id)),
        providesTags: (result, error, id) => [{ type: "Message", id }],
      }),

      // query: ({ id, ...changes }) => ({ url: `/messages/${id}`, method: "PATCH", body: changes })
      updateMessage: build.mutation({
        queryFn: (args) => fromMock(updateMessage(args)),
        invalidatesTags: (result, error, { id }) => [
          { type: "Message", id },
          { type: "Message", id: "LIST" },
        ],
      }),

      // query: (id) => ({ url: `/messages/${id}`, method: "DELETE" })
      deleteMessage: build.mutation({
        queryFn: (id) => fromMock(deleteMessage(id)),
        invalidatesTags: [{ type: "Message", id: "LIST" }],
      }),
    }),
  });

export const {
  useGetMessagesQuery,
  useGetMessageStatsQuery,
  useGetMessageQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messagesApi;
