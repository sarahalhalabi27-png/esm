import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  CalendarClock,
  Car,
  CircleDot,
  Clock,
  ListChecks,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Route,
  SearchX,
  StickyNote,
  Tag,
  Trash2,
  User,
  Users,
} from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Avatar from "../../components/Avatar.jsx";
import Can from "../../components/Can.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import EmailLink from "../../components/EmailLink.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_BUTTON_GHOST,
  ADMIN_CARD,
  ADMIN_CARD_RICH,
  STATUS_BARS,
} from "../../components/ui.js";
import {
  useDeleteBookingMutation,
  useGetBookingQuery,
  useUpdateBookingMutation,
} from "../../api/bookingsApi.js";
import { adminPath } from "../../navigation.js";
import { P } from "../../permissions.js";
import { formatDateAndTime, formatDateTime } from "../../utils/format.js";

// The next steps offered for each status; the first is the main one.
const STATUS_ACTIONS = {
  new: [
    { label: "confirm", status: "confirmed" },
    { label: "cancel", status: "cancelled" },
  ],
  confirmed: [
    { label: "complete", status: "completed" },
    { label: "cancel", status: "cancelled" },
  ],
  cancelled: [{ label: "reopen", status: "new" }],
  completed: [],
};

// Service-specific fields whose values are keys (translated via
// bookings.values.*); the others are shown as they are.
const TRANSLATED_DETAILS = ["transferType", "duration", "bookingDuration"];

export default function BookingDetailsPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation("admin");
  const navigate = useNavigate();
  const location = useLocation();
  const backTo = `${adminPath("bookings")}${location.state?.listSearch ?? ""}`;

  const {
    data: booking,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBookingQuery(id);
  const [updateBooking, { isLoading: isUpdating, originalArgs }] =
    useUpdateBookingMutation();
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionFailed, setActionFailed] = useState(false);

  const changeStatus = async (status) => {
    setActionFailed(false);
    try {
      await updateBooking({ id, status }).unwrap();
    } catch {
      setActionFailed(true);
    }
  };

  const remove = async () => {
    setActionFailed(false);
    try {
      await deleteBooking(id).unwrap();
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
      {t("bookings.backToList")}
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
            title={missing ? t("bookings.notFound") : t("common.loadFailed")}
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

  const lang = i18n.language;
  const value = (key) => t(`bookings.values.${key}`, { defaultValue: key });
  const actions = STATUS_ACTIONS[booking.status] ?? [];
  const phoneDigits = booking.customer.phone.replace(/\D/g, "");

  // The route as a short timeline: where it starts and, when there is one,
  // where it ends, each with its date and time.
  const stops = [
    {
      key: "pickupLocation",
      icon: CircleDot,
      place: booking.pickup.location,
      at: formatDateAndTime(booking.pickup.date, booking.pickup.time, lang),
    },
    {
      key: "dropOffLocation",
      icon: MapPin,
      place: booking.dropOff.location,
      at: formatDateAndTime(booking.dropOff.date, booking.dropOff.time, lang),
    },
  ].filter((stop) => stop.place);

  const facts = [
    ["service", t(`bookings.service.${booking.service}`), Briefcase],
    ["car", booking.car?.name, Car],
    ["carType", booking.carType && value(booking.carType), Tag],
    ["passengers", booking.passengers, Users],
  ];

  const detailRows = Object.entries(booking.details ?? {}).map(([key, raw]) => [
    key,
    Array.isArray(raw)
      ? raw.join(" → ")
      : TRANSLATED_DETAILS.includes(key)
        ? value(raw)
        : raw,
  ]);

  return (
    <>
      {backLink}

      {/* Heading + actions */}
      <div
        className={`${ADMIN_CARD_RICH} relative mt-4 overflow-hidden p-5 ps-7 md:p-6 md:ps-8`}
      >
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 start-0 w-1.5 ${STATUS_BARS[booking.status] ?? "bg-line/20"}`}
        />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold text-fg">
                {booking.reference}
              </h2>
              <StatusBadge status={booking.status} />
            </div>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
              <Clock size={14} className="shrink-0" />
              {t("bookings.createdAt", {
                date: formatDateTime(booking.createdAt, lang),
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Can permission={P.bookings.update}>
              {actions.map((action, index) => {
                const busy =
                  isUpdating && originalArgs?.status === action.status;
                return (
                  <button
                    key={action.status}
                    type="button"
                    disabled={isUpdating}
                    aria-busy={isUpdating}
                    onClick={() => changeStatus(action.status)}
                    className={
                      index === 0 ? ADMIN_BUTTON : `${ADMIN_BUTTON_GHOST} h-11`
                    }
                  >
                    {busy && <Loader2 size={16} className="animate-spin" />}
                    {t(`bookings.actions.${action.label}`)}
                  </button>
                );
              })}
            </Can>
            <Can permission={P.bookings.delete}>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-rose-500/40 bg-rose-500/10 px-4 text-[15px] font-medium text-rose-300 transition-colors hover:bg-rose-500/20 light:text-rose-700"
              >
                <Trash2 size={18} />
                {t("bookings.actions.delete")}
              </button>
            </Can>
          </div>
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

      <div className="mt-4 grid gap-4 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Section icon={Route} title={t("bookings.sections.trip")}>
            <ol>
              {stops.map((stop, index) => (
                <li key={stop.key} className="flex gap-4">
                  <span className="flex flex-col items-center">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-accent/15 text-teal-accent">
                      <stop.icon size={18} />
                    </span>
                    {index < stops.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="my-1 w-px flex-1 border-s border-dashed border-line/25"
                      />
                    )}
                  </span>
                  <div
                    className={`min-w-0 flex-1 ${index < stops.length - 1 ? "pb-5" : ""}`}
                  >
                    <p className="text-xs text-muted">
                      {t(`bookings.fields.${stop.key}`)}
                    </p>
                    <p className="mt-0.5 text-[17px] font-medium text-fg">
                      {stop.place}
                    </p>
                    {stop.at && (
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-fg/75">
                        <CalendarClock
                          size={14}
                          className="shrink-0 text-muted"
                        />
                        {stop.at}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <Tiles rows={facts} className="mt-5 border-t border-line/10 pt-5" />
          </Section>

          {detailRows.length > 0 && (
            <Section icon={ListChecks} title={t("bookings.sections.details")}>
              <Tiles rows={detailRows} />
            </Section>
          )}

          <Section icon={StickyNote} title={t("bookings.sections.notes")}>
            <p
              dir="auto"
              className={booking.notes ? "text-fg/85" : "text-muted"}
            >
              {booking.notes || t("bookings.noNotes")}
            </p>
          </Section>
        </div>

        <Section icon={User} title={t("bookings.sections.customer")}>
          <div className="flex items-center gap-4">
            <Avatar name={booking.customer.name} size="lg" />
            <p className="min-w-0 break-words text-lg font-semibold text-fg">
              {booking.customer.name}
            </p>
          </div>

          <ul className="mt-5 flex flex-col gap-3">
            <ContactRow icon={Mail} label={t("bookings.fields.email")}>
              <EmailLink email={booking.customer.email} />
            </ContactRow>
            <ContactRow icon={Phone} label={t("bookings.fields.phone")}>
              <a
                href={`tel:${booking.customer.phone}`}
                dir="ltr"
                className="text-teal-accent hover:underline"
              >
                {booking.customer.phone}
              </a>
            </ContactRow>
          </ul>

          <a
            href={`https://wa.me/${phoneDigits}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-emerald-500/30 bg-emerald-500/10 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20 light:text-emerald-700"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </Section>
      </div>

      <Can permission={P.bookings.delete}>
        <ConfirmDialog
          open={confirmDelete}
          title={t("bookings.actions.deleteTitle", {
            reference: booking.reference,
          })}
          body={t("bookings.actions.deleteBody")}
          confirmLabel={t("common.delete")}
          busy={isDeleting}
          onConfirm={remove}
          onClose={() => setConfirmDelete(false)}
        />
      </Can>
    </>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <section className={`${ADMIN_CARD_RICH} p-5`}>
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

// Label / value boxes, with an icon when a row brings one; empty values are
// left out.
function Tiles({ rows, className = "" }) {
  const { t } = useTranslation("admin");
  return (
    <dl className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      {rows
        .filter(([, rowValue]) => rowValue)
        .map(([key, rowValue, Icon]) => (
          <div
            key={key}
            className="flex min-w-0 items-center gap-3 rounded-xl border border-line/[0.07] bg-surface/[0.03] p-3"
          >
            {Icon && (
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface/[0.06] text-muted">
                <Icon size={17} />
              </span>
            )}
            <div className="min-w-0">
              <dt className="text-xs text-muted">
                {t(`bookings.fields.${key}`)}
              </dt>
              <dd className="mt-0.5 break-words text-[15px] text-fg">
                {rowValue}
              </dd>
            </div>
          </div>
        ))}
    </dl>
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
