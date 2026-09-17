import {
  blogPosts,
  blogPostDetailFallback,
  findBlogPostById,
} from "../data/blogPostsData.js";

// TODO(api): swap for GET /blog-posts and GET /blog-posts/:postId
export async function getBlogPosts() {
  // return apiRequest("/blog-posts");
  return Promise.resolve(blogPosts);
}

export async function getBlogPostById(postId) {
  // return apiRequest(`/blog-posts/${postId}`);
  return Promise.resolve({
    ...blogPostDetailFallback,
    ...findBlogPostById(postId),
  });
}
