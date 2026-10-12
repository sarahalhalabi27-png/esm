import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Lock,
  SearchX,
} from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_CARD,
  ADMIN_FIELD_ERROR,
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "../../components/ui.js";
import {
  useCreateRoleMutation,
  useGetPermissionCatalogQuery,
  useGetRoleQuery,
  useUpdateRoleMutation,
} from "../../api/staffRolesApi.js";
import useCan from "../../hooks/useCan.js";
import { adminPath } from "../../navigation.js";
import { P } from "../../permissions.js";
import {
  fetchAdminMe,
  selectAdminUser,
} from "../../store/adminSessionSlice.js";
import PermissionMatrix from "./PermissionMatrix.jsx";
import UnsavedChangesDialog from "../../components/UnsavedChangesDialog.jsx";
import useUnsavedChanges from "../../hooks/useUnsavedChanges.js";

const roleSchema = (t) =>
  z.object({
    name: z.string().trim().min(1, t("roles.validation.nameRequired")),
    description: z.string(),
    permissions: z
      .array(z.string())
      .min(1, t("roles.validation.permissionsRequired")),
  });

const toFormValues = (role) => ({
  name: role?.name ?? "",
  description: role?.description ?? "",
  permissions: role?.permissions ?? [],
});

// /admin/roles/new and /admin/roles/:id. System roles, and staff without
// roles.create / roles.update, see it read-only.
export default function RoleFormPage() {
  const { id } = useParams();
  const { t } = useTranslation("admin");
  const backTo = adminPath("roles");
  const role = useGetRoleQuery(id, { skip: !id });
  const catalog = useGetPermissionCatalogQuery();

  const backLink = (
    <Link
      to={backTo}
      className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg transition-colors"
    >
      <ArrowLeft size={16} className="rtl:-scale-x-100" />
      {t("roles.backToList")}
    </Link>
  );

  if (role.isLoading || catalog.isLoading) {
    return (
      <>
        {backLink}
        <AdminMessage icon={Loader2} spin title={t("common.loading")} />
      </>
    );
  }

  if (role.isError || catalog.isError) {
    const missing = role.error?.status === 404;
    return (
      <>
        {backLink}
        <div className={`${ADMIN_CARD} mt-4`}>
          <AdminMessage
            icon={missing ? SearchX : AlertCircle}
            title={missing ? t("roles.notFound") : t("common.loadFailed")}
            action={
              !missing && (
                <button
                  type="button"
                  className={ADMIN_BUTTON}
                  onClick={() => {
                    if (id) role.refetch();
                    catalog.refetch();
                  }}
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

  return (
    <RoleForm
      key={role.data?.id ?? "new"}
      role={role.data ?? null}
      catalog={catalog.data}
      backTo={backTo}
      backLink={backLink}
    />
  );
}

function RoleForm({ role, catalog, backTo, backLink }) {
  const { t } = useTranslation("admin");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const can = useCan();
  const me = useSelector(selectAdminUser);
  const isNew = !role;
  const readOnly =
    role?.system || !can(isNew ? P.roles.create : P.roles.update);

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [result, setResult] = useState(null); // { ok } | { error }

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(roleSchema(t)),
    defaultValues: toFormValues(role),
  });
  const { blocker, allowLeave } = useUnsavedChanges(isDirty);

  const onSubmit = async (values) => {
    setResult(null);
    try {
      if (isNew) {
        await createRole(values).unwrap();
        allowLeave();
        navigate(backTo, { replace: true });
        return;
      }
      const saved = await updateRole({ id: role.id, ...values }).unwrap();
      reset(toFormValues(saved));
      setResult({ ok: true });
      // Editing your own role changes what you can do: reload your
      // permissions so the sidebar and buttons follow straight away.
      if (me?.role?.id === role.id) dispatch(fetchAdminMe());
    } catch (failure) {
      setResult({
        error: t(`roles.errors.${failure?.message}`, {
          defaultValue: t("common.actionFailed"),
        }),
      });
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {backLink}
      <h2 className="mt-4 flex items-center gap-2 text-xl font-semibold text-fg">
        {isNew ? t("roles.newTitle") : role.name}
        {role?.system && <Lock size={18} className="text-muted" />}
      </h2>
      {role?.system && (
        <p className="mt-2 text-sm text-muted">{t("roles.systemHint")}</p>
      )}

      <fieldset
        disabled={readOnly}
        className="mt-6 flex flex-col gap-4 min-w-0"
      >
        <section className={`${ADMIN_CARD} p-5 grid gap-4 md:grid-cols-2`}>
          <div>
            <label htmlFor="role-name" className={ADMIN_LABEL}>
              {t("roles.fields.name")}
            </label>
            <input
              id="role-name"
              dir="auto"
              {...register("name")}
              aria-invalid={errors.name ? true : undefined}
              className={ADMIN_INPUT}
            />
            {errors.name && (
              <p className={ADMIN_FIELD_ERROR}>{errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="role-description" className={ADMIN_LABEL}>
              {t("roles.fields.description")}
            </label>
            <input
              id="role-description"
              dir="auto"
              {...register("description")}
              placeholder={t("roles.fields.descriptionPlaceholder")}
              className={ADMIN_INPUT}
            />
          </div>
        </section>

        <section className={`${ADMIN_CARD} p-5 min-w-0`}>
          <Controller
            control={control}
            name="permissions"
            render={({ field: { value, onChange } }) => (
              <>
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                    {t("roles.permissions")}
                  </h3>
                  <span className="text-sm text-muted">
                    {t("roles.selected", { count: value.length })}
                  </span>
                </div>
                <p className="mb-3 text-sm text-muted">
                  {t("roles.permissionsHint")}
                </p>
                <PermissionMatrix
                  catalog={catalog}
                  value={value}
                  onChange={onChange}
                  disabled={readOnly}
                />
              </>
            )}
          />
          {errors.permissions && (
            <p role="alert" className={ADMIN_FIELD_ERROR}>
              {errors.permissions.message}
            </p>
          )}
        </section>
      </fieldset>

      {!readOnly && (
        <div className="sticky bottom-0 z-10 -mx-4 md:-mx-8 mt-6 flex flex-wrap items-center justify-end gap-4 border-t border-line/10 bg-page/90 px-4 md:px-8 py-4 backdrop-blur">
          {result?.ok && !isDirty && (
            <p
              role="status"
              className="me-auto flex items-center gap-2 text-sm text-emerald-400 light:text-emerald-700"
            >
              <CheckCircle2 size={17} />
              {t("roles.saved")}
            </p>
          )}
          {result?.error && (
            <p
              role="alert"
              className="me-auto text-sm text-red-400 light:text-red-600"
            >
              {result.error}
            </p>
          )}
          <button
            type="submit"
            disabled={isSaving || (!isNew && !isDirty)}
            aria-busy={isSaving}
            className={`${ADMIN_BUTTON}`}
          >
            {isSaving && <Loader2 size={17} className="animate-spin" />}
            {isNew ? t("roles.create") : t("roles.save")}
          </button>
        </div>
      )}
      <UnsavedChangesDialog blocker={blocker} />
    </form>
  );
}
