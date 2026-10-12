import { useTranslation } from "react-i18next";
import ConfirmDialog from "./ConfirmDialog.jsx";

// "Leave without saving?" for a blocker from useUnsavedChanges.
export default function UnsavedChangesDialog({ blocker }) {
  const { t } = useTranslation("admin");
  return (
    <ConfirmDialog
      open={blocker.state === "blocked"}
      title={t("unsaved.title")}
      body={t("unsaved.body")}
      confirmLabel={t("unsaved.leave")}
      cancelLabel={t("unsaved.stay")}
      onConfirm={() => blocker.proceed?.()}
      onClose={() => blocker.reset?.()}
    />
  );
}
