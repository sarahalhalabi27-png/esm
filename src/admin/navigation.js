import {
  CalendarCheck,
  CarFront,
  FileText,
  LayoutDashboard,
  LayoutTemplate,
  Mail,
  MessageSquare,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import { P } from "./permissions.js";

export const ADMIN_BASE = "/admin";

// The dashboard's tabs, grouped as in the sidebar. A tab shows (and its route
// opens) only for staff whose permissions include its `permission` key.
// `id` names the tab's page (see AdminApp) and its translation keys
// (nav.<id>, and pages.<id>.description).
export const ADMIN_NAV = [
  {
    items: [
      {
        id: "overview",
        path: "",
        icon: LayoutDashboard,
        permission: P.dashboard.view,
      },
    ],
  },
  {
    id: "operations",
    items: [
      {
        id: "bookings",
        path: "bookings",
        icon: CalendarCheck,
        permission: P.bookings.view,
      },
      { id: "fleet", path: "fleet", icon: CarFront, permission: P.fleet.view },
      {
        id: "messages",
        path: "messages",
        icon: Mail,
        permission: P.messages.view,
      },
    ],
  },
  {
    id: "content",
    items: [
      { id: "blog", path: "blog", icon: FileText, permission: P.blog.view },
      {
        id: "comments",
        path: "comments",
        icon: MessageSquare,
        permission: P.comments.view,
      },
      {
        id: "siteContent",
        path: "content",
        icon: LayoutTemplate,
        permission: P.content.view,
      },
    ],
  },
  {
    id: "people",
    items: [
      {
        id: "customers",
        path: "customers",
        icon: Users,
        permission: P.customers.view,
      },
      { id: "staff", path: "staff", icon: UserCog, permission: P.staff.view },
      {
        id: "roles",
        path: "roles",
        icon: ShieldCheck,
        permission: P.roles.view,
      },
    ],
  },
  {
    id: "system",
    items: [
      {
        id: "settings",
        path: "settings",
        icon: Settings,
        permission: P.settings.view,
      },
    ],
  },
];

export const ADMIN_NAV_ITEMS = ADMIN_NAV.flatMap((group) => group.items);

export const adminPath = (path) =>
  path ? `${ADMIN_BASE}/${path}` : ADMIN_BASE;
