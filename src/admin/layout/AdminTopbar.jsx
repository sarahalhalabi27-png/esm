import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogOut, Menu } from "lucide-react";
import ThemeToggle from "../../components/common/ThemeToggle.jsx";
import LanguageToggle from "../components/LanguageToggle.jsx";
import { ADMIN_ICON_BUTTON } from "../components/ui.js";
import { ADMIN_BASE } from "../navigation.js";
import { adminLogout, selectAdminUser } from "../store/adminSessionSlice.js";

function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function AdminTopbar({ onOpenMenu }) {
  const { t } = useTranslation("admin");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectAdminUser);

  const logout = async () => {
    await dispatch(adminLogout());
    navigate(`${ADMIN_BASE}/login`, { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 h-[72px] px-4 md:px-8 bg-page/90 backdrop-blur border-b border-line/10">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label={t("nav.openMenu")}
        className="lg:hidden text-fg/80 hover:text-fg"
      >
        <Menu size={24} />
      </button>

      <div className="ms-auto flex items-center gap-3">
        <ThemeToggle />
        <LanguageToggle />

        <div className="flex items-center gap-3 ms-2 ps-4 border-s border-line/10">
          <span className="grid place-items-center w-10 h-10 rounded-full bg-teal-accent/15 text-teal-accent text-sm font-semibold">
            {initials(user?.name)}
          </span>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-fg">{user?.name}</p>
            <p className="text-xs text-muted">{user?.role?.name}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label={t("session.logout")}
            title={t("session.logout")}
            className={`${ADMIN_ICON_BUTTON} ms-1`}
          >
            <LogOut size={18} className="rtl:-scale-x-100" />
          </button>
        </div>
      </div>
    </header>
  );
}
