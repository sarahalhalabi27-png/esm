import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PageLayout from "../components/layout/PageLayout.jsx";
import BlogPageHero from "../components/blog/BlogPageHero.jsx";
import BlogPostCard from "../components/blog/BlogPostCard.jsx";
import {
  fetchBlogPosts,
  selectBlogPosts,
  selectBlogPostsStatus,
} from "../store/blogSlice.js";
import { STATUS } from "../store/constants.js";

export default function BlogPage() {
  const dispatch = useDispatch();
  const posts = useSelector(selectBlogPosts);
  const status = useSelector(selectBlogPostsStatus);

  useEffect(() => {
    if (status === STATUS.IDLE) dispatch(fetchBlogPosts());
  }, [status, dispatch]);

  return (
    <PageLayout>
      <BlogPageHero />
      <section className="max-w-content mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
