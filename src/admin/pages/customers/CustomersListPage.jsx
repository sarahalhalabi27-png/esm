import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertCircle, BadgeCheck, Search, Users } from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Avatar from "../../components/Avatar.jsx";
import Pagination from "../../components/Pagination.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_CARD,
  ADMIN_CARD_RICH,
  ADMIN_INPUT,
} from "../../components/ui.js";
import { useGetCustomersQuery } from "../../api/customersApi.js";
import useUrlFilters, { useSearchBox } from "../../hooks/useUrlFilters.js";
import { formatDate } from "../../utils/format.js";
import {
  CUSTOMER_STATUS_BARS,
  CUSTOMER_STATUS_TONES,
} from "../../utils/people.js";

const PAGE_SIZE = 15;
const VIEWS = ["", "active", "blocked"];

// Accounts registered on the website, newest first.
export default function CustomersListPage() {
  const { t, i18n } = useTranslation("admin");
  const location = useLocation();
  const { get, update } = useUrlFilters();
  const params = {
    q: get("q"),
    status: get("status"),
    page: Number(get("page")) || 1,
    pageSize: PAGE_SIZE,
  };
  const search = useSearchBox(params.q, (q) => update({ q }));
  const { data, isLoading, isFetching, isError, refetch } =
    useGetCustomersQuery(params);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div
          role="tablist"
          className="flex flex-1 gap-2 overflow-x-auto pb-1 min-w-0"
        >
          {VIEWS.map((view) => {
            const active = params.status === view;
            const count = data?.counts?.[view || "all"];
            return (
              <button
                key={view || "all"}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => update({ status: view })}
                className={`inline-flex items-center gap-2 h-10 px-4 shrink-0 rounded-full text-sm transition-colors ${
                  active
                    ? "bg-teal-accent text-page font-semibold"
                    : "border border-line/15 text-fg/75 hover:text-fg hover:bg-surface/[0.05]"
                }`}
              >
                {t(`customers.views.${view || "all"}`)}
                {count !== undefined && (
                  <span
                    className={`min-w-6 h-6 px-1.5 grid place-items-center rounded-full text-xs ${
                      active
                        ? "bg-page/20"
                        : view === "blocked" && count > 0
                          ? "bg-rose-400/20 text-rose-300 light:bg-rose-500/20 light:text-rose-700"
                          : "bg-surface/[0.08]"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <label className="relative block w-full md:w-80">
          <span className="sr-only">{t("customers.searchPlaceholder")}</span>
          <Search
            size={18}
            className="absolute top-1/2 -translate-y-1/2 start-3.5 text-muted pointer-events-none"
          />
          <input
            type="search"
            value={search.value}
            onChange={search.onChange}
            placeholder={t("customers.searchPlaceholder")}
            className={`${ADMIN_INPUT} ps-10`}
          />
        </label>
      </div>

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
          <div
            className={`${ADMIN_CARD} p-4`}
            role="status"
            aria-label={t("common.loading")}
          >
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-14 my-2 rounded-lg bg-surface/[0.06] animate-pulse"
              />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <div className={ADMIN_CARD}>
            <AdminMessage icon={Users} title={t("customers.empty")} />
          </div>
        ) : (
          <div
            className={`transition-opacity ${isFetching ? "opacity-60" : ""}`}
          >
            <ul className={`${ADMIN_CARD_RICH} overflow-hidden`}>
              <li
                aria-hidden="true"
                className="hidden md:grid grid-cols-[4px_minmax(0,1fr)_150px_90px_120px_100px] gap-4 border-b border-line/10 px-4 py-3 text-xs uppercase tracking-wider text-muted"
              >
                <span />
                <span>{t("customers.columns.customer")}</span>
                <span>{t("customers.columns.phone")}</span>
                <span>{t("customers.columns.bookings")}</span>
                <span>{t("customers.columns.joined")}</span>
                <span>{t("customers.columns.status")}</span>
              </li>
              {data.items.map((customer) => (
                <li
                  key={customer.id}
                  className="border-b border-line/[0.06] last:border-0"
                >
                  <Link
                    to={customer.id}
                    state={{ listSearch: location.search }}
                    className="relative flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 max-md:ps-6 transition-colors hover:bg-surface/[0.05] md:grid md:grid-cols-[4px_minmax(0,1fr)_150px_90px_120px_100px]"
                  >
                    {/* Green bar for an active account, red for a blocked one. */}
                    <span
                      aria-hidden="true"
                      className={`h-11 w-1 rounded-full max-md:absolute max-md:inset-y-3 max-md:start-2 max-md:h-auto ${CUSTOMER_STATUS_BARS[customer.status]}`}
                    />
                    <span className="flex min-w-0 flex-1 basis-full items-center gap-3 md:basis-auto">
                      <Avatar name={customer.name} photo={customer.photo} />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="truncate font-medium text-fg"
                            dir="auto"
                          >
                            {customer.name}
                          </span>
                          {customer.emailVerified && (
                            <BadgeCheck
                              size={15}
                              className="shrink-0 text-teal-accent"
                              aria-label={t("customers.verified")}
                            />
                          )}
                        </span>
                        <span
                          className="block truncate text-sm text-muted"
                          dir="ltr"
                        >
                          {customer.email}
                        </span>
                      </span>
                    </span>
                    <span className="text-sm text-fg/80 tabular-nums" dir="ltr">
                      {customer.phone || t("customers.noPhone")}
                    </span>
                    <span>
                      <span className="md:sr-only text-sm text-muted">
                        {t("customers.columns.bookings")}:{" "}
                      </span>
                      <span
                        className={`inline-grid h-7 min-w-7 place-items-center rounded-full px-2 text-[13px] font-medium tabular-nums ${
                          customer.bookings.total > 0
                            ? "bg-teal-accent/15 text-teal-accent"
                            : "bg-surface/[0.06] text-muted"
                        }`}
                      >
                        {customer.bookings.total}
                      </span>
                    </span>
                    <span className="text-sm text-muted">
                      {formatDate(customer.createdAt, i18n.language)}
                    </span>
                    <span
                      className={`inline-flex h-7 w-fit items-center rounded-full px-3 text-[13px] font-medium ${CUSTOMER_STATUS_TONES[customer.status]}`}
                    >
                      {t(`customers.status.${customer.status}`)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Pagination
              page={data.page}
              pageSize={data.pageSize}
              total={data.total}
              onPageChange={(page) => update({ page: String(page) })}
            />
          </div>
        )}
      </div>
    </>
  );
}
