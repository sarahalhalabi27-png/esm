import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import Modal from "../../components/Modal.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_BUTTON_GHOST,
  ADMIN_FIELD_ERROR,
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "../../components/ui.js";
import {
  useGetRolesQuery,
  useInviteStaffMutation,
  useUpdateStaffMutation,
} from "../../api/staffRolesApi.js";

const staffSchema = (t, isNew) =>
  z.object({
    name: z.string().trim().min(1, t("staff.validation.nameRequired")),
    email: isNew
      ? z
          .string()
          .trim()
          .min(1, t("staff.validation.emailRequired"))
          .pipe(z.email(t("staff.validation.emailInvalid")))
      : z.string(),
    roleId: z.string().min(1, t("staff.validation.roleRequired")),
  });

// Invite a staff member (name, email, role) or edit one (name, role).
// `staff` null = invite. `isSelf`: your own account, whose role is locked.
export default function StaffFormDialog({ open, staff, isSelf, onClose }) {
  const { t } = useTranslation("admin");
  const isNew = !staff;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        isNew
          ? t("staff.form.inviteTitle")
          : t("staff.form.editTitle", { name: staff.name })
      }
    >
      <StaffForm staff={staff} isSelf={isSelf} onDone={onClose} />
    </Modal>
  );
}

function StaffForm({ staff, isSelf, onDone }) {
  const { t } = useTranslation("admin");
  const isNew = !staff;
  const { data: roles = [] } = useGetRolesQuery();
  const [inviteStaff, { isLoading: isInviting }] = useInviteStaffMutation();
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(staffSchema(t, isNew)),
    defaultValues: {
      name: staff?.name ?? "",
      email: staff?.email ?? "",
      roleId: staff ? String(staff.role.id) : "",
    },
  });

  const onSubmit = async (values) => {
    setError("");
    try {
      if (isNew) {
        await inviteStaff({
          name: values.name,
          email: values.email,
          roleId: Number(values.roleId),
        }).unwrap();
      } else {
        await updateStaff({
          id: staff.id,
          name: values.name,
          ...(!isSelf && { roleId: Number(values.roleId) }),
        }).unwrap();
      }
      onDone();
    } catch (failure) {
      setError(
        t(`staff.errors.${failure?.message}`, {
          defaultValue: t("common.actionFailed"),
        })
      );
    }
  };

  const isSaving = isInviting || isUpdating;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      {isNew && (
        <p className="text-sm text-muted">{t("staff.form.inviteHint")}</p>
      )}

      <div>
        <label htmlFor="staff-name" className={ADMIN_LABEL}>
          {t("staff.form.name")}
        </label>
        <input
          id="staff-name"
          dir="auto"
          {...register("name")}
          autoComplete="off"
          aria-invalid={errors.name ? true : undefined}
          className={ADMIN_INPUT}
        />
        {errors.name && (
          <p className={ADMIN_FIELD_ERROR}>{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="staff-email" className={ADMIN_LABEL}>
          {t("staff.form.email")}
        </label>
        <input
          id="staff-email"
          type="email"
          dir="ltr"
          {...register("email")}
          readOnly={!isNew}
          autoComplete="off"
          aria-invalid={errors.email ? true : undefined}
          className={`${ADMIN_INPUT} read-only:opacity-60`}
        />
        {errors.email && (
          <p className={ADMIN_FIELD_ERROR}>{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="staff-role" className={ADMIN_LABEL}>
          {t("staff.form.role")}
        </label>
        <select
          id="staff-role"
          {...register("roleId")}
          disabled={isSelf}
          aria-invalid={errors.roleId ? true : undefined}
          className={`${ADMIN_INPUT} [&>option]:bg-page disabled:opacity-60`}
        >
          <option value="" disabled>
            {t("staff.form.chooseRole")}
          </option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        {errors.roleId && (
          <p className={ADMIN_FIELD_ERROR}>{errors.roleId.message}</p>
        )}
        {isSelf && (
          <p className="mt-1.5 text-xs text-muted">
            {t("staff.form.selfNote")}
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400 light:text-red-600">
          {error}
        </p>
      )}

      <div className="mt-2 flex justify-end gap-3">
        <button type="button" className={ADMIN_BUTTON_GHOST} onClick={onDone}>
          {t("common.cancel")}
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className={`${ADMIN_BUTTON} h-10`}
        >
          {isSaving && <Loader2 size={16} className="animate-spin" />}
          {isNew ? t("staff.form.send") : t("staff.form.save")}
        </button>
      </div>
    </form>
  );
}
