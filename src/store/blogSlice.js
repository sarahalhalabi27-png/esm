import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBlogPosts, getBlogPostById } from "../api/blogService.js";
import { STATUS } from "./constants.js";

// GET /blog-posts
export const fetchBlogPosts = createAsyncThunk(
  "blog/fetchBlogPosts",
  async () => await getBlogPosts()
);

// GET /blog-posts/:postId
export const fetchBlogPostById = createAsyncThunk(
  "blog/fetchBlogPostById",
  async (postId) => await getBlogPostById(postId)
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    posts: [],
    postsStatus: STATUS.IDLE,
    postsById: {}, // cache of full posts keyed by id
    postStatus: STATUS.IDLE,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ----- fetchBlogPosts -----
      .addCase(fetchBlogPosts.pending, (state) => {
        state.postsStatus = STATUS.LOADING;
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.postsStatus = STATUS.SUCCEEDED;
        state.posts = action.payload;
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.postsStatus = STATUS.FAILED;
        state.error = action.error.message;
      })
      // ----- fetchBlogPostById -----
      .addCase(fetchBlogPostById.pending, (state) => {
        state.postStatus = STATUS.LOADING;
      })
      .addCase(fetchBlogPostById.fulfilled, (state, action) => {
        state.postStatus = STATUS.SUCCEEDED;
        if (action.payload) {
          state.postsById[action.meta.arg] = action.payload;
        }
      })
      .addCase(fetchBlogPostById.rejected, (state, action) => {
        state.postStatus = STATUS.FAILED;
        state.error = action.error.message;
      });
  },
});

// ----- selectors -----
export const selectBlogPosts = (state) => state.blog.posts;
export const selectBlogPostsStatus = (state) => state.blog.postsStatus;
export const selectBlogPostById = (postId) => (state) =>
  state.blog.postsById[postId];
export const selectBlogPostStatus = (state) => state.blog.postStatus;

export default blogSlice.reducer;
