import { useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronDown,
  ClipboardList,
  Newspaper,
  SlidersHorizontal,
  UsersRound,
  X,
} from "lucide-react";
import BrandLogo from "../../components/common/BrandLogo.jsx";
import { ADMIN_NAV, adminPath } from "../navigation.js";
import useCan from "../hooks/useCan.js";
import { useGetMessageStatsQuery } from "../api/messagesApi.js";
import { useGetCommentStatsQuery } from "../api/blogApi.js";

const DESKTOP_QUERY = "(min-width: 1024px)"; // Tailwind lg

// Counts beside a tab ("3 unread"), checked every minute. Each is only
// rendered for staff who can see that tab (it's hidden otherwise).
const POLL = { pollingInterval: 60_000 };

function CountBadge({ count, label }) {
  if (!count) return null;
  return (
    <span className="ms-auto min-w-6 h-6 px-1.5 grid place-items-center rounded-full bg-teal-accent text-xs font-semibold text-page">
      {count}
      <span className="sr-only"> {label}</span>
    </span>
  );
}

function UnreadMessagesBadge() {
  const { t } = useTranslation("admin");
  const { data } = useGetMessageStatsQuery(undefined, POLL);
  return <CountBadge count={data?.unread} label={t("messages.unread")} />;
}

function PendingCommentsBadge() {
  const { t } = useTranslation("admin");
  const { data } = useGetCommentStatsQuery(undefined, POLL);
  return (
    <CountBadge count={data?.pending} label={t("comments.views.pending")} />
  );
}

// Each group's icon, and the count shown on its header while it is closed
// (so "3 unread messages" isn't hidden inside a closed group).
const GROUP_ICONS = {
  operations: ClipboardList,
  content: Newspaper,
  people: UsersRound,
  system: SlidersHorizontal,
};
const GROUP_BADGES = {
  operations: UnreadMessagesBadge,
  content: PendingCommentsBadge,
};

// Whether the URL is on this tab's page (or one inside it, e.g. a booking).
const isOnTab = (pathname, path) =>
  pathname === adminPath(path) ||
  (path !== "" && pathname.startsWith(`${adminPath(path)}/`));

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

// One page link (a tab).
function TabLink({
  item: { id, path, icon: Icon },
  onNavigate,
  nested = false,
}) {
  const { t } = useTranslation("admin");
  return (
    <NavLink
      to={adminPath(path)}
      end={path === ""}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-[10px] transition-colors ${
          nested ? "h-10 px-3 text-[14.5px]" : "h-11 px-3 text-[15px]"
        } ${
          isActive
            ? "bg-teal-accent/10 text-teal-accent font-medium"
            : "text-fg/75 hover:bg-surface/[0.05] hover:text-fg"
        }`
      }
    >
      <Icon size={nested ? 18 : 19} className="shrink-0" />
      {t(`nav.${id}`)}
      {id === "messages" && <UnreadMessagesBadge />}
      {id === "comments" && <PendingCommentsBadge />}
    </NavLink>
  );
}

// A closed list of pages under a title; the title opens and closes it.
function NavGroup({ group, open, hasActive, onToggle, onNavigate }) {
  const { t } = useTranslation("admin");
  const panelId = useId();
  const Icon = GROUP_ICONS[group.id];
  const Badge = GROUP_BADGES[group.id];

  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={`flex h-11 w-full items-center gap-3 rounded-[10px] px-3 text-start text-[15px] transition-colors ${
          hasActive && !open
            ? "text-teal-accent font-medium"
            : "text-fg/80 hover:bg-surface/[0.05] hover:text-fg"
        }`}
      >
        {Icon && <Icon size={19} className="shrink-0" />}
        <span className="flex-1">{t(`nav.groups.${group.id}`)}</span>
        {!open && Badge && <Badge />}
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`shrink-0 text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Opens by growing from zero height; closed, its links are out of the
          tab order. */}
      <div
        id={panelId}
        inert={open ? undefined : ""}
        className={`grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <ul className="ms-[21px] flex min-h-0 flex-col gap-0.5 overflow-hidden border-s border-line/10 ps-2">
          {group.items.map((item) => (
            <li key={item.id} className="first:mt-1 last:mb-1">
              <TabLink item={item} onNavigate={onNavigate} nested />
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
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

  // The groups are closed lists of pages. Each opens and closes on its own by
  // clicking its title (opening one never closes another), and going to a page
  // opens its group, keeping the ones already open.
  const { pathname, key: visit } = useLocation();
  const activeGroupId =
    groups.find((group) =>
      group.items.some((item) => isOnTab(pathname, item.path))
    )?.id ?? null;
  const [nav, setNav] = useState({
    visit,
    open: activeGroupId ? [activeGroupId] : [],
  });
  if (nav.visit !== visit) {
    // A new page: remember it, and open its group.
    setNav({
      visit,
      open:
        activeGroupId && !nav.open.includes(activeGroupId)
          ? [...nav.open, activeGroupId]
          : nav.open,
    });
  }
  const openGroups = nav.open;
  const toggleGroup = (id) =>
    setNav({
      visit,
      open: openGroups.includes(id)
        ? openGroups.filter((openId) => openId !== id)
        : [...openGroups, id],
    });

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

        {/* The list scrolls when it must, with no scrollbar drawn. */}
        <nav className="flex-1 overflow-y-auto px-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="mt-2 flex flex-col gap-1">
            {groups.map((group, index) =>
              group.id ? (
                <NavGroup
                  key={group.id}
                  group={group}
                  open={openGroups.includes(group.id)}
                  hasActive={activeGroupId === group.id}
                  onToggle={() => toggleGroup(group.id)}
                  onNavigate={onClose}
                />
              ) : (
                // The Overview (not in a group) is always a plain link.
                group.items.map((item) => (
                  <li key={`${index}-${item.id}`}>
                    <TabLink item={item} onNavigate={onClose} />
                  </li>
                ))
              )
            )}
          </ul>
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
