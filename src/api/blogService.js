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
  const post = findBlogPostById(postId);
  // The list entry overrides the shared detail content; translations merge
  // per language so e.g. the Arabic sections survive the list's Arabic title.
  const translations = { ...blogPostDetailFallback.translations };
  for (const [lang, fields] of Object.entries(post.translations ?? {})) {
    translations[lang] = { ...translations[lang], ...fields };
  }
  return Promise.resolve({ ...blogPostDetailFallback, ...post, translations });
}
