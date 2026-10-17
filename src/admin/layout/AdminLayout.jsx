import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import { ADMIN_BASE, ADMIN_NAV_ITEMS } from "../navigation.js";
import useCan from "../hooks/useCan.js";

// The tab the URL points at (/admin -> overview, /admin/fleet/... -> fleet).
function useCurrentTab() {
  const { pathname } = useLocation();
  const segment = pathname.slice(ADMIN_BASE.length).split("/")[1] ?? "";
  return ADMIN_NAV_ITEMS.find((item) => item.path === segment);
}

export default function AdminLayout() {
  const { t } = useTranslation("admin");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tab = useCurrentTab();
  const can = useCan();

  return (
    <div className="admin-root flex min-h-screen bg-page text-fg">
      <AdminSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <AdminTopbar onOpenMenu={() => setIsMenuOpen(true)} />
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8">
          {tab && can(tab.permission) && (
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-[28px] font-semibold text-fg">
                {t(`nav.${tab.id}`)}
              </h1>
              <p className="mt-1 text-[15px] text-muted">
                {t(`pages.${tab.id}.description`)}
              </p>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
