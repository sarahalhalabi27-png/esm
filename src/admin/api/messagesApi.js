import { adminApi, cleanParams, endpoint } from "./adminApi.js";
import {
  deleteMessage,
  getMessage,
  getMessageStats,
  listMessages,
  updateMessage,
} from "./mockMessages.js";

// Contact Us messages (mock or API, see ./config.js).
const messagesApi = adminApi
  .enhanceEndpoints({ addTagTypes: ["Message"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getMessages: build.query(
        endpoint({
          mock: (params) => listMessages(params),
          query: (params) => ({
            url: "/messages",
            params: cleanParams(params),
          }),
          providesTags: (result) => [
            { type: "Message", id: "LIST" },
            ...(result?.items ?? []).map(({ id }) => ({ type: "Message", id })),
          ],
        })
      ),

      getMessageStats: build.query(
        endpoint({
          mock: () => getMessageStats(),
          query: () => "/messages/stats",
          providesTags: [{ type: "Message", id: "LIST" }],
        })
      ),

      getMessage: build.query(
        endpoint({
          mock: (id) => getMessage(id),
          query: (id) => `/messages/${id}`,
          providesTags: (result, error, id) => [{ type: "Message", id }],
        })
      ),

      updateMessage: build.mutation(
        endpoint({
          mock: (args) => updateMessage(args),
          query: ({ id, ...changes }) => ({
            url: `/messages/${id}`,
            method: "PATCH",
            body: changes,
          }),
          invalidatesTags: (result, error, { id }) => [
            { type: "Message", id },
            { type: "Message", id: "LIST" },
          ],
        })
      ),

      deleteMessage: build.mutation(
        endpoint({
          mock: (id) => deleteMessage(id),
          query: (id) => ({ url: `/messages/${id}`, method: "DELETE" }),
          invalidatesTags: [{ type: "Message", id: "LIST" }],
        })
      ),
    }),
  });

export const {
  useGetMessagesQuery,
  useGetMessageStatsQuery,
  useGetMessageQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messagesApi;
