import { useTranslation } from "react-i18next";
import { Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import ImageUpload from "../../components/ImageUpload.jsx";
import SmallIconButton from "../../components/SmallIconButton.jsx";
import Switch from "../../components/Switch.jsx";
import {
  ADMIN_BUTTON_GHOST,
  ADMIN_CARD,
  ADMIN_FIELD_ERROR,
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "../../components/ui.js";
import BilingualField from "./BilingualField.jsx";
import ContentForm from "./ContentForm.jsx";

// ----- shared bits -----

// A { en, ar } text whose English is required (Arabic falls back to it).
const text = (t, required = true) =>
  z.object({
    en: required ? z.string().trim().min(1, t("content.required")) : z.string(),
    ar: z.string(),
  });

function Card({ className = "", children }) {
  return (
    <section className={`${ADMIN_CARD} p-5 min-w-0 ${className}`}>
      {children}
    </section>
  );
}

// A numbered list item with move up / down / remove buttons.
function ListItem({ title, index, count, move, remove, canEdit, children }) {
  const { t } = useTranslation("admin");
  return (
    <li className={`${ADMIN_CARD} p-5 min-w-0`}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-muted">{title}</span>
        {canEdit && (
          <div className="flex items-center gap-1">
            <SmallIconButton
              icon={ArrowUp}
              label={t("content.moveUp")}
              disabled={index === 0}
              onClick={() => move(index, index - 1)}
            />
            <SmallIconButton
              icon={ArrowDown}
              label={t("content.moveDown")}
              disabled={index === count - 1}
              onClick={() => move(index, index + 1)}
            />
            <SmallIconButton
              icon={Trash2}
              danger
              label={t("content.remove")}
              onClick={() => remove(index)}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </li>
  );
}

function AddButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${ADMIN_BUTTON_GHOST} self-start`}
    >
      <Plus size={16} />
      {label}
    </button>
  );
}

// ----- FAQ -----

const faqSchema = (t) =>
  z.object({
    items: z.array(
      z.object({ id: z.string(), question: text(t), answer: text(t) })
    ),
  });

export function FaqEditor() {
  const { t } = useTranslation("admin");
  return (
    <ContentForm
      contentKey="faq"
      schema={faqSchema}
      hint={t("content.faq.hint")}
    >
      {(form) => <FaqFields {...form} />}
    </ContentForm>
  );
}

function FaqFields({ control, register, errors, canEdit }) {
  const { t } = useTranslation("admin");
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "items",
  });
  return (
    <>
      <p className="text-sm text-muted">{t("content.arabicFallback")}</p>
      {fields.length === 0 && (
        <p className="text-muted">{t("content.faq.empty")}</p>
      )}
      <ol className="flex flex-col gap-4">
        {fields.map((field, index) => (
          <ListItem
            key={field.id}
            title={t("content.faq.item", { number: index + 1 })}
            index={index}
            count={fields.length}
            move={move}
            remove={remove}
            canEdit={canEdit}
          >
            <BilingualField
              name={`items.${index}.question`}
              label={t("content.faq.question")}
              register={register}
              errors={errors}
            />
            <BilingualField
              name={`items.${index}.answer`}
              label={t("content.faq.answer")}
              register={register}
              errors={errors}
              multiline
            />
          </ListItem>
        ))}
      </ol>
      {canEdit && (
        <AddButton
          label={t("content.faq.add")}
          onClick={() =>
            append({
              id: "",
              question: { en: "", ar: "" },
              answer: { en: "", ar: "" },
            })
          }
        />
      )}
    </>
  );
}

// ----- offer banner -----

const promoSchema = (t) =>
  z
    .object({
      enabled: z.boolean(),
      eyebrow: text(t, false),
      heading: text(t),
      headingAccent: text(t, false),
      description: text(t, false),
      cta: text(t),
      image: z.string().nullable(),
    })
    .superRefine((value, ctx) => {
      // The highlighted words must appear in the heading to be shown.
      ["en", "ar"].forEach((lang) => {
        const accent = value.headingAccent[lang].trim();
        if (accent && !value.heading[lang].includes(accent)) {
          ctx.addIssue({
            code: "custom",
            path: ["headingAccent", lang],
            message: t("content.promo.headingAccentHint"),
          });
        }
      });
    });

export function PromoEditor() {
  const { t } = useTranslation("admin");
  return (
    <ContentForm
      contentKey="promo"
      schema={promoSchema}
      hint={t("content.promo.hint")}
    >
      {({ control, register, errors }) => (
        <>
          <Card>
            <Controller
              control={control}
              name="enabled"
              render={({ field: { value, onChange } }) => (
                <label className="flex items-center gap-3 text-[15px] text-fg">
                  <Switch
                    checked={value}
                    onChange={onChange}
                    label={t("content.promo.enabled")}
                  />
                  {t("content.promo.enabled")}
                </label>
              )}
            />
          </Card>
          <div className="grid gap-4 lg:grid-cols-3 items-start">
            <Card className="lg:col-span-2">
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted">
                  {t("content.arabicFallback")}
                </p>
                {[
                  "eyebrow",
                  "heading",
                  "headingAccent",
                  "description",
                  "cta",
                ].map((name) => (
                  <BilingualField
                    key={name}
                    name={name}
                    label={t(`content.promo.${name}`)}
                    register={register}
                    errors={errors}
                    multiline={name === "description"}
                    rows={2}
                    hint={
                      name === "headingAccent"
                        ? t("content.promo.headingAccentHint")
                        : undefined
                    }
                  />
                ))}
              </div>
            </Card>
            <Card>
              <span className={ADMIN_LABEL}>{t("content.promo.image")}</span>
              <Controller
                control={control}
                name="image"
                render={({ field: { value, onChange } }) => (
                  <ImageUpload
                    value={value}
                    onChange={onChange}
                    label={t("content.promo.image")}
                  />
                )}
              />
            </Card>
          </div>
        </>
      )}
    </ContentForm>
  );
}

// ----- partners -----

const partnersSchema = (t) =>
  z.object({
    items: z.array(
      z.object({
        id: z.string(),
        name: z.string().trim().min(1, t("content.required")),
        logo: z
          .string({ error: t("content.partners.logoRequired") })
          .min(1, t("content.partners.logoRequired")),
        url: z.union([
          z.literal(""),
          z
            .string()
            .trim()
            .regex(/^https:\/\/\S+$/i, t("content.partners.urlInvalid")),
        ]),
      })
    ),
  });

export function PartnersEditor() {
  const { t } = useTranslation("admin");
  return (
    <ContentForm
      contentKey="partners"
      schema={partnersSchema}
      hint={t("content.partners.hint")}
    >
      {(form) => <PartnerFields {...form} />}
    </ContentForm>
  );
}

function PartnerFields({ control, register, errors, canEdit }) {
  const { t } = useTranslation("admin");
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "items",
  });
  return (
    <>
      {fields.length === 0 && (
        <p className="text-muted">{t("content.partners.empty")}</p>
      )}
      <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {fields.map((field, index) => {
          const itemErrors = errors.items?.[index];
          return (
            <ListItem
              key={field.id}
              title={t("content.partners.item", { number: index + 1 })}
              index={index}
              count={fields.length}
              move={move}
              remove={remove}
              canEdit={canEdit}
            >
              <div>
                <span className={ADMIN_LABEL}>
                  {t("content.partners.logo")}
                </span>
                <Controller
                  control={control}
                  name={`items.${index}.logo`}
                  render={({ field: { value, onChange } }) => (
                    <ImageUpload
                      value={value || null}
                      onChange={(url) => onChange(url ?? "")}
                      label={t("content.partners.logo")}
                    />
                  )}
                />
                {itemErrors?.logo && (
                  <p className={ADMIN_FIELD_ERROR}>{itemErrors.logo.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor={`partner-${index}-name`}
                  className={ADMIN_LABEL}
                >
                  {t("content.partners.name")}
                </label>
                <input
                  id={`partner-${index}-name`}
                  dir="auto"
                  {...register(`items.${index}.name`)}
                  aria-invalid={itemErrors?.name ? true : undefined}
                  className={ADMIN_INPUT}
                />
                {itemErrors?.name && (
                  <p className={ADMIN_FIELD_ERROR}>{itemErrors.name.message}</p>
                )}
              </div>
              <div>
                <label htmlFor={`partner-${index}-url`} className={ADMIN_LABEL}>
                  {t("content.partners.url")}
                </label>
                <input
                  id={`partner-${index}-url`}
                  type="url"
                  dir="ltr"
                  placeholder="https://"
                  {...register(`items.${index}.url`)}
                  aria-invalid={itemErrors?.url ? true : undefined}
                  className={ADMIN_INPUT}
                />
                {itemErrors?.url && (
                  <p className={ADMIN_FIELD_ERROR}>{itemErrors.url.message}</p>
                )}
              </div>
            </ListItem>
          );
        })}
      </ol>
      {canEdit && (
        <AddButton
          label={t("content.partners.add")}
          onClick={() => append({ id: "", name: "", logo: "", url: "" })}
        />
      )}
    </>
  );
}

// ----- legal pages -----

const legalSchema = (t) =>
  z.object({
    title: text(t),
    intro: text(t, false),
    sections: z.array(
      z.object({ id: z.string(), heading: text(t), body: text(t, false) })
    ),
  });

export function LegalEditor({ page }) {
  const { t } = useTranslation("admin");
  return (
    <ContentForm
      contentKey={page}
      schema={legalSchema}
      hint={t("content.legal.hint", { page: t(`content.tabs.${page}`) })}
    >
      {(form) => <LegalFields {...form} />}
    </ContentForm>
  );
}

function LegalFields({ control, register, errors, canEdit }) {
  const { t } = useTranslation("admin");
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "sections",
  });
  return (
    <>
      <Card>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted">{t("content.arabicFallback")}</p>
          <BilingualField
            name="title"
            label={t("content.legal.title")}
            register={register}
            errors={errors}
          />
          <BilingualField
            name="intro"
            label={t("content.legal.intro")}
            register={register}
            errors={errors}
            multiline
          />
        </div>
      </Card>
      <ol className="flex flex-col gap-4">
        {fields.map((field, index) => (
          <ListItem
            key={field.id}
            title={t("content.legal.section", { number: index + 1 })}
            index={index}
            count={fields.length}
            move={move}
            remove={remove}
            canEdit={canEdit}
          >
            <BilingualField
              name={`sections.${index}.heading`}
              label={t("content.legal.heading")}
              register={register}
              errors={errors}
            />
            <BilingualField
              name={`sections.${index}.body`}
              label={t("content.legal.body")}
              register={register}
              errors={errors}
              multiline
              rows={6}
            />
          </ListItem>
        ))}
      </ol>
      {canEdit && (
        <AddButton
          label={t("content.legal.add")}
          onClick={() =>
            append({
              id: "",
              heading: { en: "", ar: "" },
              body: { en: "", ar: "" },
            })
          }
        />
      )}
    </>
  );
}
