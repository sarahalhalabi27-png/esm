import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";
import { ADMIN_BUTTON_GHOST } from "./ui.js";

// A modal "are you sure?" for destructive actions, built on <dialog> (focus
// trap, Esc to close and the backdrop come from the browser).
export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  busy = false,
  onConfirm,
  onClose,
}) {
  const { t } = useTranslation("admin");
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="w-[min(440px,calc(100vw-32px))] rounded-2xl border border-line/10 bg-page p-6 text-fg shadow-2xl backdrop:bg-black/60"
    >
      <div className="flex gap-4">
        <span className="grid place-items-center w-11 h-11 shrink-0 rounded-full bg-rose-500/15 text-rose-400 light:text-rose-700">
          <AlertTriangle size={20} />
        </span>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {body && <p className="mt-1.5 text-[15px] text-muted">{body}</p>}
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button type="button" className={ADMIN_BUTTON_GHOST} onClick={onClose}>
          {t("common.cancel")}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onConfirm}
          className="inline-flex h-10 items-center justify-center rounded-[10px] bg-rose-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-rose-500 disabled:cursor-wait disabled:opacity-60"
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
