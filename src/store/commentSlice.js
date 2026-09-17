import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { submitBlogComment } from "../api/commentService.js";
import { SUBMIT_STATUS } from "./constants.js";

// POST /blog-posts/:postId/comments
export const submitComment = createAsyncThunk(
  "comment/submitComment",
  async ({ postId, payload }) => await submitBlogComment(postId, payload)
);

const commentSlice = createSlice({
  name: "comment",
  initialState: {
    status: SUBMIT_STATUS.IDLE,
    error: null,
  },
  reducers: {
    resetCommentStatus: (state) => {
      state.status = SUBMIT_STATUS.IDLE;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitComment.pending, (state) => {
        state.status = SUBMIT_STATUS.SUBMITTING;
        state.error = null;
      })
      .addCase(submitComment.fulfilled, (state) => {
        state.status = SUBMIT_STATUS.SUCCESS;
      })
      .addCase(submitComment.rejected, (state, action) => {
        state.status = SUBMIT_STATUS.ERROR;
        state.error = action.error.message;
      });
  },
});

export const { resetCommentStatus } = commentSlice.actions;
export const selectCommentStatus = (state) => state.comment.status;

export default commentSlice.reducer;
