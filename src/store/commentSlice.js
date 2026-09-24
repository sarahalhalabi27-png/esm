import { createSubmitSlice } from "./createSubmitSlice.js";
import { submitBlogComment } from "../api/commentService.js";

// POST /blog-posts/:postId/comments
const commentSlice = createSubmitSlice({
  name: "comment",
  submitFn: ({ postId, payload }) => submitBlogComment(postId, payload),
});

export const submitComment = commentSlice.submit;
export const resetCommentStatus = commentSlice.reset;
export const selectCommentStatus = commentSlice.selectStatus;

export default commentSlice.reducer;
