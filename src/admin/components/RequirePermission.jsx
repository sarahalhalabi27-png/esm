import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ShieldOff } from "lucide-react";
import AdminMessage from "./AdminMessage.jsx";
import { ADMIN_BUTTON } from "./ui.js";
import { ADMIN_BASE } from "../navigation.js";
import useCan from "../hooks/useCan.js";

// Shows its page only to staff with `permission`; anyone else (e.g. someone
// who typed the URL) gets a "no access" message. The backend refuses their
// requests anyway; this only keeps the UI honest.
export default function RequirePermission({ permission, children }) {
  const { t } = useTranslation("admin");
  const can = useCan();

  if (can(permission)) return children;

  return (
    <AdminMessage
      icon={ShieldOff}
      title={t("access.forbiddenTitle")}
      body={t("access.forbiddenBody")}
      action={
        <Link to={ADMIN_BASE} className={ADMIN_BUTTON}>
          {t("access.goHome")}
        </Link>
      }
    />
  );
}
