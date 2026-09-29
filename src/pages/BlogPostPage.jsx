import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/layout/PageLayout.jsx";
import BlogPostHero from "../components/blog/BlogPostHero.jsx";
import BlogPostContent from "../components/blog/BlogPostContent.jsx";
import CommentForm from "../components/blog/CommentForm.jsx";
import { fetchBlogPostById, selectBlogPostById } from "../store/blogSlice.js";

export default function BlogPostPage() {
  const { t } = useTranslation();
  const { postId } = useParams();
  const dispatch = useDispatch();
  const post = useSelector(selectBlogPostById(postId));

  useEffect(() => {
    if (!post) dispatch(fetchBlogPostById(postId));
  }, [postId, post, dispatch]);

  if (!post) {
    return (
      <PageLayout>
        <div className="font-display max-w-content mx-auto px-6 py-24 text-center text-fg/60">
          {t("blogPost.loading")}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <BlogPostHero post={post} />
      <BlogPostContent post={post} />
      <CommentForm postId={post.id} />
    </PageLayout>
  );
}
