import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertCircle, CornerUpLeft, Inbox, Search } from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Avatar from "../../components/Avatar.jsx";
import Pagination from "../../components/Pagination.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_CARD,
  ADMIN_CARD_RICH,
  ADMIN_INPUT,
} from "../../components/ui.js";
import { useGetMessagesQuery } from "../../api/messagesApi.js";
import useUrlFilters, { useSearchBox } from "../../hooks/useUrlFilters.js";
import { formatShortDateTime } from "../../utils/format.js";

const PAGE_SIZE = 15;
const VIEWS = [
  { value: "", id: "inbox" },
  { value: "unread", id: "unread" },
  { value: "archived", id: "archived" },
];

// Contact Us messages, newest first: inbox / unread / archived tabs and a
// search, kept in the URL. Unread messages are bold with a dot.
export default function MessagesListPage() {
  const { t, i18n } = useTranslation("admin");
  const location = useLocation();
  const { get, update } = useUrlFilters();
  const params = {
    view: get("view"),
    q: get("q"),
    page: Number(get("page")) || 1,
    pageSize: PAGE_SIZE,
  };
  const { data, isLoading, isFetching, isError, refetch } =
    useGetMessagesQuery(params);
  const search = useSearchBox(params.q, (q) => update({ q }));

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div
          role="tablist"
          className="flex flex-1 gap-2 overflow-x-auto pb-1 min-w-0"
        >
          {VIEWS.map((view) => {
            const active = params.view === view.value;
            const count = data?.counts?.[view.id];
            return (
              <button
                key={view.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => update({ view: view.value })}
                className={`inline-flex items-center gap-2 h-10 px-4 shrink-0 rounded-full text-sm transition-colors ${
                  active
                    ? "bg-teal-accent text-page font-semibold"
                    : "border border-line/15 text-fg/75 hover:text-fg hover:bg-surface/[0.05]"
                }`}
              >
                {t(`messages.views.${view.id}`)}
                {count !== undefined && (
                  <span
                    className={`min-w-6 h-6 px-1.5 grid place-items-center rounded-full text-xs ${
                      active
                        ? "bg-page/20"
                        : view.id === "unread" && count > 0
                          ? "bg-amber-400/20 text-amber-300 light:bg-amber-500/20 light:text-amber-700"
                          : "bg-surface/[0.08]"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <label className="relative block w-full md:w-80">
          <span className="sr-only">{t("messages.searchPlaceholder")}</span>
          <Search
            size={18}
            className="absolute top-1/2 -translate-y-1/2 start-3.5 text-muted pointer-events-none"
          />
          <input
            type="search"
            value={search.value}
            onChange={search.onChange}
            placeholder={t("messages.searchPlaceholder")}
            className={`${ADMIN_INPUT} ps-10`}
          />
        </label>
      </div>

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
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-14 my-2 rounded-lg bg-surface/[0.06] animate-pulse"
              />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <div className={ADMIN_CARD}>
            <AdminMessage icon={Inbox} title={t("messages.empty")} />
          </div>
        ) : (
          <div
            className={`transition-opacity ${isFetching ? "opacity-60" : ""}`}
          >
            <ul className={`${ADMIN_CARD_RICH} overflow-hidden`}>
              {data.items.map((message) => (
                <li
                  key={message.id}
                  className="border-b border-line/[0.06] last:border-0"
                >
                  <Link
                    to={message.id}
                    state={{ listSearch: location.search }}
                    className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface/[0.05] ${
                      message.read ? "" : "bg-teal-accent/[0.05]"
                    }`}
                  >
                    {/* Amber bar for unread, green once replied, faint when read. */}
                    <span
                      aria-hidden="true"
                      className={`h-11 w-1 shrink-0 rounded-full ${
                        !message.read
                          ? "bg-amber-400 light:bg-amber-500"
                          : message.replied
                            ? "bg-emerald-400 light:bg-emerald-500"
                            : "bg-line/15"
                      }`}
                    />
                    {!message.read && (
                      <span className="sr-only">{t("messages.unread")}</span>
                    )}
                    <Avatar
                      name={message.name}
                      className={message.read ? "opacity-60" : ""}
                    />
                    <span className="flex-1 min-w-0">
                      <span className="flex items-baseline gap-3">
                        <span
                          className={`truncate ${
                            message.read
                              ? "text-fg/85"
                              : "font-semibold text-fg"
                          }`}
                        >
                          {message.name}
                        </span>
                        {message.replied && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-300 light:bg-emerald-500/15 light:text-emerald-700">
                            <CornerUpLeft size={12} />
                            {t("messages.replied")}
                          </span>
                        )}
                        <span className="ms-auto shrink-0 text-xs text-muted tabular-nums">
                          {formatShortDateTime(
                            message.createdAt,
                            i18n.language
                          )}
                        </span>
                      </span>
                      <span
                        dir="auto"
                        className={`mt-0.5 block truncate text-sm ${
                          message.read ? "text-fg/70" : "text-fg"
                        }`}
                      >
                        {message.subject || t("messages.noSubject")}
                      </span>
                      <span
                        dir="auto"
                        className="block truncate text-sm text-muted"
                      >
                        {message.message}
                      </span>
                    </span>
                  </Link>
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
    </>
  );
}
