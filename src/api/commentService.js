import { apiRequest } from "./apiClient.js";
import { USE_MOCK } from "./config.js";

// POST /blog-posts/:postId/comments
export async function submitBlogComment(postId, payload) {
  if (!USE_MOCK) {
    return apiRequest(`/blog-posts/${postId}/comments`, {
      method: "POST",
      body: payload,
    });
  }
  console.info("Blog comment (mock submit) for", postId, payload);
  return { success: true, payload };
}
