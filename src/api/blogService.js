import {
  blogPosts,
  blogPostDetailFallback,
  findBlogPostById,
} from "../data/blogPostsData.js";
import { apiRequest } from "./apiClient.js";
import { USE_MOCK } from "./config.js";

// GET /blog-posts and GET /blog-posts/:postId
export async function getBlogPosts() {
  if (!USE_MOCK) return apiRequest("/blog-posts");
  return blogPosts;
}

export async function getBlogPostById(postId) {
  if (!USE_MOCK) return apiRequest(`/blog-posts/${postId}`);
  const post = findBlogPostById(postId);
  if (!post) return null; // not found
  // The list entry overrides the shared detail content; translations merge
  // per language so e.g. the Arabic sections survive the list's Arabic title.
  const translations = { ...blogPostDetailFallback.translations };
  for (const [lang, fields] of Object.entries(post.translations ?? {})) {
    translations[lang] = { ...translations[lang], ...fields };
  }
  return { ...blogPostDetailFallback, ...post, translations };
}
