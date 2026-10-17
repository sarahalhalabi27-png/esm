import { useEffect, useId, useRef } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

// A modal window with a title and a close button, built on <dialog> (focus
// trap, Esc and the backdrop come from the browser). Children mount only
// while it's open, so a form inside starts fresh each time.
export default function Modal({ open, title, onClose, children, width = 520 }) {
  const { t } = useTranslation("admin");
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby={titleId}
      style={{ width: `min(${width}px, calc(100vw - 32px))` }}
      className="max-h-[calc(100vh-64px)] rounded-2xl border border-line/10 bg-page p-0 text-fg shadow-2xl backdrop:bg-black/60"
    >
      <div className="flex items-center justify-between gap-4 border-b border-line/10 px-6 py-4">
        <h2 id={titleId} className="text-lg font-semibold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="text-fg/70 hover:text-fg"
        >
          <X size={22} />
        </button>
      </div>
      {open && <div className="px-6 py-5">{children}</div>}
    </dialog>
  );
}
