import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  Archive,
  ArchiveRestore,
  ArrowLeft,
  CornerUpLeft,
  Loader2,
  Mail,
  MailOpen,
  MessageCircle,
  Phone,
  SearchX,
  Trash2,
} from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Can from "../../components/Can.jsx";
import EmailLink from "../../components/EmailLink.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_BUTTON_GHOST,
  ADMIN_CARD,
} from "../../components/ui.js";
import {
  useDeleteMessageMutation,
  useGetMessageQuery,
  useUpdateMessageMutation,
} from "../../api/messagesApi.js";
import useCan from "../../hooks/useCan.js";
import { adminPath } from "../../navigation.js";
import { P } from "../../permissions.js";
import { formatDateTime } from "../../utils/format.js";

// One message. Opening it marks it as read (for staff who may update
// messages); replying happens in the email app, then "Mark as replied".
export default function MessageDetailsPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation("admin");
  const navigate = useNavigate();
  const location = useLocation();
  const can = useCan();
  const backTo = `${adminPath("messages")}${location.state?.listSearch ?? ""}`;

  const {
    data: message,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMessageQuery(id);
  const [updateMessage, { isLoading: isUpdating }] = useUpdateMessageMutation();
  const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionFailed, setActionFailed] = useState(false);

  // Mark as read once, the first time it's opened unread. ("Mark as
  // unread" afterwards stays unread until the page is opened again.)
  const markedRead = useRef(false);
  const canUpdate = can(P.messages.update);
  useEffect(() => {
    if (message && !message.read && canUpdate && !markedRead.current) {
      markedRead.current = true;
      updateMessage({ id: message.id, read: true });
    }
  }, [message, canUpdate, updateMessage]);

  const change = async (changes) => {
    setActionFailed(false);
    try {
      await updateMessage({ id, ...changes }).unwrap();
    } catch {
      setActionFailed(true);
    }
  };

  const remove = async () => {
    try {
      await deleteMessage(id).unwrap();
      navigate(backTo, { replace: true });
    } catch {
      setConfirmDelete(false);
      setActionFailed(true);
    }
  };

  const backLink = (
    <Link
      to={backTo}
      className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg transition-colors"
    >
      <ArrowLeft size={16} className="rtl:-scale-x-100" />
      {t("messages.backToList")}
    </Link>
  );

  if (isLoading) {
    return (
      <>
        {backLink}
        <AdminMessage icon={Loader2} spin title={t("common.loading")} />
      </>
    );
  }

  if (isError) {
    const missing = error?.status === 404;
    return (
      <>
        {backLink}
        <div className={`${ADMIN_CARD} mt-4`}>
          <AdminMessage
            icon={missing ? SearchX : AlertCircle}
            title={missing ? t("messages.notFound") : t("common.loadFailed")}
            action={
              !missing && (
                <button
                  type="button"
                  className={ADMIN_BUTTON}
                  onClick={refetch}
                >
                  {t("common.retry")}
                </button>
              )
            }
          />
        </div>
      </>
    );
  }

  const replySubject = message.subject
    ? t("messages.replySubject", { subject: message.subject })
    : t("messages.replySubjectDefault");
  const mailto = `mailto:${message.email}?subject=${encodeURIComponent(replySubject)}`;
  const phoneDigits = message.phone.replace(/\D/g, "");
  const ghost = `${ADMIN_BUTTON_GHOST} h-11`;

  return (
    <>
      {backLink}

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 dir="auto" className="text-xl font-semibold text-fg">
              {message.subject || t("messages.noSubject")}
            </h2>
            {message.replied && (
              <span className="inline-flex items-center gap-1 h-7 px-3 rounded-full bg-emerald-400/15 text-[13px] font-medium text-emerald-300 light:text-emerald-800">
                <CornerUpLeft size={13} />
                {t("messages.replied")}
              </span>
            )}
            {message.archived && (
              <span className="inline-flex items-center h-7 px-3 rounded-full bg-surface/[0.08] text-[13px] font-medium text-muted">
                {t("messages.archivedBadge")}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">
            {t("messages.receivedAt", {
              date: formatDateTime(message.createdAt, i18n.language),
            })}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-2">
        <a href={mailto} className={ADMIN_BUTTON}>
          <Mail size={17} />
          {t("messages.actions.replyByEmail")}
        </a>
        <Can permission={P.messages.update}>
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => change({ replied: !message.replied })}
            className={ghost}
          >
            <CornerUpLeft size={16} />
            {message.replied
              ? t("messages.actions.markNotReplied")
              : t("messages.actions.markReplied")}
          </button>
          {message.read && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => change({ read: false })}
              className={ghost}
            >
              <MailOpen size={16} />
              {t("messages.actions.markUnread")}
            </button>
          )}
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => change({ archived: !message.archived })}
            className={ghost}
          >
            {message.archived ? (
              <ArchiveRestore size={16} />
            ) : (
              <Archive size={16} />
            )}
            {message.archived
              ? t("messages.actions.unarchive")
              : t("messages.actions.archive")}
          </button>
        </Can>
        <Can permission={P.messages.delete}>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            aria-label={t("messages.actions.delete")}
            title={t("messages.actions.delete")}
            className="grid place-items-center w-11 h-11 rounded-[10px] border border-rose-500/30 text-rose-400 light:text-rose-700 transition-colors hover:bg-rose-500/10"
          >
            <Trash2 size={18} />
          </button>
        </Can>
      </div>

      {actionFailed && (
        <p
          role="alert"
          className="mt-3 text-sm text-red-400 light:text-red-600"
        >
          {t("common.actionFailed")}
        </p>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-3 items-start">
        <section className={`${ADMIN_CARD} p-5 lg:col-span-2 min-w-0`}>
          <p
            dir="auto"
            className="whitespace-pre-wrap break-words text-[15px] leading-7 text-fg/90"
          >
            {message.message}
          </p>
        </section>

        <section className={`${ADMIN_CARD} p-5 min-w-0`}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
            {t("messages.from")}
          </h3>
          <p className="font-medium text-fg">{message.name}</p>
          <dl className="mt-4 flex flex-col gap-3 text-[15px]">
            <div>
              <dt className="text-xs text-muted">
                {t("messages.fields.email")}
              </dt>
              <dd className="mt-1">
                <EmailLink email={message.email} href={mailto} />
              </dd>
            </div>
            {message.phone && (
              <div>
                <dt className="text-xs text-muted">
                  {t("messages.fields.phone")}
                </dt>
                <dd className="mt-1 flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:${message.phone}`}
                    dir="ltr"
                    className="inline-flex items-center gap-1.5 text-teal-accent hover:underline"
                  >
                    <Phone size={14} />
                    {message.phone}
                  </a>
                  <a
                    href={`https://wa.me/${phoneDigits}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg"
                  >
                    <MessageCircle size={14} />
                    WhatsApp
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </section>
      </div>

      <Can permission={P.messages.delete}>
        <ConfirmDialog
          open={confirmDelete}
          title={t("messages.actions.deleteTitle", { name: message.name })}
          body={t("messages.actions.deleteBody")}
          confirmLabel={t("common.delete")}
          busy={isDeleting}
          onConfirm={remove}
          onClose={() => setConfirmDelete(false)}
        />
      </Can>
    </>
  );
}
