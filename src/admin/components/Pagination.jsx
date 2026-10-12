import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ADMIN_BUTTON_GHOST } from "./ui.js";

// "1–10 of 56" with Previous / Next. Hidden when there's nothing to show.
export default function Pagination({ page, pageSize, total, onPageChange }) {
  const { t } = useTranslation("admin");
  if (!total) return null;

  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between gap-4 mt-4">
      <p className="text-sm text-muted" aria-live="polite">
        {t("common.showing", { from, to, total })}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          className={`${ADMIN_BUTTON_GHOST} disabled:opacity-40 disabled:pointer-events-none`}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} className="rtl:-scale-x-100" />
          <span className="max-sm:sr-only">{t("common.previous")}</span>
        </button>
        <button
          type="button"
          className={`${ADMIN_BUTTON_GHOST} disabled:opacity-40 disabled:pointer-events-none`}
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
        >
          <span className="max-sm:sr-only">{t("common.next")}</span>
          <ChevronRight size={16} className="rtl:-scale-x-100" />
        </button>
      </div>
    </div>
  );
}
