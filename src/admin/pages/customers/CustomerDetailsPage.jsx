import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Ban,
  CalendarClock,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ChevronRight,
  Contact,
  LogIn,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  SearchX,
  ShieldAlert,
  Trash2,
  UserCheck,
  XCircle,
} from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Avatar from "../../components/Avatar.jsx";
import Can from "../../components/Can.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import EmailLink from "../../components/EmailLink.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_CARD,
  ADMIN_CARD_RICH,
  STATUS_BARS,
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
import {
  CUSTOMER_STATUS_BARS,
  CUSTOMER_STATUS_TONES,
} from "../../utils/people.js";

// The booking numbers, each with its own icon and colour.
const STATS = [
  {
    key: "total",
    icon: CalendarDays,
    chip: "bg-teal-accent/15 text-teal-accent light:bg-teal-500/15 light:text-teal-700",
    bar: "from-teal-accent light:from-teal-500",
    glow: "bg-teal-accent/20 light:bg-teal-500/[0.14]",
  },
  {
    key: "upcoming",
    icon: CalendarClock,
    chip: "bg-sky-400/15 text-sky-300 light:bg-sky-500/15 light:text-sky-700",
    bar: "from-sky-400 light:from-sky-500",
    glow: "bg-sky-400/20 light:bg-sky-500/[0.16]",
  },
  {
    key: "completed",
    icon: CheckCircle2,
    chip: "bg-emerald-400/15 text-emerald-300 light:bg-emerald-500/15 light:text-emerald-700",
    bar: "from-emerald-400 light:from-emerald-500",
    glow: "bg-emerald-400/20 light:bg-emerald-500/[0.16]",
  },
  {
    key: "cancelled",
    icon: XCircle,
    chip: "bg-rose-400/15 text-rose-300 light:bg-rose-500/15 light:text-rose-700",
    bar: "from-rose-400 light:from-rose-500",
    glow: "bg-rose-400/20 light:bg-rose-500/[0.16]",
  },
];

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

      {/* Heading card; its side bar is green for an active account, red when blocked. */}
      <div
        className={`${ADMIN_CARD_RICH} relative mt-4 overflow-hidden p-5 ps-7 md:p-6 md:ps-8`}
      >
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 start-0 w-1.5 ${CUSTOMER_STATUS_BARS[customer.status]}`}
        />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar name={customer.name} photo={customer.photo} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold text-fg" dir="auto">
                  {customer.name}
                </h2>
                <span
                  className={`inline-flex h-7 items-center rounded-full px-3 text-[13px] font-medium ${CUSTOMER_STATUS_TONES[customer.status]}`}
                >
                  {t(`customers.status.${customer.status}`)}
                </span>
              </div>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarPlus size={14} className="shrink-0" />
                  {t("customers.joined", {
                    date: formatDate(customer.createdAt, i18n.language),
                  })}
                </span>
                {customer.lastLoginAt && (
                  <span className="inline-flex items-center gap-1.5">
                    <LogIn size={14} className="shrink-0" />
                    {t("customers.lastLogin", {
                      date: formatDate(customer.lastLoginAt, i18n.language),
                    })}
                  </span>
                )}
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
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-emerald-500/30 bg-emerald-500/10 px-4 text-[15px] font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:opacity-60 light:text-emerald-700"
                >
                  <UserCheck size={17} />
                  {t("customers.actions.unblock")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirm("block")}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-amber-500/30 bg-amber-500/10 px-4 text-[15px] font-medium text-amber-300 transition-colors hover:bg-amber-500/20 light:text-amber-800"
                >
                  <Ban size={17} />
                  {t("customers.actions.block")}
                </button>
              )}
            </Can>
            <Can permission={P.customers.delete}>
              <button
                type="button"
                onClick={() => setConfirm("delete")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-rose-500/40 bg-rose-500/10 px-4 text-[15px] font-medium text-rose-300 transition-colors hover:bg-rose-500/20 light:text-rose-700"
              >
                <Trash2 size={17} />
                {t("customers.actions.delete")}
              </button>
            </Can>
          </div>
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
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map(({ key, icon: Icon, chip, bar, glow }) => (
          <div
            key={key}
            className={`${ADMIN_CARD_RICH} relative overflow-hidden p-4`}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r to-transparent ${bar}`}
            />
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute -top-10 -end-10 h-32 w-32 rounded-full blur-2xl ${glow}`}
            />
            <span
              className={`relative grid h-9 w-9 place-items-center rounded-xl ${chip}`}
            >
              <Icon size={18} />
            </span>
            <p className="relative mt-3 text-3xl font-semibold leading-none text-fg tabular-nums">
              {customer.bookings[key]}
            </p>
            <p className="relative mt-1.5 text-sm text-muted">
              {t(`customers.bookingStats.${key}`)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3 items-start">
        {/* Their bookings (for staff who can see bookings) */}
        {can(P.bookings.view) && (
          <CustomerBookings email={customer.email} language={i18n.language} />
        )}

        {/* Contact */}
        <Section icon={Contact} title={t("customers.contact")}>
          <ul className="flex flex-col gap-3">
            <ContactRow icon={Mail}>
              <EmailLink email={customer.email} className="min-w-0 flex-1" />
            </ContactRow>
            {customer.phone && (
              <ContactRow icon={Phone}>
                <a
                  href={`tel:${customer.phone}`}
                  dir="ltr"
                  className="text-teal-accent hover:underline"
                >
                  {customer.phone}
                </a>
              </ContactRow>
            )}
          </ul>

          <p
            className={`mt-4 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium ${
              customer.emailVerified
                ? "bg-emerald-400/15 text-emerald-300 light:bg-emerald-500/15 light:text-emerald-800"
                : "bg-amber-400/15 text-amber-300 light:bg-amber-500/15 light:text-amber-800"
            }`}
          >
            {customer.emailVerified ? (
              <BadgeCheck size={15} />
            ) : (
              <ShieldAlert size={15} />
            )}
            {customer.emailVerified
              ? t("customers.verified")
              : t("customers.notVerified")}
          </p>

          {customer.phone && (
            <a
              href={`https://wa.me/${phoneDigits}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-emerald-500/30 bg-emerald-500/10 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20 light:text-emerald-700"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          )}
        </Section>
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

// A card with an icon square leading its heading; `aside` sits at the far end.
function Section({ icon: Icon, title, aside, className = "", children }) {
  return (
    <section className={`${ADMIN_CARD_RICH} p-5 min-w-0 ${className}`}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-3 font-semibold text-fg">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-accent/15 text-teal-accent">
            <Icon size={18} />
          </span>
          {title}
        </h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

function ContactRow({ icon: Icon, children }) {
  return (
    <li className="flex min-w-0 items-center gap-3 text-[15px]">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface/[0.06] text-muted">
        <Icon size={17} />
      </span>
      <span className="min-w-0 break-all">{children}</span>
    </li>
  );
}

// The customer's latest bookings (found by their email), each opening its
// booking page.
function CustomerBookings({ email, language }) {
  const { t } = useTranslation("admin");
  const { data, isLoading } = useGetBookingsQuery({ q: email, pageSize: 8 });
  const bookingsPath = adminPath("bookings");

  return (
    <Section
      icon={CalendarDays}
      title={t("customers.bookingsTitle")}
      className="lg:col-span-2"
      aside={
        data?.total > data?.items.length && (
          <Link
            to={`${bookingsPath}?q=${encodeURIComponent(email)}`}
            className="text-sm text-teal-accent hover:underline"
          >
            {t("customers.viewAllBookings")}
          </Link>
        )
      }
    >
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
                className="group flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg px-2 py-2.5 transition-colors hover:bg-surface/[0.05]"
              >
                <span
                  aria-hidden="true"
                  className={`h-9 w-1 shrink-0 rounded-full ${STATUS_BARS[booking.status] ?? "bg-line/20"}`}
                />
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
                <ChevronRight
                  size={16}
                  className="shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100 rtl:-scale-x-100"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
