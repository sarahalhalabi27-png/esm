import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  MessageCircle,
  SearchX,
  Trash2,
} from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Can from "../../components/Can.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_BUTTON_GHOST,
  ADMIN_CARD,
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

  const tripRows = [
    ["service", t(`bookings.service.${booking.service}`)],
    ["pickupLocation", booking.pickup.location],
    [
      "pickupAt",
      formatDateAndTime(booking.pickup.date, booking.pickup.time, lang),
    ],
    ["dropOffLocation", booking.dropOff.location],
    [
      "dropOffAt",
      formatDateAndTime(booking.dropOff.date, booking.dropOff.time, lang),
    ],
    ["car", booking.car?.name],
    ["carType", booking.carType && value(booking.carType)],
    ["passengers", booking.passengers],
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
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-fg">
              {booking.reference}
            </h2>
            <StatusBadge status={booking.status} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {t("bookings.createdAt", {
              date: formatDateTime(booking.createdAt, lang),
            })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Can permission={P.bookings.update}>
            {actions.map((action, index) => {
              const busy = isUpdating && originalArgs?.status === action.status;
              return (
                <button
                  key={action.status}
                  type="button"
                  disabled={isUpdating}
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
              aria-label={t("bookings.actions.delete")}
              title={t("bookings.actions.delete")}
              className="grid place-items-center w-11 h-11 rounded-[10px] border border-rose-500/30 text-rose-400 light:text-rose-700 transition-colors hover:bg-rose-500/10"
            >
              <Trash2 size={18} />
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

      <div className="mt-6 grid gap-4 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Section title={t("bookings.sections.trip")}>
            <Rows rows={tripRows} />
          </Section>
          {detailRows.length > 0 && (
            <Section title={t("bookings.sections.details")}>
              <Rows rows={detailRows} />
            </Section>
          )}
          <Section title={t("bookings.sections.notes")}>
            <p className={booking.notes ? "text-fg/85" : "text-muted"}>
              {booking.notes || t("bookings.noNotes")}
            </p>
          </Section>
        </div>

        <Section title={t("bookings.sections.customer")}>
          <Rows
            rows={[
              ["name", booking.customer.name],
              [
                "email",
                <a
                  key="email"
                  href={`mailto:${booking.customer.email}`}
                  className="text-teal-accent hover:underline break-all"
                >
                  {booking.customer.email}
                </a>,
              ],
              [
                "phone",
                <a
                  key="phone"
                  href={`tel:${booking.customer.phone}`}
                  dir="ltr"
                  className="text-teal-accent hover:underline"
                >
                  {booking.customer.phone}
                </a>,
              ],
            ]}
          />
          <a
            href={`https://wa.me/${phoneDigits}`}
            target="_blank"
            rel="noreferrer"
            className={`${ADMIN_BUTTON_GHOST} mt-4 w-full`}
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

function Section({ title, children }) {
  return (
    <section className={`${ADMIN_CARD} p-5`}>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
        {title}
      </h3>
      {children}
    </section>
  );
}

// Label / value pairs; empty values are left out.
function Rows({ rows }) {
  const { t } = useTranslation("admin");
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {rows
        .filter(([, rowValue]) => rowValue)
        .map(([key, rowValue]) => (
          <div key={key} className="min-w-0">
            <dt className="text-xs text-muted">
              {t(`bookings.fields.${key}`)}
            </dt>
            <dd className="mt-1 text-[15px] text-fg">{rowValue}</dd>
          </div>
        ))}
    </dl>
  );
}
