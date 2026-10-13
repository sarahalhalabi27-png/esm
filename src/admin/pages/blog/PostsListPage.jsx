import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  ExternalLink,
  FileText,
  ImageOff,
  MessageSquare,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Can from "../../components/Can.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_CARD,
  ADMIN_CARD_RICH,
  ADMIN_INPUT,
} from "../../components/ui.js";
import { useDeletePostMutation, useGetPostsQuery } from "../../api/blogApi.js";
import useCan from "../../hooks/useCan.js";
import useUrlFilters, { useSearchBox } from "../../hooks/useUrlFilters.js";
import { adminPath } from "../../navigation.js";
import { P } from "../../permissions.js";
import { formatDate } from "../../utils/format.js";
import { localTitle } from "../../utils/blog.js";

const VIEWS = ["", "published", "draft"];
const STATUS_TONES = {
  published:
    "bg-emerald-400/15 text-emerald-300 light:bg-emerald-500/15 light:text-emerald-800",
  draft:
    "bg-amber-400/15 text-amber-300 light:bg-amber-500/15 light:text-amber-800",
};
const STATUS_BARS = {
  published: "bg-emerald-400 light:bg-emerald-500",
  draft: "bg-amber-400 light:bg-amber-500",
};
const COMMENTS_CHIP =
  "inline-flex h-6 items-center gap-1 rounded-full bg-sky-400/15 px-2.5 text-xs font-medium text-sky-300 light:bg-sky-500/15 light:text-sky-800";

export default function PostsListPage() {
  const { t, i18n } = useTranslation("admin");
  const can = useCan();
  const location = useLocation();
  const { get, update } = useUrlFilters();
  const params = { status: get("status"), q: get("q") };
  const search = useSearchBox(params.q, (q) => update({ q }));
  const { data, isLoading, isFetching, isError, refetch } =
    useGetPostsQuery(params);
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const [toDelete, setToDelete] = useState(null);
  const [failed, setFailed] = useState(false);

  const confirmDelete = async () => {
    setFailed(false);
    try {
      await deletePost(toDelete.id).unwrap();
    } catch {
      setFailed(true);
    }
    setToDelete(null);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div
          role="tablist"
          className="flex flex-1 gap-2 overflow-x-auto pb-1 min-w-0"
        >
          {VIEWS.map((view) => {
            const active = params.status === view;
            const count = data?.counts?.[view || "all"];
            return (
              <button
                key={view || "all"}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => update({ status: view })}
                className={`inline-flex items-center gap-2 h-10 px-4 shrink-0 rounded-full text-sm transition-colors ${
                  active
                    ? "bg-teal-accent text-page font-semibold"
                    : "border border-line/15 text-fg/75 hover:text-fg hover:bg-surface/[0.05]"
                }`}
              >
                {t(`blog.views.${view || "all"}`)}
                {count !== undefined && (
                  <span
                    className={`min-w-6 h-6 px-1.5 grid place-items-center rounded-full text-xs ${
                      active ? "bg-page/20" : "bg-surface/[0.08]"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <label className="relative block w-full md:w-64">
          <span className="sr-only">{t("blog.searchPlaceholder")}</span>
          <Search
            size={18}
            className="absolute top-1/2 -translate-y-1/2 start-3.5 text-muted pointer-events-none"
          />
          <input
            type="search"
            value={search.value}
            onChange={search.onChange}
            placeholder={t("blog.searchPlaceholder")}
            className={`${ADMIN_INPUT} ps-10`}
          />
        </label>
        <Can permission={P.blog.create}>
          <Link to="new" className={`${ADMIN_BUTTON} max-md:w-full`}>
            <Plus size={18} />
            {t("blog.newPost")}
          </Link>
        </Can>
      </div>

      {failed && (
        <p
          role="alert"
          className="mt-3 text-sm text-red-400 light:text-red-600"
        >
          {t("common.actionFailed")}
        </p>
      )}

      <div className="mt-5">
        {isError && !data ? (
          <div className={ADMIN_CARD}>
            <AdminMessage
              icon={AlertCircle}
              title={t("common.loadFailed")}
              action={
                <button
                  type="button"
                  className={ADMIN_BUTTON}
                  onClick={refetch}
                >
                  {t("common.retry")}
                </button>
              }
            />
          </div>
        ) : isLoading ? (
          <div
            className={`${ADMIN_CARD} p-4`}
            role="status"
            aria-label={t("common.loading")}
          >
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="h-16 my-2 rounded-lg bg-surface/[0.06] animate-pulse"
              />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <div className={ADMIN_CARD}>
            <AdminMessage icon={FileText} title={t("blog.empty")} />
          </div>
        ) : (
          <ul
            className={`${ADMIN_CARD_RICH} overflow-hidden transition-opacity ${
              isFetching ? "opacity-60" : ""
            }`}
          >
            {data.items.map((post) => (
              <li
                key={post.id}
                className="flex items-center gap-4 border-b border-line/[0.06] px-4 py-3 last:border-0"
              >
                {/* Green bar for a published post, amber for a draft. */}
                <span
                  aria-hidden="true"
                  className={`h-14 w-1 shrink-0 rounded-full ${STATUS_BARS[post.status]}`}
                />
                <Link
                  to={post.id}
                  state={{ listSearch: location.search }}
                  className="grid h-14 w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-surface/[0.06] max-sm:hidden"
                >
                  {post.image ? (
                    <img
                      src={post.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageOff size={18} className="text-muted" />
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    to={post.id}
                    state={{ listSearch: location.search }}
                    className="line-clamp-2 font-medium text-fg hover:text-teal-accent"
                  >
                    {localTitle(post, i18n.language) || t("blog.untitled")}
                  </Link>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                    <span
                      className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium ${STATUS_TONES[post.status]}`}
                    >
                      {t(`blog.status.${post.status}`)}
                    </span>
                    <span>
                      {post.status === "published" && post.publishedAt
                        ? formatDate(post.publishedAt, i18n.language)
                        : t("blog.updated", {
                            date: formatDate(post.updatedAt, i18n.language),
                          })}
                    </span>
                    {can(P.comments.view) ? (
                      <Link
                        to={`${adminPath("comments")}?post=${post.id}`}
                        className={`${COMMENTS_CHIP} hover:bg-sky-400/25`}
                      >
                        <MessageSquare size={13} />
                        {t("blog.comments", { count: post.commentCount })}
                      </Link>
                    ) : (
                      <span className={COMMENTS_CHIP}>
                        <MessageSquare size={13} />
                        {t("blog.comments", { count: post.commentCount })}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {post.status === "published" && (
                    <a
                      href={`/blog/${post.id}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={t("blog.viewOnSite")}
                      title={t("blog.viewOnSite")}
                      className="grid h-9 w-9 place-items-center rounded-lg text-fg/70 hover:bg-surface/[0.06] hover:text-fg"
                    >
                      <ExternalLink size={17} />
                    </a>
                  )}
                  <Link
                    to={post.id}
                    state={{ listSearch: location.search }}
                    className="h-9 px-3 inline-flex items-center rounded-lg text-sm text-teal-accent hover:bg-teal-accent/10"
                  >
                    {can(P.blog.update) ? t("blog.edit") : t("blog.view")}
                  </Link>
                  <Can permission={P.blog.delete}>
                    <button
                      type="button"
                      onClick={() => setToDelete(post)}
                      aria-label={t("blog.deletePost")}
                      title={t("blog.deletePost")}
                      className="grid h-9 w-9 place-items-center rounded-lg text-rose-400 light:text-rose-700 hover:bg-rose-500/10"
                    >
                      <Trash2 size={17} />
                    </button>
                  </Can>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Can permission={P.blog.delete}>
        <ConfirmDialog
          open={Boolean(toDelete)}
          title={t("blog.deleteTitle")}
          body={t("blog.deleteBody")}
          confirmLabel={t("common.delete")}
          busy={isDeleting}
          onConfirm={confirmDelete}
          onClose={() => setToDelete(null)}
        />
      </Can>
    </>
  );
}
