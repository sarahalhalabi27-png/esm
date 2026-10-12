import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useUploadImageMutation } from "../api/fleetApi.js";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";

// One photo slot: shows the photo (or an "Upload photo" box), uploads a
// picked file to the backend and reports its URL through onChange(url);
// onChange(null) removes it. Inside a disabled <fieldset> it's read-only.
export default function ImageUpload({
  value,
  onChange,
  label,
  className = "",
}) {
  const { t } = useTranslation("admin");
  const inputId = useId();
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const [error, setError] = useState("");

  const onPick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // so picking the same file again still fires
    if (!file) return;
    if (!ACCEPT.split(",").includes(file.type)) {
      setError(t("fleet.upload.notImage"));
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(t("fleet.upload.tooLarge"));
      return;
    }
    setError("");
    try {
      const { url } = await uploadImage(file).unwrap();
      onChange(url);
    } catch {
      setError(t("fleet.upload.failed"));
    }
  };

  return (
    <div className={className}>
      <div className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-dashed border-line/20 bg-surface/[0.03]">
        {value ? (
          <img
            src={value}
            alt={label}
            className="h-full w-full object-contain"
          />
        ) : (
          <label
            htmlFor={inputId}
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-sm text-muted transition-colors hover:text-teal-accent [fieldset:disabled_&]:cursor-default [fieldset:disabled_&]:hover:text-muted"
          >
            <ImagePlus size={24} />
            {t("fleet.upload.add")}
          </label>
        )}

        {isLoading && (
          <div
            role="status"
            className="absolute inset-0 grid place-items-center bg-page/70 text-sm text-fg"
          >
            <span className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              {t("fleet.upload.uploading")}
            </span>
          </div>
        )}

        {value && !isLoading && (
          <div className="absolute inset-x-2 bottom-2 flex justify-end gap-2 [fieldset:disabled_&]:hidden">
            <label
              htmlFor={inputId}
              className="cursor-pointer rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-black/80"
            >
              {t("fleet.upload.replace")}
            </label>
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label={t("fleet.upload.remove")}
              title={t("fleet.upload.remove")}
              className="grid h-7 w-7 place-items-center rounded-lg bg-black/60 text-white backdrop-blur transition-colors hover:bg-rose-600"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      <input
        id={inputId}
        type="file"
        accept={ACCEPT}
        onChange={onPick}
        className="sr-only"
        aria-label={label}
      />
      {error && (
        <p
          role="alert"
          className="mt-1.5 text-sm text-red-400 light:text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
