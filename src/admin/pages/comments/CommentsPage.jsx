import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  Ban,
  Check,
  CheckCircle2,
  Globe,
  MessageSquare,
  Search,
  Trash2,
  Undo2,
} from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import Select from "../../components/Select.jsx";
import Pagination from "../../components/Pagination.jsx";
import { ADMIN_BUTTON, ADMIN_CARD, ADMIN_INPUT } from "../../components/ui.js";
import {
  useGetCommentsQuery,
  useGetPostsQuery,
  useModerateCommentsMutation,
} from "../../api/blogApi.js";
import useCan from "../../hooks/useCan.js";
import useUrlFilters, { useSearchBox } from "../../hooks/useUrlFilters.js";
import { adminPath } from "../../navigation.js";
import { P } from "../../permissions.js";
import { localTitle } from "../../utils/blog.js";
import { formatShortDateTime } from "../../utils/format.js";
import { initials } from "../../utils/people.js";

const PAGE_SIZE = 20;
const VIEWS = ["pending", "approved", "spam"];

// What can be done to a comment from each tab ("delete" is added for staff
// with comments.delete).
const ACTIONS_BY_VIEW = {
  pending: [
    { action: "approve", label: "approve", icon: Check },
    { action: "spam", label: "spam", icon: Ban },
  ],
  approved: [
    { action: "pending", label: "unapprove", icon: Undo2 },
    { action: "spam", label: "spam", icon: Ban },
  ],
  spam: [{ action: "pending", label: "notSpam", icon: Undo2 }],
};

// Only real web addresses become links: the website comes from a public
// form, and a "javascript:" address must never be clickable.
const isWebLink = (url) => /^https?:\/\//i.test(url ?? "");

// Reader comments from the blog's open form, to approve, mark as spam or
// delete, one at a time or several at once.
export default function CommentsPage() {
  const { t, i18n } = useTranslation("admin");
  const can = useCan();
  const { get, update } = useUrlFilters();
  const params = {
    status: get("status") || "pending",
    q: get("q"),
    post: get("post"),
    page: Number(get("page")) || 1,
    pageSize: PAGE_SIZE,
  };
  const search = useSearchBox(params.q, (q) => update({ q }));
  const { data, isLoading, isFetching, isError, refetch } =
    useGetCommentsQuery(params);
  const { data: posts } = useGetPostsQuery({}, { skip: !can(P.blog.view) });
  const [moderate, { isLoading: isWorking }] = useModerateCommentsMutation();

  const canUpdate = can(P.comments.update);
  const canDelete = can(P.comments.delete);
  const actions = canUpdate ? ACTIONS_BY_VIEW[params.status] : [];
  const selectable = canUpdate || canDelete;

  // The selection belongs to one list: changing tab, filter or page clears it.
  const listKey = JSON.stringify(params);
  const [selection, setSelection] = useState({ key: listKey, ids: [] });
  const selected = selection.key === listKey ? selection.ids : [];
  const setSelected = (ids) => setSelection({ key: listKey, ids });

  const [notice, setNotice] = useState(null); // { ok, text }
  const [toDelete, setToDelete] = useState(null); // [ids]

  const run = async (ids, action) => {
    setNotice(null);
    try {
      const { updated } = await moderate({ ids, action }).unwrap();
      setSelected([]);
      setNotice({ ok: true, text: t("comments.done", { count: updated }) });
    } catch {
      setNotice({ ok: false, text: t("common.actionFailed") });
    }
  };

  const items = data?.items ?? [];
  const allSelected = items.length > 0 && selected.length === items.length;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div
          role="tablist"
          className="flex flex-1 gap-2 overflow-x-auto pb-1 min-w-0"
        >
          {VIEWS.map((view) => {
            const active = params.status === view;
            const count = data?.counts?.[view];
            return (
              <button
                key={view}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() =>
                  update({ status: view === "pending" ? "" : view })
                }
                className={`inline-flex items-center gap-2 h-10 px-4 shrink-0 rounded-full text-sm transition-colors ${
                  active
                    ? "bg-teal-accent text-page font-semibold"
                    : "border border-line/15 text-fg/75 hover:text-fg hover:bg-surface/[0.05]"
                }`}
              >
                {t(`comments.views.${view}`)}
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
        <Select
          value={params.post}
          onChange={(post) => update({ post })}
          options={[
            { value: "", label: t("comments.allPosts") },
            ...(posts?.items ?? []).map((post) => ({
              value: post.id,
              label: localTitle(post, i18n.language),
            })),
          ]}
          aria-label={t("comments.allPosts")}
          wrapperClassName="w-full md:w-60"
        />
        <label className="relative block w-full md:w-64">
          <span className="sr-only">{t("comments.searchPlaceholder")}</span>
          <Search
            size={18}
            className="absolute top-1/2 -translate-y-1/2 start-3.5 text-muted pointer-events-none"
          />
          <input
            type="search"
            value={search.value}
            onChange={search.onChange}
            placeholder={t("comments.searchPlaceholder")}
            className={`${ADMIN_INPUT} ps-10`}
          />
        </label>
      </div>

      {notice && (
        <p
          role={notice.ok ? "status" : "alert"}
          className={`mt-4 flex items-center gap-2 text-sm ${
            notice.ok
              ? "text-emerald-400 light:text-emerald-700"
              : "text-red-400 light:text-red-600"
          }`}
        >
          {notice.ok && <CheckCircle2 size={16} />}
          {notice.text}
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
                className="h-24 my-2 rounded-lg bg-surface/[0.06] animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className={ADMIN_CARD}>
            <AdminMessage icon={MessageSquare} title={t("comments.empty")} />
          </div>
        ) : (
          <div
            className={`transition-opacity ${isFetching ? "opacity-60" : ""}`}
          >
            {/* Select-all and the actions for the selection */}
            {selectable && (
              <div className="mb-3 flex min-h-11 flex-wrap items-center gap-3 rounded-xl border border-line/10 px-4 py-2">
                <label className="flex items-center gap-2.5 text-sm text-fg/80">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(event) =>
                      setSelected(
                        event.target.checked ? items.map((c) => c.id) : []
                      )
                    }
                    className="h-[18px] w-[18px] accent-[rgb(var(--accent))]"
                  />
                  {selected.length > 0
                    ? t("comments.selected", { count: selected.length })
                    : t("comments.selectAll")}
                </label>
                {selected.length > 0 && (
                  <div className="ms-auto flex flex-wrap gap-2">
                    {actions.map(({ action, label, icon: Icon }) => (
                      <button
                        key={action}
                        type="button"
                        disabled={isWorking}
                        onClick={() => run(selected, action)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line/15 px-3 text-sm text-fg/85 hover:bg-surface/[0.06]"
                      >
                        <Icon size={15} />
                        {t(`comments.actions.${label}`)}
                      </button>
                    ))}
                    {canDelete && (
                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() => setToDelete(selected)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-500/30 px-3 text-sm text-rose-400 light:text-rose-700 hover:bg-rose-500/10"
                      >
                        <Trash2 size={15} />
                        {t("comments.actions.delete")}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            <ul className={`${ADMIN_CARD} overflow-hidden`}>
              {items.map((comment) => (
                <li
                  key={comment.id}
                  className={`flex gap-3 border-b border-line/[0.06] px-4 py-4 last:border-0 ${
                    selected.includes(comment.id) ? "bg-teal-accent/[0.06]" : ""
                  }`}
                >
                  {selectable && (
                    <input
                      type="checkbox"
                      checked={selected.includes(comment.id)}
                      onChange={(event) =>
                        setSelected(
                          event.target.checked
                            ? [...selected, comment.id]
                            : selected.filter((id) => id !== comment.id)
                        )
                      }
                      aria-label={t("comments.select", { name: comment.name })}
                      className="mt-2.5 h-[18px] w-[18px] shrink-0 accent-[rgb(var(--accent))]"
                    />
                  )}
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-accent/15 text-sm font-semibold text-teal-accent">
                    {initials(comment.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                      <span className="font-medium text-fg" dir="auto">
                        {comment.name}
                      </span>
                      <a
                        href={`mailto:${comment.email}`}
                        dir="ltr"
                        className="truncate text-sm text-muted hover:text-teal-accent"
                      >
                        {comment.email}
                      </a>
                      {isWebLink(comment.website) && (
                        <a
                          href={comment.website}
                          target="_blank"
                          rel="noreferrer nofollow ugc"
                          dir="ltr"
                          className="inline-flex items-center gap-1 truncate text-sm text-muted hover:text-teal-accent"
                        >
                          <Globe size={13} />
                          {comment.website.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                      <span className="ms-auto text-xs text-muted tabular-nums">
                        {formatShortDateTime(comment.createdAt, i18n.language)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {t("comments.onPost")}{" "}
                      <Link
                        to={`${adminPath("blog")}/${comment.postId}`}
                        className="text-fg/75 hover:text-teal-accent"
                      >
                        {comment.postTitle}
                      </Link>
                    </p>
                    <p
                      dir="auto"
                      className="mt-2 whitespace-pre-wrap break-words text-[15px] leading-7 text-fg/90"
                    >
                      {comment.comment}
                    </p>
                    {(actions.length > 0 || canDelete) && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {actions.map(({ action, label, icon: Icon }) => (
                          <button
                            key={action}
                            type="button"
                            disabled={isWorking}
                            onClick={() => run([comment.id], action)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm text-teal-accent hover:bg-teal-accent/10 disabled:opacity-50"
                          >
                            <Icon size={14} />
                            {t(`comments.actions.${label}`)}
                          </button>
                        ))}
                        {canDelete && (
                          <button
                            type="button"
                            disabled={isWorking}
                            onClick={() => setToDelete([comment.id])}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm text-rose-400 light:text-rose-700 hover:bg-rose-500/10 disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            {t("comments.actions.delete")}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <Pagination
              page={data.page}
              pageSize={data.pageSize}
              total={data.total}
              onPageChange={(page) => update({ page: String(page) })}
            />
          </div>
        )}
      </div>

      {canDelete && (
        <ConfirmDialog
          open={Boolean(toDelete)}
          title={t("comments.actions.deleteTitle", {
            count: toDelete?.length ?? 0,
          })}
          body={t("comments.actions.deleteBody")}
          confirmLabel={t("common.delete")}
          busy={isWorking}
          onConfirm={async () => {
            await run(toDelete, "delete");
            setToDelete(null);
          }}
          onClose={() => setToDelete(null)}
        />
      )}
    </>
  );
}
