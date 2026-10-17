import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// The small centred window the date and time pickers open in, laid out like
// the website's booking pickers (a title, the selects, Cancel and Done). It
// is a <dialog>, so focus trap, Esc and the backdrop come from the browser;
// children mount only while it's open, so the selects start fresh each time.
export default function PickerDialog({
  open,
  title,
  onClose,
  width = 310,
  children,
}) {
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
      onClick={(event) => event.target === dialogRef.current && onClose()}
      aria-label={title}
      style={{ width: `min(${width}px, calc(100vw - 32px))` }}
      className="rounded-2xl border border-line/20 bg-page p-0 text-fg shadow-2xl backdrop:bg-black/60"
    >
      {open && (
        <div className="p-[18px]">
          <h3 className="mb-4 text-center text-[18px] font-semibold">
            {title}
          </h3>
          {children}
        </div>
      )}
    </dialog>
  );
}

// Cancel on the left, Done on the right in both languages (as on the site).
// `onClear` adds a quiet "Clear" link under them for optional fields.
export function PickerActions({ onCancel, onDone, onClear }) {
  const { t } = useTranslation();
  const { t: tAdmin } = useTranslation("admin");

  return (
    <>
      <div dir="ltr" className="mt-5 flex justify-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-[38px] flex-1 rounded-[8px] border border-line text-[14px] font-semibold text-fg"
        >
          {t("booking.cancel")}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="h-[38px] flex-1 rounded-[8px] bg-teal-accent text-[14px] font-semibold text-page"
        >
          {t("booking.done")}
        </button>
      </div>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="mx-auto mt-3 block text-sm text-muted hover:text-fg"
        >
          {tAdmin("common.clear")}
        </button>
      )}
    </>
  );
}
