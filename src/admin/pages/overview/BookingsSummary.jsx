import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertCircle, ArrowRight, ChevronRight } from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { ADMIN_BUTTON, ADMIN_CARD } from "../../components/ui.js";
import { useGetBookingStatsQuery } from "../../api/bookingsApi.js";
import { adminPath } from "../../navigation.js";
import { formatDate } from "../../utils/format.js";

const pad = (n) => String(n).padStart(2, "0");
function isoDay(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const bookingsPath = (query = "") =>
  `${adminPath("bookings")}${query ? `?${query}` : ""}`;

// The Overview's bookings part: four headline numbers, the next pickups and
// bookings per service. Each number opens the matching filtered list.
export default function BookingsSummary() {
  const { t } = useTranslation("admin");
  const { data, isLoading, isError, refetch } = useGetBookingStatsQuery();

  if (isError && !data) {
    return (
      <div className={ADMIN_CARD}>
        <AdminMessage
          icon={AlertCircle}
          title={t("common.loadFailed")}
          action={
            <button type="button" className={ADMIN_BUTTON} onClick={refetch}>
              {t("common.retry")}
            </button>
          }
        />
      </div>
    );
  }

  const today = isoDay();
  const tiles = [
    {
      id: "todayPickups",
      to: bookingsPath(`from=${today}&to=${today}`),
    },
    {
      id: "newRequests",
      to: bookingsPath("status=new"),
      hint: t("overview.stats.newRequestsHint"),
      highlight: data?.newRequests > 0,
    },
    {
      id: "nextSevenDays",
      to: bookingsPath(`from=${today}&to=${isoDay(6)}`),
    },
    { id: "receivedThisMonth", to: bookingsPath() },
  ];

  return (
    <>
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.id}
            to={tile.to}
            className={`${ADMIN_CARD} group p-5 transition-colors hover:border-teal-accent/40`}
          >
            <span className="flex items-center justify-between gap-2 text-sm text-muted">
              {t(`overview.stats.${tile.id}`)}
              <ChevronRight
                size={16}
                className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 rtl:-scale-x-100"
              />
            </span>
            <span className="mt-2 flex items-center gap-2.5 text-3xl font-semibold text-fg tabular-nums">
              {isLoading ? (
                <span className="inline-block w-12 h-8 rounded-md bg-surface/[0.08] animate-pulse" />
              ) : (
                data[tile.id]
              )}
              {tile.highlight && (
                <span
                  aria-hidden="true"
                  className="w-2.5 h-2.5 rounded-full bg-amber-400 light:bg-amber-500"
                />
              )}
            </span>
            {tile.hint && (
              <span className="mt-1 block text-xs text-muted">{tile.hint}</span>
            )}
          </Link>
        ))}
      </div>

      {/* The two panels share one height (the grid stretches them). */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-5">
        <UpcomingPickups
          className="xl:col-span-3"
          items={data?.upcoming}
          isLoading={isLoading}
        />
        <ServiceBreakdown
          className="xl:col-span-2"
          rows={data?.byService}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}

function Panel({ title, aside, className = "", children }) {
  return (
    <section className={`${ADMIN_CARD} flex min-w-0 flex-col p-5 ${className}`}>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="font-semibold text-fg">{title}</h2>
        {aside}
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </section>
  );
}

function SkeletonLines({ count, height = "h-12" }) {
  return Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`${height} my-2 rounded-lg bg-surface/[0.06] animate-pulse`}
    />
  ));
}

function UpcomingPickups({ items, isLoading, className }) {
  const { t, i18n } = useTranslation("admin");

  return (
    <Panel
      className={className}
      title={t("overview.upcoming")}
      aside={
        <Link
          to={bookingsPath(`from=${isoDay()}`)}
          className="text-sm text-teal-accent hover:underline"
        >
          {t("overview.viewAll")}
        </Link>
      }
    >
      {isLoading ? (
        <SkeletonLines count={5} />
      ) : items.length === 0 ? (
        <p className="py-6 text-center text-muted">
          {t("overview.noUpcoming")}
        </p>
      ) : (
        <ul className="-mx-2">
          {items.map((booking) => (
            <li key={booking.id}>
              <Link
                to={`${adminPath("bookings")}/${booking.id}`}
                className="flex items-center gap-4 px-2 py-3 rounded-lg transition-colors hover:bg-surface/[0.04]"
              >
                <span className="w-[104px] shrink-0">
                  <span className="block text-sm font-medium text-fg whitespace-nowrap">
                    {formatDate(booking.pickup.date, i18n.language)}
                  </span>
                  <span className="block text-xs text-muted tabular-nums">
                    {booking.pickup.time}
                  </span>
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate text-[15px] text-fg">
                    {booking.customer.name}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted min-w-0">
                    <span className="shrink-0">
                      {t(`bookings.service.${booking.service}`)} ·
                    </span>
                    <span className="truncate">{booking.pickup.location}</span>
                    {booking.dropOff.location && (
                      <>
                        <ArrowRight
                          size={12}
                          className="shrink-0 rtl:-scale-x-100"
                        />
                        <span className="truncate">
                          {booking.dropOff.location}
                        </span>
                      </>
                    )}
                  </span>
                </span>
                <span className="max-sm:hidden">
                  <StatusBadge status={booking.status} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

// One bar per service, longest first, scaled to the largest count. A single
// series, so one colour and no legend; each bar carries its count.
function ServiceBreakdown({ rows, isLoading, className }) {
  const { t } = useTranslation("admin");
  const max = Math.max(1, ...(rows ?? []).map((row) => row.count));
  const total = (rows ?? []).reduce((sum, row) => sum + row.count, 0);

  return (
    <Panel
      className={className}
      title={t("overview.byService")}
      aside={
        <span className="text-xs text-muted">{t("overview.last30Days")}</span>
      }
    >
      {isLoading ? (
        <SkeletonLines count={6} height="h-8" />
      ) : total === 0 ? (
        <p className="py-6 text-center text-muted">
          {t("overview.noBookings")}
        </p>
      ) : (
        // Spread over the panel's full height, level with the pickups list.
        <ul className="flex flex-1 flex-col justify-between gap-3.5 py-1">
          {rows.map(({ service, count }) => {
            const label = t(`bookings.service.${service}`);
            return (
              <li key={service} title={`${label}: ${count}`}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-fg/85">{label}</span>
                  <span className="font-medium text-fg tabular-nums">
                    {count}
                  </span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-surface/[0.06]">
                  <div
                    className="h-full rounded-full bg-teal-accent"
                    style={{ width: `${(count / max) * 100}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
