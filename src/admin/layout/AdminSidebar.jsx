import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, X } from "lucide-react";
import BrandLogo from "../../components/common/BrandLogo.jsx";
import { ADMIN_NAV, adminPath } from "../navigation.js";
import useCan from "../hooks/useCan.js";

const DESKTOP_QUERY = "(min-width: 1024px)"; // Tailwind lg

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia(DESKTOP_QUERY).matches
  );
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setIsDesktop(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
}

// The tab list, built only from the tabs the signed-in staff member may see.
// Fixed beside the content from lg; a drawer from the start side below that.
export default function AdminSidebar({ isOpen, onClose }) {
  const { t } = useTranslation("admin");
  const can = useCan();
  const isDesktop = useIsDesktop();

  const groups = ADMIN_NAV.map((group) => ({
    ...group,
    items: group.items.filter((item) => can(item.permission)),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        // The closed phone drawer is off screen: keep it out of the tab order.
        inert={isOpen || isDesktop ? undefined : ""}
        className={`fixed lg:sticky top-0 start-0 z-50 lg:z-auto h-screen w-[264px] max-w-[85%] shrink-0 flex flex-col bg-page border-e border-line/10 transition-transform duration-300 lg:!translate-x-0 ${
          isOpen
            ? "translate-x-0 shadow-2xl"
            : "ltr:-translate-x-full rtl:translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-[72px] px-6 shrink-0">
          <Link to={adminPath("")} className="flex items-center gap-3">
            <BrandLogo className="w-[72px] text-[#00BFA8] light:text-[#006D5D]" />
            <span className="text-sm text-muted border-s border-line/15 ps-3">
              {t("brand")}
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("nav.closeMenu")}
            className="lg:hidden text-fg/70 hover:text-fg"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-6">
          {groups.map((group, index) => (
            <div key={group.id ?? index} className="mt-5 first:mt-2">
              {group.id && (
                <p className="px-3 mb-2 text-xs font-medium uppercase tracking-wider text-muted/80">
                  {t(`nav.groups.${group.id}`)}
                </p>
              )}
              <ul className="flex flex-col gap-1">
                {group.items.map(({ id, path, icon: Icon }) => (
                  <li key={id}>
                    <NavLink
                      to={adminPath(path)}
                      end={path === ""}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 h-11 px-3 rounded-[10px] text-[15px] transition-colors ${
                          isActive
                            ? "bg-teal-accent/10 text-teal-accent font-medium"
                            : "text-fg/75 hover:bg-surface/[0.05] hover:text-fg"
                        }`
                      }
                    >
                      <Icon size={19} className="shrink-0" />
                      {t(`nav.${id}`)}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-line/10 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 h-10 px-3 rounded-[10px] text-sm text-muted hover:text-fg hover:bg-surface/[0.05] transition-colors"
          >
            <ArrowUpRight size={18} className="rtl:-scale-x-100" />
            {t("nav.backToSite")}
          </Link>
        </div>
      </aside>
    </>
  );
}
