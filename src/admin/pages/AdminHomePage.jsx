import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldOff } from "lucide-react";
import AdminMessage from "../components/AdminMessage.jsx";
import OverviewPage from "./OverviewPage.jsx";
import { ADMIN_NAV_ITEMS, adminPath } from "../navigation.js";
import { P } from "../permissions.js";
import useCan from "../hooks/useCan.js";

// /admin: the Overview for staff who may see it; anyone else lands on the
// first tab their role allows (e.g. a content editor on Blog).
export default function AdminHomePage() {
  const { t } = useTranslation("admin");
  const can = useCan();

  if (can(P.dashboard.view)) return <OverviewPage />;

  const firstTab = ADMIN_NAV_ITEMS.find(
    (item) => item.path && can(item.permission)
  );
  if (firstTab) return <Navigate to={adminPath(firstTab.path)} replace />;

  return (
    <AdminMessage
      icon={ShieldOff}
      title={t("access.noAccessTitle")}
      body={t("access.noAccessBody")}
    />
  );
}
