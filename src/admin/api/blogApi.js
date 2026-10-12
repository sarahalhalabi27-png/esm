import { adminApi, fromMock } from "./adminApi.js";
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

// Blog posts and comment moderation. TODO(api): replace each `queryFn`
// with the `query` in the comment above it.
const blogApi = adminApi
  .enhanceEndpoints({ addTagTypes: ["Post", "Comment"] })
  .injectEndpoints({
    endpoints: (build) => ({
      // query: (params) => ({ url: "/blog/posts", params })
      getPosts: build.query({
        queryFn: (params) => fromMock(listPosts(params)),
        providesTags: [{ type: "Post", id: "LIST" }],
      }),

      // query: (id) => `/blog/posts/${id}`
      getPost: build.query({
        queryFn: (id) => fromMock(getPost(id)),
        providesTags: (result, error, id) => [{ type: "Post", id }],
      }),

      // query: (post) => ({ url: "/blog/posts", method: "POST", body: post })
      createPost: build.mutation({
        queryFn: (post) => fromMock(createPost(post)),
        invalidatesTags: [{ type: "Post", id: "LIST" }],
      }),

      // query: ({ id, ...changes }) => ({ url: `/blog/posts/${id}`, method: "PATCH", body: changes })
      updatePost: build.mutation({
        queryFn: (args) => fromMock(updatePost(args)),
        invalidatesTags: (result, error, { id }) => [
          { type: "Post", id },
          { type: "Post", id: "LIST" },
          { type: "Comment", id: "LIST" },
        ],
      }),

      // query: (id) => ({ url: `/blog/posts/${id}`, method: "DELETE" })
      deletePost: build.mutation({
        queryFn: (id) => fromMock(deletePost(id)),
        invalidatesTags: [
          { type: "Post", id: "LIST" },
          { type: "Comment", id: "LIST" },
        ],
      }),

      // query: (params) => ({ url: "/comments", params })
      getComments: build.query({
        queryFn: (params) => fromMock(listComments(params)),
        providesTags: [{ type: "Comment", id: "LIST" }],
      }),

      // query: () => "/comments/stats"
      getCommentStats: build.query({
        queryFn: () => fromMock(getCommentStats()),
        providesTags: [{ type: "Comment", id: "LIST" }],
      }),

      // query: (body) => ({ url: "/comments/bulk", method: "POST", body })
      moderateComments: build.mutation({
        queryFn: (body) => fromMock(moderateComments(body)),
        invalidatesTags: [
          { type: "Comment", id: "LIST" },
          { type: "Post", id: "LIST" },
        ],
      }),
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
