import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Ban,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  SearchX,
  ShieldAlert,
  Trash2,
  UserCheck,
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
} from "../../components/ui.js";
import {
  useDeleteCustomerMutation,
  useGetCustomerQuery,
  useUpdateCustomerMutation,
} from "../../api/customersApi.js";
import { useGetBookingsQuery } from "../../api/bookingsApi.js";
import useCan from "../../hooks/useCan.js";
import { adminPath } from "../../navigation.js";
import { P } from "../../permissions.js";
import { formatDate, formatDateAndTime } from "../../utils/format.js";
import { CUSTOMER_STATUS_TONES } from "../../utils/people.js";

const STATS = ["total", "upcoming", "completed", "cancelled"];

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation("admin");
  const navigate = useNavigate();
  const location = useLocation();
  const can = useCan();
  const backTo = `${adminPath("customers")}${location.state?.listSearch ?? ""}`;

  const {
    data: customer,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCustomerQuery(id);
  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();
  const [confirm, setConfirm] = useState(null); // "block" | "delete"
  const [failed, setFailed] = useState(false);

  const backLink = (
    <Link
      to={backTo}
      className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg transition-colors"
    >
      <ArrowLeft size={16} className="rtl:-scale-x-100" />
      {t("customers.backToList")}
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
            title={missing ? t("customers.notFound") : t("common.loadFailed")}
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

  const blocked = customer.status === "blocked";
  const phoneDigits = customer.phone.replace(/\D/g, "");

  const setStatus = async (status) => {
    setFailed(false);
    try {
      await updateCustomer({ id, status }).unwrap();
    } catch {
      setFailed(true);
    }
    setConfirm(null);
  };

  const remove = async () => {
    try {
      await deleteCustomer(id).unwrap();
      navigate(backTo, { replace: true });
    } catch {
      setFailed(true);
      setConfirm(null);
    }
  };

  return (
    <>
      {backLink}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar name={customer.name} photo={customer.photo} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-fg" dir="auto">
                {customer.name}
              </h2>
              <span
                className={`inline-flex h-7 items-center rounded-full px-3 text-[13px] font-medium ${CUSTOMER_STATUS_TONES[customer.status]}`}
              >
                {t(`customers.status.${customer.status}`)}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              {t("customers.joined", {
                date: formatDate(customer.createdAt, i18n.language),
              })}
              {customer.lastLoginAt &&
                ` · ${t("customers.lastLogin", {
                  date: formatDate(customer.lastLoginAt, i18n.language),
                })}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Can permission={P.customers.update}>
            {blocked ? (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => setStatus("active")}
                className={`${ADMIN_BUTTON_GHOST} h-11`}
              >
                <UserCheck size={16} />
                {t("customers.actions.unblock")}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirm("block")}
                className={`${ADMIN_BUTTON_GHOST} h-11`}
              >
                <Ban size={16} />
                {t("customers.actions.block")}
              </button>
            )}
          </Can>
          <Can permission={P.customers.delete}>
            <button
              type="button"
              onClick={() => setConfirm("delete")}
              aria-label={t("customers.actions.delete")}
              title={t("customers.actions.delete")}
              className="grid place-items-center w-11 h-11 rounded-[10px] border border-rose-500/30 text-rose-400 light:text-rose-700 transition-colors hover:bg-rose-500/10"
            >
              <Trash2 size={18} />
            </button>
          </Can>
        </div>
      </div>

      {failed && (
        <p
          role="alert"
          className="mt-3 text-sm text-red-400 light:text-red-600"
        >
          {t("common.actionFailed")}
        </p>
      )}

      {/* Booking numbers */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((key) => (
          <div key={key} className={`${ADMIN_CARD} p-4`}>
            <p className="text-sm text-muted">
              {t(`customers.bookingStats.${key}`)}
            </p>
            <p className="mt-1 text-2xl font-semibold text-fg tabular-nums">
              {customer.bookings[key]}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3 items-start">
        {/* Contact */}
        <section className={`${ADMIN_CARD} p-5 min-w-0`}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
            {t("customers.contact")}
          </h3>
          <ul className="flex flex-col gap-3 text-[15px]">
            <li className="flex items-start gap-2 min-w-0">
              <Mail size={16} className="mt-1 shrink-0 text-muted" />
              <EmailLink email={customer.email} className="min-w-0 flex-1" />
            </li>
            <li className="flex items-center gap-2 text-sm">
              {customer.emailVerified ? (
                <>
                  <BadgeCheck size={16} className="text-teal-accent" />
                  <span className="text-fg/80">{t("customers.verified")}</span>
                </>
              ) : (
                <>
                  <ShieldAlert size={16} className="text-amber-400" />
                  <span className="text-muted">
                    {t("customers.notVerified")}
                  </span>
                </>
              )}
            </li>
            {customer.phone && (
              <li className="flex flex-wrap items-center gap-3">
                <a
                  href={`tel:${customer.phone}`}
                  dir="ltr"
                  className="inline-flex items-center gap-2 text-teal-accent hover:underline"
                >
                  <Phone size={16} />
                  {customer.phone}
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
              </li>
            )}
          </ul>
        </section>

        {/* Their bookings (for staff who can see bookings) */}
        {can(P.bookings.view) && (
          <CustomerBookings email={customer.email} language={i18n.language} />
        )}
      </div>

      <Can permission={P.customers.update}>
        <ConfirmDialog
          open={confirm === "block"}
          title={t("customers.actions.blockTitle", { name: customer.name })}
          body={t("customers.actions.blockBody")}
          confirmLabel={t("customers.actions.block")}
          busy={isUpdating}
          onConfirm={() => setStatus("blocked")}
          onClose={() => setConfirm(null)}
        />
      </Can>
      <Can permission={P.customers.delete}>
        <ConfirmDialog
          open={confirm === "delete"}
          title={t("customers.actions.deleteTitle", { name: customer.name })}
          body={t("customers.actions.deleteBody")}
          confirmLabel={t("common.delete")}
          busy={isDeleting}
          onConfirm={remove}
          onClose={() => setConfirm(null)}
        />
      </Can>
    </>
  );
}

// The customer's latest bookings (found by their email), each opening its
// booking page.
function CustomerBookings({ email, language }) {
  const { t } = useTranslation("admin");
  const { data, isLoading } = useGetBookingsQuery({ q: email, pageSize: 8 });
  const bookingsPath = adminPath("bookings");

  return (
    <section className={`${ADMIN_CARD} p-5 lg:col-span-2 min-w-0`}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          {t("customers.bookingsTitle")}
        </h3>
        {data?.total > data?.items.length && (
          <Link
            to={`${bookingsPath}?q=${encodeURIComponent(email)}`}
            className="text-sm text-teal-accent hover:underline"
          >
            {t("customers.viewAllBookings")}
          </Link>
        )}
      </div>
      {isLoading ? (
        Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-11 my-2 rounded-lg bg-surface/[0.06] animate-pulse"
          />
        ))
      ) : !data?.items.length ? (
        <p className="py-6 text-center text-muted">
          {t("customers.noBookings")}
        </p>
      ) : (
        <ul className="-mx-2">
          {data.items.map((booking) => (
            <li key={booking.id}>
              <Link
                to={`${bookingsPath}/${booking.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg px-2 py-2.5 transition-colors hover:bg-surface/[0.04]"
              >
                <span className="w-24 shrink-0 font-medium text-teal-accent">
                  {booking.reference}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-fg/85">
                  {t(`bookings.service.${booking.service}`)} ·{" "}
                  {formatDateAndTime(
                    booking.pickup.date,
                    booking.pickup.time,
                    language
                  )}
                </span>
                <StatusBadge status={booking.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
