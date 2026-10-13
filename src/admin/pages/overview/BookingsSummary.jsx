import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  ArrowRight,
  CalendarCheck,
  CalendarRange,
  ChevronRight,
  Inbox,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Avatar from "../../components/Avatar.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_CARD,
  ADMIN_CARD_RICH,
} from "../../components/ui.js";
import { useGetBookingStatsQuery } from "../../api/bookingsApi.js";
import { adminPath } from "../../navigation.js";
import { formatDate, formatDayMonth } from "../../utils/format.js";

const pad = (n) => String(n).padStart(2, "0");
function isoDay(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const bookingsPath = (query = "") =>
  `${adminPath("bookings")}${query ? `?${query}` : ""}`;

// One accent per headline number: its icon chip, the line along the card's
// top and the glow in its corner.
const TONES = {
  teal: {
    chip: "bg-teal-accent/15 text-teal-accent",
    bar: "from-teal-accent",
    glow: "bg-teal-accent/20",
  },
  amber: {
    chip: "bg-amber-400/15 text-amber-300 light:bg-amber-500/15 light:text-amber-700",
    bar: "from-amber-400 light:from-amber-500",
    glow: "bg-amber-400/15",
  },
  sky: {
    chip: "bg-sky-400/15 text-sky-300 light:bg-sky-500/15 light:text-sky-700",
    bar: "from-sky-400 light:from-sky-500",
    glow: "bg-sky-400/15",
  },
  violet: {
    chip: "bg-violet-400/15 text-violet-300 light:bg-violet-500/15 light:text-violet-700",
    bar: "from-violet-400 light:from-violet-500",
    glow: "bg-violet-400/15",
  },
};

// The coloured bar beside each upcoming pickup, by booking status.
const STATUS_BARS = {
  new: "bg-amber-400 light:bg-amber-500",
  confirmed: "bg-sky-400 light:bg-sky-500",
  completed: "bg-emerald-400 light:bg-emerald-500",
  cancelled: "bg-rose-400 light:bg-rose-500",
};

// A colour per service, for the ring and its legend (same order as the rows).
const SERVICE_COLORS = [
  { dot: "bg-teal-accent", stroke: "stroke-teal-accent" },
  { dot: "bg-sky-400 light:bg-sky-500", stroke: "stroke-sky-400 light:stroke-sky-500" },
  { dot: "bg-violet-400 light:bg-violet-500", stroke: "stroke-violet-400 light:stroke-violet-500" },
  { dot: "bg-amber-400 light:bg-amber-500", stroke: "stroke-amber-400 light:stroke-amber-500" },
  { dot: "bg-rose-400 light:bg-rose-500", stroke: "stroke-rose-400 light:stroke-rose-500" },
  { dot: "bg-emerald-400 light:bg-emerald-500", stroke: "stroke-emerald-400 light:stroke-emerald-500" },
];

// The Overview's bookings part: four headline numbers, the next pickups and
// bookings per service. Each number opens the matching filtered list.
export default function BookingsSummary() {
  const { t, i18n } = useTranslation("admin");
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
  const nextToday = data?.upcoming.find((b) => b.pickup.date === today);
  const tiles = [
    {
      id: "todayPickups",
      to: bookingsPath(`from=${today}&to=${today}`),
      icon: CalendarCheck,
      tone: "teal",
      hint: nextToday
        ? t("overview.stats.nextPickup", { time: nextToday.pickup.time })
        : t("overview.stats.noPickupsToday"),
    },
    {
      id: "newRequests",
      to: bookingsPath("status=new"),
      icon: Inbox,
      tone: "amber",
      hint: data?.newRequests
        ? t("overview.stats.newRequestsHint")
        : t("overview.stats.allCaughtUp"),
    },
    {
      id: "nextSevenDays",
      to: bookingsPath(`from=${today}&to=${isoDay(6)}`),
      icon: CalendarRange,
      tone: "sky",
      hint: t("overview.stats.range", {
        from: formatDayMonth(today, i18n.language),
        to: formatDayMonth(isoDay(6), i18n.language),
      }),
    },
    {
      id: "receivedThisMonth",
      to: bookingsPath(),
      icon: TrendingUp,
      tone: "violet",
      delta: data ? change(data.receivedThisMonth, data.receivedLastMonth) : null,
      hint: t("overview.vsLastMonth"),
    },
  ];

  return (
    <>
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => (
          <StatTile
            key={tile.id}
            tile={tile}
            value={data?.[tile.id]}
            isLoading={isLoading}
          />
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

// Percent change against the previous period; null when there is nothing to
// compare with.
function change(current, previous) {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}

function StatTile({ tile, value, isLoading }) {
  const { t } = useTranslation("admin");
  const { icon: Icon, tone, delta } = tile;
  const colors = TONES[tone];
  const label = t(`overview.stats.${tile.id}`);
  const empty = !isLoading && value === 0;

  return (
    <Link
      to={tile.to}
      className={`${ADMIN_CARD_RICH} group relative flex flex-col overflow-hidden p-5 transition-colors hover:border-teal-accent/40`}
    >
      {/* The card's own colour: a line along the top and a soft glow. */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r to-transparent ${colors.bar}`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-10 -end-10 h-28 w-28 rounded-full blur-2xl light:opacity-50 ${colors.glow}`}
      />

      <span className="relative flex items-center justify-between">
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${colors.chip}`}
        >
          <Icon size={20} />
        </span>
        <ChevronRight
          size={16}
          className="shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100 rtl:-scale-x-100"
        />
      </span>

      <span
        className={`relative mt-5 block text-4xl font-semibold leading-none tabular-nums ${empty ? "text-fg/40" : "text-fg"}`}
      >
        {isLoading ? (
          <span className="inline-block w-14 h-9 rounded-md bg-surface/[0.08] animate-pulse" />
        ) : (
          value
        )}
      </span>
      <span title={label} className="relative mt-2 block truncate text-sm text-fg/80">
        {label}
      </span>

      <span className="relative mt-3 flex min-h-5 items-center gap-2 text-xs text-muted">
        {delta !== null && delta !== undefined && !isLoading && (
          <Delta value={delta} />
        )}
        <span className="truncate">{tile.hint}</span>
      </span>
    </Link>
  );
}

// "+12%" / "-8%" against last month; green when up, rose when down.
function Delta({ value }) {
  const up = value >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        up
          ? "bg-emerald-400/15 text-emerald-300 light:bg-emerald-500/15 light:text-emerald-700"
          : "bg-rose-400/15 text-rose-300 light:bg-rose-500/15 light:text-rose-700"
      }`}
    >
      <Icon size={12} />
      <span dir="ltr">{`${up ? "+" : ""}${value}%`}</span>
    </span>
  );
}

function Panel({ title, aside, className = "", children }) {
  return (
    <section
      className={`${ADMIN_CARD_RICH} flex min-w-0 flex-col p-5 ${className}`}
    >
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
          {items.map((booking, index) => {
            // The date shows once per day; a line sets each new day apart.
            const newDay =
              index === 0 || items[index - 1].pickup.date !== booking.pickup.date;
            return (
              <li
                key={booking.id}
                className={
                  newDay && index > 0
                    ? "mt-1.5 border-t border-line/10 pt-1.5"
                    : ""
                }
              >
                <Link
                  to={`${adminPath("bookings")}/${booking.id}`}
                  className="flex items-center gap-4 px-2 py-2.5 rounded-lg transition-colors hover:bg-surface/[0.04]"
                >
                  <span
                    aria-hidden="true"
                    className={`h-10 w-1 shrink-0 rounded-full ${STATUS_BARS[booking.status] ?? "bg-line/20"}`}
                  />
                  <span className="w-[92px] shrink-0">
                    {newDay && (
                      <span className="block text-sm font-medium text-fg whitespace-nowrap">
                        {formatDate(booking.pickup.date, i18n.language)}
                      </span>
                    )}
                    <span
                      className={`block tabular-nums ${newDay ? "text-xs text-muted" : "text-sm text-muted"}`}
                    >
                      {booking.pickup.time}
                    </span>
                  </span>
                  <Avatar name={booking.customer.name} />
                  <span className="flex-1 min-w-0">
                    <span className="block truncate text-[15px] text-fg">
                      {booking.customer.name}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted min-w-0">
                      <span className="shrink-0">
                        {t(`bookings.service.${booking.service}`)} ·
                      </span>
                      <span className="truncate">
                        {booking.pickup.location}
                      </span>
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
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

const RING_RADIUS = 42;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

// A ring split by service (the total in the middle) over a legend with each
// service's count and share. Services keep their colour by their order in
// `rows` (most bookings first).
function ServiceBreakdown({ rows, isLoading, className }) {
  const { t } = useTranslation("admin");
  const total = (rows ?? []).reduce((sum, row) => sum + row.count, 0);
  const gap = (rows ?? []).filter((row) => row.count > 0).length > 1 ? 2 : 0;

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
        <>
          <div className="relative mx-auto h-[150px] w-[150px] shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r={RING_RADIUS}
                fill="none"
                strokeWidth="9"
                className="stroke-surface/[0.06]"
              />
              {rows.map(({ service, count }, index) => {
                if (count === 0) return null;
                const length = (count / total) * RING_LENGTH;
                const start =
                  (rows.slice(0, index).reduce((sum, r) => sum + r.count, 0) /
                    total) *
                  RING_LENGTH;
                return (
                  <circle
                    key={service}
                    cx="50"
                    cy="50"
                    r={RING_RADIUS}
                    fill="none"
                    strokeWidth="9"
                    strokeLinecap="butt"
                    strokeDasharray={`${Math.max(0, length - gap)} ${RING_LENGTH}`}
                    strokeDashoffset={-start}
                    className={SERVICE_COLORS[index % SERVICE_COLORS.length].stroke}
                  />
                );
              })}
            </svg>
            <span className="absolute inset-0 grid place-content-center text-center">
              <span className="text-3xl font-semibold leading-none text-fg tabular-nums">
                {total}
              </span>
              <span className="mt-1 text-xs text-muted">
                {t("overview.bookingsTotal")}
              </span>
            </span>
          </div>

          <ul className="mt-5 flex flex-1 flex-col justify-between gap-2">
            {rows.map(({ service, count }, index) => (
              <li key={service} className="flex items-center gap-3 text-sm">
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${SERVICE_COLORS[index % SERVICE_COLORS.length].dot}`}
                />
                <span className="flex-1 truncate text-fg/85">
                  {t(`bookings.service.${service}`)}
                </span>
                <span className="font-medium text-fg tabular-nums">
                  {count}
                </span>
                <span className="w-10 text-end text-xs text-muted tabular-nums">
                  {Math.round((count / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Panel>
  );
}
