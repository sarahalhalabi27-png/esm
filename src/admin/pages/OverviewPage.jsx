import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Inbox, Mail } from "lucide-react";
import { ADMIN_BUTTON, ADMIN_BUTTON_GHOST } from "../components/ui.js";
import useCan from "../hooks/useCan.js";
import { adminPath } from "../navigation.js";
import { P } from "../permissions.js";
import BookingsSummary from "./overview/BookingsSummary.jsx";
import MessagesSummary from "./overview/MessagesSummary.jsx";
import { selectAdminUser } from "../store/adminSessionSlice.js";

// Dashboard home: a welcome banner with shortcuts, then the numbers of each
// section the user may see (bookings and messages for now; others join as
// their tabs are built).
export default function OverviewPage() {
  const { t, i18n } = useTranslation("admin");
  const can = useCan();
  const user = useSelector(selectAdminUser);
  const showBookings = can(P.bookings.view);
  const showMessages = can(P.messages.view);

  const today = new Intl.DateTimeFormat(
    i18n.language === "ar" ? "ar-AE-u-nu-latn" : "en-GB",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" }
  ).format(new Date());

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-teal-accent/25 bg-gradient-to-br from-teal-accent/25 via-teal-accent/[0.07] to-transparent p-6 md:p-8 light:from-teal-accent/10 light:via-teal-accent/[0.04]">
        {/* A soft glow in the corner, purely decorative. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -end-16 h-64 w-64 rounded-full bg-teal-accent/20 blur-3xl light:bg-teal-accent/10"
        />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="min-w-0">
            <p className="text-sm text-muted">{today}</p>
            <h1 className="mt-1 text-2xl font-semibold text-fg md:text-3xl">
              {t("overview.welcome", { name: user?.name })}
            </h1>
            {(showBookings || showMessages) && (
              <p className="mt-1.5 text-[15px] text-muted">
                {t("overview.subtitle")}
              </p>
            )}
          </div>
          {(showBookings || showMessages) && (
            <div className="flex flex-wrap gap-3">
              {showBookings && (
                <Link
                  to={`${adminPath("bookings")}?status=new`}
                  className={ADMIN_BUTTON}
                >
                  <Inbox size={18} />
                  {t("overview.quickRequests")}
                </Link>
              )}
              {showMessages && (
                <Link
                  to={`${adminPath("messages")}?view=unread`}
                  className={`${ADMIN_BUTTON_GHOST} !h-11 bg-surface/[0.04]`}
                >
                  <Mail size={18} />
                  {t("overview.quickMessages")}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {showBookings && (
        <div className="mt-4">
          <BookingsSummary />
        </div>
      )}
      {showMessages && (
        <div className="mt-4">
          <MessagesSummary />
        </div>
      )}
    </>
  );
}
