// TODO(api): swap for POST /blog-posts/:postId/comments once ready.
export async function submitBlogComment(postId, payload) {
  // return apiRequest(`/blog-posts/${postId}/comments`, { method: "POST", body: JSON.stringify(payload) });
  console.info("Blog comment (mock submit) for", postId, payload);
  return Promise.resolve({ success: true, payload });
}
