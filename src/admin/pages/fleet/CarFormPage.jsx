import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  SearchX,
  Star,
  Trash2,
} from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Can from "../../components/Can.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import ImageUpload from "../../components/ImageUpload.jsx";
import Switch from "../../components/Switch.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_CARD,
  ADMIN_FIELD_ERROR,
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "../../components/ui.js";
import {
  useCreateCarMutation,
  useDeleteCarMutation,
  useGetCarQuery,
  useGetCategoriesQuery,
  useUpdateCarMutation,
} from "../../api/fleetApi.js";
import {
  CAR_FEATURES,
  CAR_FUELS,
  MAX_INTERIOR_IMAGES,
} from "../../api/mockFleet.js";
import useCan from "../../hooks/useCan.js";
import { adminPath } from "../../navigation.js";
import { P } from "../../permissions.js";
import { categoryName } from "../../utils/fleet.js";
import UnsavedChangesDialog from "../../components/UnsavedChangesDialog.jsx";
import useUnsavedChanges from "../../hooks/useUnsavedChanges.js";

// The form keeps numbers as typed text; they become numbers on submit.
function carSchema(t) {
  const maxYear = new Date().getFullYear() + 1;
  const required = t("fleet.validation.required");
  const wholeNumber = (min) =>
    z
      .string()
      .trim()
      .min(1, required)
      .regex(/^\d+$/, t("fleet.validation.whole"))
      .refine((v) => Number(v) >= min, t("fleet.validation.positive"));

  return z.object({
    name: z.string().trim().min(1, required),
    categoryId: z.string().min(1, required),
    modelYear: z
      .string()
      .trim()
      .refine(
        (v) => /^\d{4}$/.test(v) && Number(v) >= 1990 && Number(v) <= maxYear,
        t("fleet.validation.year", { max: maxYear })
      ),
    fuel: z.enum(CAR_FUELS),
    pricePerHour: z
      .string()
      .trim()
      .min(1, required)
      .refine(
        (v) => /^\d+(\.\d{1,2})?$/.test(v) && Number(v) > 0,
        t("fleet.validation.positive")
      ),
    passengers: wholeNumber(1),
    luggage: wholeNumber(0),
    features: z.array(z.string()),
    descriptionEn: z.string(),
    descriptionAr: z.string(),
    image: z.string().nullable(),
    interiorImages: z.array(z.string()),
    published: z.boolean(),
  });
}

function toFormValues(car) {
  return {
    name: car?.name ?? "",
    categoryId: car?.categoryId ?? "",
    modelYear: String(car?.modelYear ?? new Date().getFullYear()),
    fuel: car?.fuel ?? "petrol",
    pricePerHour: car ? String(car.pricePerHour) : "",
    passengers: String(car?.passengers ?? 4),
    luggage: String(car?.luggage ?? 2),
    features: car?.features ?? [...CAR_FEATURES],
    descriptionEn: car?.description?.en ?? "",
    descriptionAr: car?.description?.ar ?? "",
    image: car?.image ?? null,
    interiorImages: car?.interiorImages ?? [],
    published: car?.published ?? false,
  };
}

function toPayload(values) {
  return {
    name: values.name.trim(),
    categoryId: values.categoryId,
    modelYear: Number(values.modelYear),
    fuel: values.fuel,
    pricePerHour: Number(values.pricePerHour),
    passengers: Number(values.passengers),
    luggage: Number(values.luggage),
    // Keep the website's order whatever order they were ticked in.
    features: CAR_FEATURES.filter((f) => values.features.includes(f)),
    description: {
      en: values.descriptionEn.trim(),
      ar: values.descriptionAr.trim(),
    },
    image: values.image,
    interiorImages: values.interiorImages,
    published: values.published,
  };
}

// /admin/fleet/new and /admin/fleet/:id. Staff without the right
// permission (fleet.create / fleet.update) see the same form, read-only.
export default function CarFormPage() {
  const { id } = useParams();
  const { t } = useTranslation("admin");
  const location = useLocation();
  const backTo = `${adminPath("fleet")}${location.state?.listSearch ?? ""}`;
  const {
    data: car,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCarQuery(id, { skip: !id });

  const backLink = (
    <Link
      to={backTo}
      className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg transition-colors"
    >
      <ArrowLeft size={16} className="rtl:-scale-x-100" />
      {t("fleet.backToList")}
    </Link>
  );

  if (!id) return <CarForm car={null} backTo={backTo} backLink={backLink} />;

  if (isLoading) {
    return (
      <>
        {backLink}
        <AdminMessage icon={Loader2} spin title={t("common.loading")} />
      </>
    );
  }

  if (isError) {
    const missing = error?.status === 404;
    return (
      <>
        {backLink}
        <div className={`${ADMIN_CARD} mt-4`}>
          <AdminMessage
            icon={missing ? SearchX : AlertCircle}
            title={missing ? t("fleet.notFound") : t("common.loadFailed")}
            action={
              !missing && (
                <button
                  type="button"
                  className={ADMIN_BUTTON}
                  onClick={refetch}
                >
                  {t("common.retry")}
                </button>
              )
            }
          />
        </div>
      </>
    );
  }

  return <CarForm key={car.id} car={car} backTo={backTo} backLink={backLink} />;
}

function CarForm({ car, backTo, backLink }) {
  const { t, i18n } = useTranslation("admin");
  const navigate = useNavigate();
  const can = useCan();
  const isNew = !car;
  const canEdit = can(isNew ? P.fleet.create : P.fleet.update);

  const { data: categories = [] } = useGetCategoriesQuery();
  const [createCar, { isLoading: isCreating }] = useCreateCarMutation();
  const [updateCar, { isLoading: isUpdating }] = useUpdateCarMutation();
  const [deleteCar, { isLoading: isDeleting }] = useDeleteCarMutation();
  const [result, setResult] = useState(null); // "saved" | "failed"
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(carSchema(t)),
    defaultValues: toFormValues(car),
  });
  const { blocker, allowLeave } = useUnsavedChanges(isDirty);

  const onSubmit = async (values) => {
    setResult(null);
    try {
      if (isNew) {
        await createCar(toPayload(values)).unwrap();
        allowLeave();
        navigate(backTo, { replace: true });
      } else {
        const saved = await updateCar({
          id: car.id,
          ...toPayload(values),
        }).unwrap();
        reset(toFormValues(saved));
        setResult("saved");
      }
    } catch {
      setResult("failed");
    }
  };

  const remove = async () => {
    try {
      await deleteCar(car.id).unwrap();
      allowLeave();
      navigate(backTo, { replace: true });
    } catch {
      setConfirmDelete(false);
      setResult("failed");
    }
  };

  const isSaving = isCreating || isUpdating;
  const field = (name) => ({
    id: `car-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `car-${name}-error` : undefined,
    ...register(name),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {backLink}

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <h2 className="text-xl font-semibold text-fg">
          {isNew ? t("fleet.newTitle") : car.name}
        </h2>
        {!isNew && (
          <Can permission={P.fleet.delete}>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-rose-500/30 px-4 text-sm text-rose-400 light:text-rose-700 transition-colors hover:bg-rose-500/10"
            >
              <Trash2 size={16} />
              {t("fleet.deleteCar")}
            </button>
          </Can>
        )}
      </div>

      <fieldset
        disabled={!canEdit}
        className="mt-6 grid gap-4 lg:grid-cols-3 items-start min-w-0"
      >
        <div className="lg:col-span-2 flex flex-col gap-4 min-w-0">
          <Section title={t("fleet.sections.basics")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                name="name"
                label={t("fleet.fields.name")}
                error={errors.name}
                className="sm:col-span-2"
              >
                <input {...field("name")} className={ADMIN_INPUT} dir="ltr" />
              </Field>
              <Field
                name="categoryId"
                label={t("fleet.fields.category")}
                error={errors.categoryId}
              >
                <select
                  {...field("categoryId")}
                  className={`${ADMIN_INPUT} [&>option]:bg-page`}
                >
                  <option value="" disabled>
                    {t("fleet.fields.chooseCategory")}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {categoryName(category, i18n.language)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                name="fuel"
                label={t("fleet.fields.fuel")}
                error={errors.fuel}
              >
                <select
                  {...field("fuel")}
                  className={`${ADMIN_INPUT} [&>option]:bg-page`}
                >
                  {CAR_FUELS.map((fuel) => (
                    <option key={fuel} value={fuel}>
                      {t(`fleet.fuels.${fuel}`)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                name="modelYear"
                label={t("fleet.fields.modelYear")}
                error={errors.modelYear}
              >
                <input
                  {...field("modelYear")}
                  inputMode="numeric"
                  className={ADMIN_INPUT}
                />
              </Field>
              {!isNew && (
                <div>
                  <span className={ADMIN_LABEL}>
                    {t("fleet.fields.rating")}
                  </span>
                  <p className="flex h-11 items-center gap-2 text-[15px] text-fg">
                    <Star
                      size={16}
                      className="text-amber-400"
                      fill="currentColor"
                    />
                    {t("fleet.fields.ratingValue", {
                      rating: car.rating,
                      count: car.reviewsCount,
                    })}
                  </p>
                </div>
              )}
            </div>
          </Section>

          <Section title={t("fleet.sections.pricing")}>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field
                name="pricePerHour"
                label={t("fleet.fields.pricePerHour")}
                error={errors.pricePerHour}
              >
                <input
                  {...field("pricePerHour")}
                  inputMode="decimal"
                  className={ADMIN_INPUT}
                />
              </Field>
              <Field
                name="passengers"
                label={t("fleet.fields.passengers")}
                error={errors.passengers}
              >
                <input
                  {...field("passengers")}
                  inputMode="numeric"
                  className={ADMIN_INPUT}
                />
              </Field>
              <Field
                name="luggage"
                label={t("fleet.fields.luggage")}
                error={errors.luggage}
              >
                <input
                  {...field("luggage")}
                  inputMode="numeric"
                  className={ADMIN_INPUT}
                />
              </Field>
            </div>
          </Section>

          <Section title={t("fleet.sections.features")}>
            <div className="grid gap-3 sm:grid-cols-3">
              {CAR_FEATURES.map((feature) => (
                <label
                  key={feature}
                  className="flex items-center gap-2.5 text-[15px] text-fg/85"
                >
                  <input
                    type="checkbox"
                    value={feature}
                    {...register("features")}
                    className="h-[18px] w-[18px] accent-[rgb(var(--accent))]"
                  />
                  {t(`fleet.features.${feature}`)}
                </label>
              ))}
            </div>
          </Section>

          <Section title={t("fleet.sections.description")}>
            <p className="-mt-2 mb-4 text-sm text-muted">
              {t("fleet.fields.descriptionHint")}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                name="descriptionEn"
                label={t("fleet.fields.descriptionEn")}
              >
                <textarea
                  {...field("descriptionEn")}
                  rows={5}
                  dir="ltr"
                  className={`${ADMIN_INPUT} h-auto py-3 resize-y`}
                />
              </Field>
              <Field
                name="descriptionAr"
                label={t("fleet.fields.descriptionAr")}
              >
                <textarea
                  {...field("descriptionAr")}
                  rows={5}
                  dir="rtl"
                  className={`${ADMIN_INPUT} h-auto py-3 resize-y`}
                />
              </Field>
            </div>
          </Section>
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          <Section title={t("fleet.sections.visibility")}>
            <Controller
              control={control}
              name="published"
              render={({ field: { value, onChange } }) => (
                <label className="flex items-start gap-3">
                  <Switch
                    checked={value}
                    onChange={onChange}
                    label={t("fleet.fields.published")}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="block text-[15px] text-fg">
                      {t("fleet.fields.published")}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">
                      {t("fleet.fields.publishedHint")}
                    </span>
                  </span>
                </label>
              )}
            />
          </Section>

          <Section title={t("fleet.sections.photos")}>
            <span className={ADMIN_LABEL}>{t("fleet.fields.mainImage")}</span>
            <Controller
              control={control}
              name="image"
              render={({ field: { value, onChange } }) => (
                <ImageUpload
                  value={value}
                  onChange={onChange}
                  label={t("fleet.fields.mainImage")}
                />
              )}
            />

            <span className={`${ADMIN_LABEL} mt-5`}>
              {t("fleet.fields.interiorImages")}
            </span>
            <p className="-mt-1 mb-3 text-xs text-muted">
              {t("fleet.fields.interiorHint", { max: MAX_INTERIOR_IMAGES })}
            </p>
            <Controller
              control={control}
              name="interiorImages"
              render={({ field: { value, onChange } }) => (
                <div className="grid grid-cols-2 gap-3">
                  {value.map((url, index) => (
                    <ImageUpload
                      key={`${index}:${url.slice(-24)}`}
                      value={url}
                      label={`${t("fleet.fields.interiorImages")} ${index + 1}`}
                      onChange={(next) =>
                        onChange(
                          next
                            ? value.map((u, i) => (i === index ? next : u))
                            : value.filter((_, i) => i !== index)
                        )
                      }
                    />
                  ))}
                  {value.length < MAX_INTERIOR_IMAGES && canEdit && (
                    <ImageUpload
                      value={null}
                      label={`${t("fleet.fields.interiorImages")} ${value.length + 1}`}
                      onChange={(next) => next && onChange([...value, next])}
                    />
                  )}
                </div>
              )}
            />
          </Section>
        </div>
      </fieldset>

      {canEdit && (
        <div className="sticky bottom-0 z-10 -mx-4 md:-mx-8 mt-6 flex flex-wrap items-center justify-end gap-4 border-t border-line/10 bg-page/90 px-4 md:px-8 py-4 backdrop-blur">
          {result === "saved" && !isDirty && (
            <p
              role="status"
              className="me-auto flex items-center gap-2 text-sm text-emerald-400 light:text-emerald-700"
            >
              <CheckCircle2 size={17} />
              {t("fleet.saved")}
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
            disabled={isSaving || (!isNew && !isDirty)}
            className={`${ADMIN_BUTTON} disabled:cursor-not-allowed`}
          >
            {isSaving && <Loader2 size={17} className="animate-spin" />}
            {isSaving
              ? t("fleet.saving")
              : isNew
                ? t("fleet.create")
                : t("fleet.save")}
          </button>
        </div>
      )}

      {!isNew && (
        <Can permission={P.fleet.delete}>
          <ConfirmDialog
            open={confirmDelete}
            title={t("fleet.deleteTitle", { name: car.name })}
            body={t("fleet.deleteBody")}
            confirmLabel={t("common.delete")}
            busy={isDeleting}
            onConfirm={remove}
            onClose={() => setConfirmDelete(false)}
          />
        </Can>
      )}
      <UnsavedChangesDialog blocker={blocker} />
    </form>
  );
}

function Section({ title, children }) {
  return (
    <section className={`${ADMIN_CARD} p-5 min-w-0`}>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({ name, label, error, className = "", children }) {
  return (
    <div className={className}>
      <label htmlFor={`car-${name}`} className={ADMIN_LABEL}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`car-${name}-error`} className={ADMIN_FIELD_ERROR}>
          {error.message}
        </p>
      )}
    </div>
  );
}
