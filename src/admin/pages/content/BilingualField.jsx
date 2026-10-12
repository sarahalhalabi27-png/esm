import { useTranslation } from "react-i18next";
import {
  ADMIN_FIELD_ERROR,
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "../../components/ui.js";

const at = (object, path) =>
  path.split(".").reduce((node, key) => node?.[key], object);

// One text in English and Arabic, side by side (stacked on phones), so the
// two versions can be compared while translating. `name` is the { en, ar }
// field's path, e.g. "items.0.question".
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
  const Input = multiline ? "textarea" : "input";

  return (
    <div>
      <span className={ADMIN_LABEL}>{label}</span>
      <div className="grid gap-3 md:grid-cols-2">
        {["en", "ar"].map((lang) => {
          const path = `${name}.${lang}`;
          const error = at(errors, path);
          const id = `field-${path.replace(/\./g, "-")}`;
          return (
            <div key={lang}>
              <label htmlFor={id} className="mb-1 block text-xs text-muted">
                {lang === "en" ? t("content.english") : t("content.arabic")}
              </label>
              <Input
                id={id}
                dir={lang === "ar" ? "rtl" : "ltr"}
                rows={multiline ? rows : undefined}
                {...register(path)}
                aria-invalid={error ? true : undefined}
                className={`${ADMIN_INPUT} ${multiline ? "h-auto py-2.5 leading-7 resize-y" : ""}`}
              />
              {error && <p className={ADMIN_FIELD_ERROR}>{error.message}</p>}
            </div>
          );
        })}
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
