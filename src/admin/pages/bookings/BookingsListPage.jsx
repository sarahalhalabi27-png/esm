import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertCircle, ArrowRight, Inbox, Search, X } from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Select from "../../components/Select.jsx";
import Pagination from "../../components/Pagination.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_CARD,
  ADMIN_DATE_INPUT,
  ADMIN_INPUT,
} from "../../components/ui.js";
import { useGetBookingsQuery } from "../../api/bookingsApi.js";
import { BOOKING_SERVICES, BOOKING_STATUSES } from "../../api/mockBookings.js";
import { formatDateAndTime } from "../../utils/format.js";
import useUrlFilters, { useSearchBox } from "../../hooks/useUrlFilters.js";

const PAGE_SIZE = 10;
const FILTER_KEYS = ["status", "service", "q", "from", "to"];

// Every booking request, newest first, with status tabs, filters and pages.
// The filters live in the URL (?status=new&page=2...), so Back, reloads and
// shared links keep them.
export default function BookingsListPage() {
  const { t, i18n } = useTranslation("admin");
  const navigate = useNavigate();
  const location = useLocation();
  const { get, update: updateParams } = useUrlFilters();
  const params = {
    page: Number(get("page")) || 1,
    pageSize: PAGE_SIZE,
    status: get("status"),
    service: get("service"),
    q: get("q"),
    from: get("from"),
    to: get("to"),
  };
  const { data, isLoading, isFetching, isError, refetch } =
    useGetBookingsQuery(params);
  const search = useSearchBox(params.q, (q) => updateParams({ q }));

  const hasFilters = FILTER_KEYS.some((key) => key !== "status" && params[key]);
  const clearFilters = () => {
    search.clear();
    updateParams({ service: "", q: "", from: "", to: "" });
  };

  const openBooking = (id) =>
    navigate(id, { state: { listSearch: location.search } });

  const counts = data?.counts;
  const statusTabs = [
    { value: "", label: t("common.all"), count: counts?.all },
    ...BOOKING_STATUSES.map((status) => ({
      value: status,
      label: t(`bookings.status.${status}`),
      count: counts?.[status],
    })),
  ];

  return (
    <>
      {/* Status tabs */}
      <div
        role="tablist"
        className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0"
      >
        {statusTabs.map((tab) => {
          const active = params.status === tab.value;
          return (
            <button
              key={tab.value || "all"}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => updateParams({ status: tab.value })}
              className={`inline-flex items-center gap-2 h-10 px-4 shrink-0 rounded-full text-sm transition-colors ${
                active
                  ? "bg-teal-accent text-page font-semibold"
                  : "border border-line/15 text-fg/75 hover:text-fg hover:bg-surface/[0.05]"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`min-w-6 h-6 px-1.5 grid place-items-center rounded-full text-xs ${
                    active ? "bg-page/20" : "bg-surface/[0.08]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-[minmax(0,1fr)_200px_176px_176px_auto] items-end">
        <label className="relative block col-span-2 md:col-span-1">
          <span className="sr-only">{t("bookings.searchPlaceholder")}</span>
          <Search
            size={18}
            className="absolute top-1/2 -translate-y-1/2 start-3.5 text-muted pointer-events-none"
          />
          <input
            type="search"
            value={search.value}
            onChange={search.onChange}
            placeholder={t("bookings.searchPlaceholder")}
            className={`${ADMIN_INPUT} ps-10`}
          />
        </label>
        <Select
          value={params.service}
          onChange={(service) => updateParams({ service })}
          options={[
            { value: "", label: t("bookings.allServices") },
            ...BOOKING_SERVICES.map((service) => ({
              value: service,
              label: t(`bookings.service.${service}`),
            })),
          ]}
          aria-label={t("bookings.columns.service")}
          wrapperClassName="col-span-2 md:col-span-1"
        />
        <label className="block">
          <span className="block mb-1 text-xs text-muted">
            {t("bookings.from")}
          </span>
          <input
            type="date"
            value={params.from}
            max={params.to || undefined}
            onChange={(event) => updateParams({ from: event.target.value })}
            className={ADMIN_DATE_INPUT}
          />
        </label>
        <label className="block">
          <span className="block mb-1 text-xs text-muted">
            {t("bookings.to")}
          </span>
          <input
            type="date"
            value={params.to}
            min={params.from || undefined}
            onChange={(event) => updateParams({ to: event.target.value })}
            className={ADMIN_DATE_INPUT}
          />
        </label>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="col-span-2 md:col-span-1 inline-flex items-center justify-center gap-1.5 h-11 px-3 text-sm text-muted hover:text-fg"
          >
            <X size={16} />
            {t("common.clearFilters")}
          </button>
        )}
      </div>

      {/* Results */}
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
          <LoadingRows />
        ) : data.items.length === 0 ? (
          <div className={ADMIN_CARD}>
            <AdminMessage icon={Inbox} title={t("bookings.empty")} />
          </div>
        ) : (
          <div
            className={`transition-opacity ${isFetching ? "opacity-60" : ""}`}
            aria-busy={isFetching}
          >
            <BookingsTable
              items={data.items}
              language={i18n.language}
              onOpen={openBooking}
              listSearch={location.search}
            />
            <Pagination
              page={data.page}
              pageSize={data.pageSize}
              total={data.total}
              onPageChange={(page) => updateParams({ page: String(page) })}
            />
          </div>
        )}
      </div>
    </>
  );
}

function TripRoute({ booking }) {
  return (
    <span className="flex items-center gap-1.5 min-w-0">
      <span className="truncate">{booking.pickup.location}</span>
      {booking.dropOff.location && (
        <>
          <ArrowRight
            size={14}
            className="shrink-0 text-muted rtl:-scale-x-100"
          />
          <span className="truncate">{booking.dropOff.location}</span>
        </>
      )}
    </span>
  );
}

// A table from md, a card per booking below that.
function BookingsTable({ items, language, onOpen, listSearch }) {
  const { t } = useTranslation("admin");
  const linkState = { listSearch };

  return (
    <>
      <div className={`${ADMIN_CARD} hidden md:block overflow-x-auto`}>
        <table className="w-full text-[14px]">
          <thead>
            <tr className="text-start text-xs uppercase tracking-wider text-muted border-b border-line/10">
              {[
                "reference",
                "customer",
                "service",
                "pickup",
                "route",
                "status",
              ].map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-4 py-3 text-start font-medium"
                >
                  {t(`bookings.columns.${column}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((booking) => (
              <tr
                key={booking.id}
                onClick={() => onOpen(booking.id)}
                className="border-b border-line/[0.06] last:border-0 cursor-pointer transition-colors hover:bg-surface/[0.04]"
              >
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <Link
                    to={booking.id}
                    state={linkState}
                    onClick={(event) => event.stopPropagation()}
                    className="font-medium text-teal-accent hover:underline"
                  >
                    {booking.reference}
                  </Link>
                </td>
                <td className="px-4 py-3.5">
                  <span className="block text-fg">{booking.customer.name}</span>
                  <span className="block text-xs text-muted" dir="ltr">
                    {booking.customer.phone}
                  </span>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-fg/85">
                  {t(`bookings.service.${booking.service}`)}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-fg/85">
                  {formatDateAndTime(
                    booking.pickup.date,
                    booking.pickup.time,
                    language
                  )}
                </td>
                <td className="px-4 py-3.5 max-w-[260px] text-fg/85">
                  <TripRoute booking={booking} />
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={booking.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="md:hidden flex flex-col gap-3">
        {items.map((booking) => (
          <li key={booking.id}>
            <Link
              to={booking.id}
              state={linkState}
              className={`${ADMIN_CARD} block p-4 transition-colors hover:border-teal-accent/40`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-teal-accent">
                  {booking.reference}
                </span>
                <StatusBadge status={booking.status} />
              </div>
              <p className="mt-2 text-fg">{booking.customer.name}</p>
              <p className="mt-0.5 text-sm text-muted">
                {t(`bookings.service.${booking.service}`)} ·{" "}
                {formatDateAndTime(
                  booking.pickup.date,
                  booking.pickup.time,
                  language
                )}
              </p>
              <div className="mt-2 text-sm text-fg/80">
                <TripRoute booking={booking} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function LoadingRows() {
  const { t } = useTranslation("admin");
  return (
    <div
      className={`${ADMIN_CARD} p-4`}
      role="status"
      aria-label={t("common.loading")}
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="h-11 my-2 rounded-lg bg-surface/[0.06] animate-pulse"
        />
      ))}
    </div>
  );
}
