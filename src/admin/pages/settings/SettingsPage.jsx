import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertCircle,
  Bell,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Contact,
  Facebook,
  Inbox,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  MessagesSquare,
  Phone,
  Share2,
  Smartphone,
  Twitter,
} from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Switch from "../../components/Switch.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_CARD,
  ADMIN_CARD_RICH,
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
import UnsavedChangesDialog from "../../components/UnsavedChangesDialog.jsx";
import useUnsavedChanges from "../../hooks/useUnsavedChanges.js";

const SOCIALS = ["instagram", "facebook", "linkedin", "twitter"];
const NOTIFICATIONS = ["newBooking", "newMessage", "newComment"];

// The icon in front of each field, in a soft colour of its own where it has
// one (the social platforms and WhatsApp).
const FIELD_ICONS = {
  "contact.phone": { icon: Phone },
  "contact.secondaryPhone": { icon: Smartphone },
  "contact.whatsapp": {
    icon: MessageCircle,
    color: "text-emerald-400 light:text-emerald-600",
  },
  "contact.email": { icon: Mail },
  "contact.address.en": { icon: MapPin },
  "contact.address.ar": { icon: MapPin },
  "contact.hours.en": { icon: Clock },
  "contact.hours.ar": { icon: Clock },
  "socials.instagram": {
    icon: Instagram,
    color: "text-pink-400 light:text-pink-600",
  },
  "socials.facebook": {
    icon: Facebook,
    color: "text-blue-400 light:text-blue-600",
  },
  "socials.linkedin": {
    icon: Linkedin,
    color: "text-sky-400 light:text-sky-600",
  },
  "socials.twitter": { icon: Twitter, color: "text-fg/80" },
  "notifications.email": { icon: Mail },
};

// What each alert switch is about: its icon, and the colour of its square.
const NOTIFICATION_ICONS = {
  newBooking: {
    icon: CalendarCheck,
    chip: "bg-amber-400/15 text-amber-300 light:bg-amber-500/15 light:text-amber-700",
  },
  newMessage: {
    icon: Inbox,
    chip: "bg-sky-400/15 text-sky-300 light:bg-sky-500/15 light:text-sky-700",
  },
  newComment: {
    icon: MessagesSquare,
    chip: "bg-violet-400/15 text-violet-300 light:bg-violet-500/15 light:text-violet-700",
  },
};

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
  const { blocker } = useUnsavedChanges(isDirty);

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

  // A labelled input for a dotted field name ("contact.phone"), with its icon
  // at the start. The wrapper takes the input's own direction, so the icon
  // sits on the same side as the text starts.
  const field = (name, { dir, type = "text", placeholder } = {}) => {
    const error = name.split(".").reduce((node, key) => node?.[key], errors);
    const id = `settings-${name.replace(/\./g, "-")}`;
    const { icon: Icon, color = "text-muted" } = FIELD_ICONS[name] ?? {};
    return (
      <div>
        <label htmlFor={id} className={ADMIN_LABEL}>
          {t(`settings.fields.${labelKey(name)}`)}
        </label>
        <div dir={dir} className="relative">
          {Icon && (
            <Icon
              size={17}
              aria-hidden="true"
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 start-3.5 ${color}`}
            />
          )}
          <input
            id={id}
            type={type}
            dir={dir}
            placeholder={placeholder}
            {...register(name)}
            aria-invalid={error ? true : undefined}
            className={`${ADMIN_INPUT} ${Icon ? "ps-10" : ""}`}
          />
        </div>
        {error && <p className={ADMIN_FIELD_ERROR}>{error.message}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-sky-400/15 px-3 py-1.5 text-sm font-medium text-sky-300 light:bg-sky-500/15 light:text-sky-700">
        <Clock size={14} className="shrink-0" />
        {t("settings.lastUpdated", {
          date: formatDateTime(settings.updatedAt, i18n.language),
        })}
      </p>

      <fieldset disabled={!canEdit} className="flex flex-col gap-4 min-w-0">
        <Section
          icon={Contact}
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
          icon={Share2}
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
          icon={Bell}
          title={t("settings.sections.notifications")}
          hint={t("settings.sections.notificationsHint")}
        >
          <div className="md:max-w-md">
            {field("notifications.email", { dir: "ltr", type: "email" })}
          </div>
          <ul className="mt-5 flex flex-col gap-3">
            {NOTIFICATIONS.map((key) => {
              const { icon: Icon, chip } = NOTIFICATION_ICONS[key];
              return (
                <li key={key}>
                  <Controller
                    control={control}
                    name={`notifications.${key}`}
                    render={({ field: { value, onChange } }) => (
                      <label
                        className={`flex items-center gap-3 rounded-xl border p-3.5 transition-colors ${
                          value
                            ? "border-teal-accent/30 bg-teal-accent/[0.06]"
                            : "border-line/10 bg-surface/[0.02]"
                        }`}
                      >
                        <span
                          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${chip}`}
                        >
                          <Icon size={19} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] font-medium text-fg">
                            {t(`settings.fields.${key}`)}
                          </span>
                          <span className="mt-0.5 block text-sm text-muted">
                            {t(`settings.fields.${key}Hint`)}
                          </span>
                        </span>
                        <Switch
                          checked={value}
                          onChange={onChange}
                          label={t(`settings.fields.${key}`)}
                        />
                      </label>
                    )}
                  />
                </li>
              );
            })}
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
            aria-busy={isSaving}
            className={`${ADMIN_BUTTON}`}
          >
            {isSaving && <Loader2 size={17} className="animate-spin" />}
            {t("settings.save")}
          </button>
        </div>
      )}
      <UnsavedChangesDialog blocker={blocker} />
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

function Section({ icon: Icon, title, hint, children }) {
  return (
    <section className={`${ADMIN_CARD_RICH} p-5`}>
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-accent/15 text-teal-accent">
          <Icon size={18} />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-fg">{title}</h3>
          {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}
