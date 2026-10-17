import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Clock,
  CornerUpLeft,
  Loader2,
  Mail,
  MailOpen,
  MessageCircle,
  MessageSquareText,
  Phone,
  SearchX,
  Trash2,
  User,
} from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Avatar from "../../components/Avatar.jsx";
import Can from "../../components/Can.jsx";
import EmailLink from "../../components/EmailLink.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_BUTTON_GHOST,
  ADMIN_CARD,
  ADMIN_CARD_RICH,
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

      {/* Heading card; its side bar is amber while unread, green once replied. */}
      <div
        className={`${ADMIN_CARD_RICH} relative mt-4 overflow-hidden p-5 ps-7 md:p-6 md:ps-8`}
      >
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 start-0 w-1.5 ${
            message.replied
              ? "bg-emerald-400 light:bg-emerald-500"
              : !message.read
                ? "bg-amber-400 light:bg-amber-500"
                : "bg-teal-accent"
          }`}
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 dir="auto" className="text-2xl font-semibold text-fg">
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
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
            <Clock size={14} className="shrink-0" />
            {t("messages.receivedAt", {
              date: formatDateTime(message.createdAt, i18n.language),
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-line/10 pt-5">
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
            {/* One button that flips between the two states. */}
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => change({ read: !message.read })}
              className={ghost}
            >
              {message.read ? <Mail size={16} /> : <MailOpen size={16} />}
              {message.read
                ? t("messages.actions.markUnread")
                : t("messages.actions.markRead")}
            </button>
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
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-rose-500/40 bg-rose-500/10 px-4 text-[15px] font-medium text-rose-300 transition-colors hover:bg-rose-500/20 light:text-rose-700"
            >
              <Trash2 size={18} />
              {t("messages.actions.delete")}
            </button>
          </Can>
        </div>
      </div>

      {actionFailed && (
        <p
          role="alert"
          className="mt-3 text-sm text-red-400 light:text-red-600"
        >
          {t("common.actionFailed")}
        </p>
      )}

      {/* Both cards stretch to the same height and share one heading style. */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Section
          icon={MessageSquareText}
          title={t("messages.message")}
          className="lg:col-span-2"
        >
          <p
            dir="auto"
            className="whitespace-pre-wrap break-words text-[16px] leading-8 text-fg/90"
          >
            {message.message}
          </p>
        </Section>

        <Section icon={User} title={t("messages.from")}>
          <div className="flex items-center gap-4">
            <Avatar name={message.name} size="lg" />
            <p className="min-w-0 break-words text-lg font-semibold text-fg">
              {message.name}
            </p>
          </div>
          <ul className="mt-5 flex flex-col gap-3">
            <ContactRow icon={Mail} label={t("messages.fields.email")}>
              <EmailLink email={message.email} href={mailto} />
            </ContactRow>
            {message.phone && (
              <ContactRow icon={Phone} label={t("messages.fields.phone")}>
                <a
                  href={`tel:${message.phone}`}
                  dir="ltr"
                  className="text-teal-accent hover:underline"
                >
                  {message.phone}
                </a>
              </ContactRow>
            )}
          </ul>
          {message.phone && (
            <a
              href={`https://wa.me/${phoneDigits}`}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-emerald-500/30 bg-emerald-500/10 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20 light:text-emerald-700"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          )}
        </Section>
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

function Section({ icon: Icon, title, className = "", children }) {
  return (
    <section className={`${ADMIN_CARD_RICH} p-5 min-w-0 ${className}`}>
      <h3 className="mb-5 flex items-center gap-3 font-semibold text-fg">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-accent/15 text-teal-accent">
          <Icon size={18} />
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function ContactRow({ icon: Icon, label, children }) {
  return (
    <li className="flex min-w-0 items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface/[0.06] text-muted">
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <div className="break-all text-[15px]">{children}</div>
      </div>
    </li>
  );
}
