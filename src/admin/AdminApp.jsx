import { useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SearchX } from "lucide-react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import i18n from "../i18n.js";
import { adminPersistor, adminStore } from "./store/index.js";
import en from "./locales/en.json";
import ar from "./locales/ar.json";
import AdminLayout from "./layout/AdminLayout.jsx";
import RequireAdminAuth from "./components/RequireAdminAuth.jsx";
import RequirePermission from "./components/RequirePermission.jsx";
import AdminMessage from "./components/AdminMessage.jsx";
import { ADMIN_BUTTON } from "./components/ui.js";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminHomePage from "./pages/AdminHomePage.jsx";
import ComingSoonPage from "./pages/ComingSoonPage.jsx";
import BookingsPage from "./pages/bookings/BookingsPage.jsx";
import { ADMIN_BASE, ADMIN_NAV_ITEMS } from "./navigation.js";

// The dashboard's strings live in their own "admin" namespace, loaded with
// this (lazy) bundle so the public site doesn't download them.
i18n.addResourceBundle("en", "admin", en);
i18n.addResourceBundle("ar", "admin", ar);

// Each tab's page, by nav id. Tabs not listed yet show "coming soon".
const TAB_PAGES = {
  bookings: BookingsPage,
};

function NotFound() {
  const { t } = useTranslation("admin");
  return (
    <AdminMessage
      icon={SearchX}
      title={t("access.notFoundTitle")}
      body={t("access.notFoundBody")}
      action={
        <Link to={ADMIN_BASE} className={ADMIN_BUTTON}>
          {t("access.goHome")}
        </Link>
      }
    />
  );
}

// Everything under /admin (see App.jsx).
export default function AdminApp() {
  // Its own tab title, and keep the dashboard out of search engines.
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "ESM Limo · Dashboard";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, []);

  return (
    <Provider store={adminStore}>
      <PersistGate loading={null} persistor={adminPersistor}>
        <Routes>
          <Route path="login" element={<AdminLoginPage />} />
          <Route element={<RequireAdminAuth />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminHomePage />} />
              {ADMIN_NAV_ITEMS.filter((item) => item.path).map((item) => {
                const Page = TAB_PAGES[item.id] ?? ComingSoonPage;
                return (
                  <Route
                    key={item.id}
                    path={`${item.path}/*`}
                    element={
                      <RequirePermission permission={item.permission}>
                        <Page />
                      </RequirePermission>
                    }
                  />
                );
              })}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </PersistGate>
    </Provider>
  );
}
