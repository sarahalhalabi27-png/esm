import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PageLayout from "../components/layout/PageLayout.jsx";
import BlogPostHero from "../components/blog/BlogPostHero.jsx";
import BlogPostContent from "../components/blog/BlogPostContent.jsx";
import CommentForm from "../components/blog/CommentForm.jsx";
import {
  fetchBlogPostById,
  selectBlogPostById,
  selectBlogPostStatus,
} from "../store/blogSlice.js";
import { STATUS } from "../store/constants.js";

export default function BlogPostPage() {
  const { t } = useTranslation();
  const { postId } = useParams();
  const dispatch = useDispatch();
  // undefined = not fetched yet, null = no post with this id.
  const post = useSelector(selectBlogPostById(postId));
  const postStatus = useSelector(selectBlogPostStatus);

  useEffect(() => {
    if (post === undefined) dispatch(fetchBlogPostById(postId));
  }, [postId, post, dispatch]);

  if (!post) {
    const notFound = post === null || postStatus === STATUS.FAILED;
    return (
      <PageLayout>
        <div className="font-display max-w-content mx-auto px-6 py-24 text-center text-fg/60">
          {notFound ? (
            <>
              <p className="text-xl">{t("blogPost.notFound")}</p>
              <Link
                to="/blog"
                className="inline-block mt-6 text-teal-accent underline underline-offset-4"
              >
                {t("blogPost.backToBlog")}
              </Link>
            </>
          ) : (
            t("blogPost.loading")
          )}
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
