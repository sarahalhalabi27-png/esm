import { useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ADMIN_FIELD_ERROR,
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "../../components/ui.js";

const at = (object, path) =>
  path.split(".").reduce((node, key) => node?.[key], object);

// Makes the textareas exactly as tall as the longest of their texts (never
// shorter than their `rows`), so none has a scrollbar and the English and
// Arabic boxes stay level with each other.
function fitHeights(boxes) {
  boxes.forEach((box) => {
    box.style.height = "auto";
  });
  const tallest = Math.max(
    ...boxes.map(
      (box) => box.scrollHeight + box.offsetHeight - box.clientHeight
    )
  );
  boxes.forEach((box) => {
    box.style.height = `${tallest}px`;
  });
}

// One text in English and Arabic, side by side (stacked on phones), so the
// two versions can be compared while translating. `name` is the { en, ar }
// field's path, e.g. "items.0.question". A multiline field grows with its
// longer text instead of scrolling, both boxes at the same height; `rows` is
// its minimum height.
export default function BilingualField({
  name,
  label,
  register,
  errors,
  multiline = false,
  rows = 3,
  hint,
}) {
  const { t } = useTranslation("admin");
  const grid = useRef(null);

  const fit = () => {
    if (!multiline || !grid.current) return;
    fitHeights([...grid.current.querySelectorAll("textarea")]);
  };

  // Refit after every render: covers typing and values set by the form itself
  // (loading, saving, resetting).
  useLayoutEffect(fit);

  // Refit when the boxes get wider or narrower, as the text re-wraps.
  useLayoutEffect(() => {
    const box = grid.current;
    if (!multiline || !box || typeof ResizeObserver === "undefined") {
      return undefined;
    }
    let width = box.offsetWidth;
    const observer = new ResizeObserver(() => {
      if (box.offsetWidth !== width) {
        width = box.offsetWidth;
        fitHeights([...box.querySelectorAll("textarea")]);
      }
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, [multiline]);

  return (
    <div>
      <span className={ADMIN_LABEL}>{label}</span>
      <div ref={grid} className="grid gap-3 md:grid-cols-2">
        {["en", "ar"].map((lang) => {
          const path = `${name}.${lang}`;
          const error = at(errors, path);
          const id = `field-${path.replace(/\./g, "-")}`;
          const registration = register(path);
          const shared = {
            id,
            dir: lang === "ar" ? "rtl" : "ltr",
            "aria-invalid": error ? true : undefined,
          };
          return (
            <div key={lang}>
              <label htmlFor={id} className="mb-1 block text-xs text-muted">
                {lang === "en" ? t("content.english") : t("content.arabic")}
              </label>
              {multiline ? (
                <textarea
                  {...shared}
                  {...registration}
                  rows={rows}
                  onChange={(event) => {
                    registration.onChange(event);
                    fit();
                  }}
                  className={`${ADMIN_INPUT} h-auto resize-none overflow-hidden py-2.5 leading-7`}
                />
              ) : (
                <input {...shared} {...registration} className={ADMIN_INPUT} />
              )}
              {error && <p className={ADMIN_FIELD_ERROR}>{error.message}</p>}
            </div>
          );
        })}
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
