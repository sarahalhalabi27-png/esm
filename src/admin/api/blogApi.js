import { adminApi, cleanParams, endpoint } from "./adminApi.js";
import {
  createPost,
  deletePost,
  getCommentStats,
  getPost,
  listComments,
  listPosts,
  moderateComments,
  updatePost,
} from "./mockBlog.js";

// Blog posts and comment moderation (mock or API, see ./config.js).
const blogApi = adminApi
  .enhanceEndpoints({ addTagTypes: ["Post", "Comment"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getPosts: build.query(
        endpoint({
          mock: (params) => listPosts(params),
          query: (params) => ({
            url: "/blog/posts",
            params: cleanParams(params),
          }),
          providesTags: [{ type: "Post", id: "LIST" }],
        })
      ),

      getPost: build.query(
        endpoint({
          mock: (id) => getPost(id),
          query: (id) => `/blog/posts/${id}`,
          providesTags: (result, error, id) => [{ type: "Post", id }],
        })
      ),

      createPost: build.mutation(
        endpoint({
          mock: (post) => createPost(post),
          query: (post) => ({
            url: "/blog/posts",
            method: "POST",
            body: post,
          }),
          invalidatesTags: [{ type: "Post", id: "LIST" }],
        })
      ),

      updatePost: build.mutation(
        endpoint({
          mock: (args) => updatePost(args),
          query: ({ id, ...changes }) => ({
            url: `/blog/posts/${id}`,
            method: "PATCH",
            body: changes,
          }),
          invalidatesTags: (result, error, { id }) => [
            { type: "Post", id },
            { type: "Post", id: "LIST" },
            { type: "Comment", id: "LIST" },
          ],
        })
      ),

      deletePost: build.mutation(
        endpoint({
          mock: (id) => deletePost(id),
          query: (id) => ({ url: `/blog/posts/${id}`, method: "DELETE" }),
          invalidatesTags: [
            { type: "Post", id: "LIST" },
            { type: "Comment", id: "LIST" },
          ],
        })
      ),

      getComments: build.query(
        endpoint({
          mock: (params) => listComments(params),
          query: (params) => ({
            url: "/comments",
            params: cleanParams(params),
          }),
          providesTags: [{ type: "Comment", id: "LIST" }],
        })
      ),

      getCommentStats: build.query(
        endpoint({
          mock: () => getCommentStats(),
          query: () => "/comments/stats",
          providesTags: [{ type: "Comment", id: "LIST" }],
        })
      ),

      moderateComments: build.mutation(
        endpoint({
          mock: (body) => moderateComments(body),
          query: (body) => ({ url: "/comments/bulk", method: "POST", body }),
          invalidatesTags: [
            { type: "Comment", id: "LIST" },
            { type: "Post", id: "LIST" },
          ],
        })
      ),
    }),
  });

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetCommentsQuery,
  useGetCommentStatsQuery,
  useModerateCommentsMutation,
} = blogApi;
