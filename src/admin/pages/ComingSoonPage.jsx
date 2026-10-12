import { useTranslation } from "react-i18next";
import { Construction } from "lucide-react";
import AdminMessage from "../components/AdminMessage.jsx";
import { ADMIN_CARD } from "../components/ui.js";

// Placeholder for a tab whose page isn't built yet.
export default function ComingSoonPage() {
  const { t } = useTranslation("admin");
  return (
    <div className={ADMIN_CARD}>
      <AdminMessage
        icon={Construction}
        title={t("comingSoon.title")}
        body={t("comingSoon.body")}
      />
    </div>
  );
}
