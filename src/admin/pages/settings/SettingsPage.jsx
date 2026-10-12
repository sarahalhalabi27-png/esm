import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Switch from "../../components/Switch.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_CARD,
  ADMIN_FIELD_ERROR,
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "../../components/ui.js";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../../api/settingsApi.js";
import useCan from "../../hooks/useCan.js";
import { P } from "../../permissions.js";
import { formatDateTime } from "../../utils/format.js";

const SOCIALS = ["instagram", "facebook", "linkedin", "twitter"];
const NOTIFICATIONS = ["newBooking", "newMessage", "newComment"];

function settingsSchema(t) {
  const required = t("settings.validation.required");
  const phone = z
    .string()
    .trim()
    .regex(/^\+?[\d\s-]{7,20}$/, t("settings.validation.phone"));
  const optionalPhone = z.union([z.literal(""), phone]);
  const email = z
    .string()
    .trim()
    .pipe(z.email(t("settings.validation.email")));
  const url = z.union([
    z.literal(""),
    z
      .string()
      .trim()
      .regex(/^https:\/\/\S+$/i, t("settings.validation.url")),
  ]);
  const bilingual = z.object({
    en: z.string().trim().min(1, required),
    ar: z.string().trim().min(1, required),
  });

  return z.object({
    contact: z.object({
      phone,
      secondaryPhone: optionalPhone,
      whatsapp: phone,
      email,
      address: bilingual,
      hours: bilingual,
    }),
    socials: z.object(Object.fromEntries(SOCIALS.map((s) => [s, url]))),
    notifications: z.object({
      email,
      newBooking: z.boolean(),
      newMessage: z.boolean(),
      newComment: z.boolean(),
    }),
  });
}

const toFormValues = ({ contact, socials, notifications }) => ({
  contact,
  socials,
  notifications,
});

// Contact details, social links and alert emails. Read-only without
// settings.update.
export default function SettingsPage() {
  const { t } = useTranslation("admin");
  const { data, isLoading, isError, refetch } = useGetSettingsQuery();

  if (isLoading) {
    return <AdminMessage icon={Loader2} spin title={t("common.loading")} />;
  }
  if (isError) {
    return (
      <div className={ADMIN_CARD}>
        <AdminMessage
          icon={AlertCircle}
          title={t("common.loadFailed")}
          action={
            <button type="button" className={ADMIN_BUTTON} onClick={refetch}>
              {t("common.retry")}
            </button>
          }
        />
      </div>
    );
  }
  return <SettingsForm settings={data} />;
}

function SettingsForm({ settings }) {
  const { t, i18n } = useTranslation("admin");
  const can = useCan();
  const canEdit = can(P.settings.update);
  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();
  const [result, setResult] = useState(null); // "saved" | "failed"

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(settingsSchema(t)),
    defaultValues: toFormValues(settings),
  });

  const onSubmit = async (values) => {
    setResult(null);
    try {
      const saved = await updateSettings(values).unwrap();
      reset(toFormValues(saved));
      setResult("saved");
    } catch {
      setResult("failed");
    }
  };

  // A labelled input for a dotted field name ("contact.phone").
  const field = (name, { dir, type = "text", placeholder } = {}) => {
    const error = name.split(".").reduce((node, key) => node?.[key], errors);
    const id = `settings-${name.replace(/\./g, "-")}`;
    return (
      <div>
        <label htmlFor={id} className={ADMIN_LABEL}>
          {t(`settings.fields.${labelKey(name)}`)}
        </label>
        <input
          id={id}
          type={type}
          dir={dir}
          placeholder={placeholder}
          {...register(name)}
          aria-invalid={error ? true : undefined}
          className={ADMIN_INPUT}
        />
        {error && <p className={ADMIN_FIELD_ERROR}>{error.message}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="mb-5 text-sm text-muted">
        {t("settings.lastUpdated", {
          date: formatDateTime(settings.updatedAt, i18n.language),
        })}
      </p>

      <fieldset disabled={!canEdit} className="flex flex-col gap-4 min-w-0">
        <Section
          title={t("settings.sections.contact")}
          hint={t("settings.sections.contactHint")}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {field("contact.phone", { dir: "ltr", type: "tel" })}
            {field("contact.secondaryPhone", { dir: "ltr", type: "tel" })}
            {field("contact.whatsapp", { dir: "ltr", type: "tel" })}
            {field("contact.email", { dir: "ltr", type: "email" })}
            {field("contact.address.en", { dir: "ltr" })}
            {field("contact.address.ar", { dir: "rtl" })}
            {field("contact.hours.en", { dir: "ltr" })}
            {field("contact.hours.ar", { dir: "rtl" })}
          </div>
        </Section>

        <Section
          title={t("settings.sections.socials")}
          hint={t("settings.sections.socialsHint")}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {SOCIALS.map((social) => (
              <div key={social}>
                {field(`socials.${social}`, {
                  dir: "ltr",
                  type: "url",
                  placeholder: "https://",
                })}
              </div>
            ))}
          </div>
        </Section>

        <Section
          title={t("settings.sections.notifications")}
          hint={t("settings.sections.notificationsHint")}
        >
          <div className="md:max-w-md">
            {field("notifications.email", { dir: "ltr", type: "email" })}
          </div>
          <ul className="mt-5 flex flex-col gap-4">
            {NOTIFICATIONS.map((key) => (
              <li key={key}>
                <Controller
                  control={control}
                  name={`notifications.${key}`}
                  render={({ field: { value, onChange } }) => (
                    <label className="flex items-center gap-3 text-[15px] text-fg/90">
                      <Switch
                        checked={value}
                        onChange={onChange}
                        label={t(`settings.fields.${key}`)}
                      />
                      {t(`settings.fields.${key}`)}
                    </label>
                  )}
                />
              </li>
            ))}
          </ul>
        </Section>
      </fieldset>

      {canEdit && (
        <div className="sticky bottom-0 z-10 -mx-4 md:-mx-8 mt-6 flex flex-wrap items-center justify-end gap-4 border-t border-line/10 bg-page/90 px-4 md:px-8 py-4 backdrop-blur">
          {result === "saved" && !isDirty && (
            <p
              role="status"
              className="me-auto flex items-center gap-2 text-sm text-emerald-400 light:text-emerald-700"
            >
              <CheckCircle2 size={17} />
              {t("settings.saved")}
            </p>
          )}
          {result === "failed" && (
            <p
              role="alert"
              className="me-auto text-sm text-red-400 light:text-red-600"
            >
              {t("common.actionFailed")}
            </p>
          )}
          <button
            type="submit"
            disabled={isSaving || !isDirty}
            className={`${ADMIN_BUTTON} disabled:cursor-not-allowed`}
          >
            {isSaving && <Loader2 size={17} className="animate-spin" />}
            {t("settings.save")}
          </button>
        </div>
      )}
    </form>
  );
}

// "contact.address.en" -> "addressEn", "notifications.email" -> "notifyEmail".
function labelKey(name) {
  if (name === "notifications.email") return "notifyEmail";
  const parts = name.split(".").slice(1);
  return parts
    .map((part, index) =>
      index ? part[0].toUpperCase() + part.slice(1) : part
    )
    .join("");
}

function Section({ title, hint, children }) {
  return (
    <section className={`${ADMIN_CARD} p-5`}>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
        {title}
      </h3>
      {hint && <p className="mt-1 mb-4 text-sm text-muted">{hint}</p>}
      {children}
    </section>
  );
}
