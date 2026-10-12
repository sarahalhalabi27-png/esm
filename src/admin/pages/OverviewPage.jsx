import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { ADMIN_CARD } from "../components/ui.js";
import { ADMIN_NAV_ITEMS, adminPath } from "../navigation.js";
import useCan from "../hooks/useCan.js";
import { selectAdminUser } from "../store/adminSessionSlice.js";

// Dashboard home. For now: a greeting and a card per section the user can
// open. The day's numbers (bookings, unread messages, ...) come with the
// Bookings and Messages tabs.
export default function OverviewPage() {
  const { t } = useTranslation("admin");
  const can = useCan();
  const user = useSelector(selectAdminUser);
  const sections = ADMIN_NAV_ITEMS.filter(
    (item) => item.id !== "overview" && can(item.permission)
  );

  return (
    <>
      <p className="text-lg font-medium text-fg">
        {t("overview.welcome", { name: user?.name })}
      </p>
      <p className="mt-1 text-[15px] text-muted">{t("overview.subtitle")}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map(({ id, path, icon: Icon }) => (
          <Link
            key={id}
            to={adminPath(path)}
            className={`${ADMIN_CARD} group flex items-center gap-4 p-5 transition-colors hover:border-teal-accent/40`}
          >
            <span className="grid place-items-center w-12 h-12 shrink-0 rounded-xl bg-teal-accent/10 text-teal-accent">
              <Icon size={22} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-medium text-fg">
                {t(`nav.${id}`)}
              </span>
              <span className="block mt-0.5 text-sm text-muted truncate">
                {t(`pages.${id}.description`)}
              </span>
            </span>
            <ChevronRight
              size={18}
              className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
            />
          </Link>
        ))}
      </div>
    </>
  );
}
