import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, MailCheck } from "lucide-react";
import { ADMIN_CARD_RICH } from "../../components/ui.js";
import { useGetMessageStatsQuery } from "../../api/messagesApi.js";
import { adminPath } from "../../navigation.js";
import { formatShortDateTime } from "../../utils/format.js";

// The Overview's messages part: how many are unread, and the latest ones.
export default function MessagesSummary() {
  const { t, i18n } = useTranslation("admin");
  const { data, isLoading } = useGetMessageStatsQuery();

  return (
    <section className={`${ADMIN_CARD_RICH} p-5 min-w-0`}>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-semibold text-fg">
          <Mail size={18} className="shrink-0 text-teal-accent" />
          {t("overview.unreadMessages")}
          {data?.unread > 0 && (
            <span className="min-w-6 h-6 px-1.5 grid place-items-center rounded-full bg-teal-accent text-xs font-semibold text-page">
              {data.unread}
            </span>
          )}
        </h2>
        <Link
          to={`${adminPath("messages")}?view=unread`}
          className="text-sm text-teal-accent hover:underline"
        >
          {t("overview.viewAll")}
        </Link>
      </div>

      {isLoading ? (
        Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-12 my-2 rounded-lg bg-surface/[0.06] animate-pulse"
          />
        ))
      ) : !data?.unread ? (
        <p className="flex items-center justify-center gap-2 py-6 text-muted">
          <MailCheck size={18} />
          {t("overview.noUnread")}
        </p>
      ) : (
        <ul className="-mx-2">
          {data.latestUnread.map((message) => (
            <li key={message.id}>
              <Link
                to={`${adminPath("messages")}/${message.id}`}
                className="flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors hover:bg-surface/[0.04]"
              >
                <Mail
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 text-teal-accent"
                />
                <span className="flex-1 min-w-0">
                  <span className="flex items-baseline gap-3">
                    <span className="truncate font-medium text-fg">
                      {message.name}
                    </span>
                    <span className="ms-auto shrink-0 text-xs text-muted tabular-nums">
                      {formatShortDateTime(message.createdAt, i18n.language)}
                    </span>
                  </span>
                  <span
                    dir="auto"
                    className="block truncate text-sm text-muted"
                  >
                    {message.subject || message.message}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
