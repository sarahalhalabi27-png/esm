import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  Lock,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Can from "../../components/Can.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import { ADMIN_BUTTON, ADMIN_CARD } from "../../components/ui.js";
import {
  useDeleteRoleMutation,
  useGetRolesQuery,
} from "../../api/staffRolesApi.js";
import useCan from "../../hooks/useCan.js";
import { P } from "../../permissions.js";

// Every role with what it's for, how many staff have it, and which sections
// it reaches.
export default function RolesListPage() {
  const { t } = useTranslation("admin");
  const can = useCan();
  const { data: roles, isLoading, isError, refetch } = useGetRolesQuery();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [error, setError] = useState("");

  const confirmDelete = async () => {
    setError("");
    try {
      await deleteRole(roleToDelete.id).unwrap();
    } catch (failure) {
      setError(
        t(`roles.errors.${failure?.message}`, {
          defaultValue: t("common.actionFailed"),
        })
      );
    }
    setRoleToDelete(null);
  };

  if (isError && !roles) {
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

  return (
    <>
      <Can permission={P.roles.create}>
        <div className="mb-5 flex justify-end">
          <Link to="new" className={ADMIN_BUTTON}>
            <Plus size={18} />
            {t("roles.addRole")}
          </Link>
        </div>
      </Can>

      {error && (
        <p
          role="alert"
          className="mb-4 text-sm text-red-400 light:text-red-600"
        >
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className={`${ADMIN_CARD} h-44 animate-pulse`} />
          ))}
        </div>
      ) : roles.length === 0 ? (
        <div className={ADMIN_CARD}>
          <AdminMessage icon={ShieldCheck} title={t("roles.empty")} />
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {roles.map((role) => {
            const sections = [
              ...new Set(role.permissions.map((p) => p.split(".")[0])),
            ];
            const editable = !role.system && can(P.roles.update);
            return (
              <li key={role.id} className={`${ADMIN_CARD} flex flex-col p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="flex items-center gap-2 font-semibold text-fg">
                      {role.name}
                      {role.system && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface/[0.08] px-2.5 py-0.5 text-xs font-medium text-muted">
                          <Lock size={12} />
                          {t("roles.system")}
                        </span>
                      )}
                    </h2>
                    {role.description && (
                      <p className="mt-1 text-sm text-muted">
                        {role.description}
                      </p>
                    )}
                  </div>
                </div>

                <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg/80">
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={15} className="text-muted" />
                    {t("roles.staffCount", { count: role.staffCount })}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck size={15} className="text-muted" />
                    {t("roles.permissionCount", {
                      count: role.permissions.length,
                    })}
                  </span>
                </p>

                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {sections.map((resource) => (
                    <li
                      key={resource}
                      className="rounded-md bg-teal-accent/10 px-2 py-0.5 text-xs text-teal-accent"
                    >
                      {t(`roles.resources.${resource}`, {
                        defaultValue: resource,
                      })}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-4" />
                <div className="flex items-center justify-end gap-1 border-t border-line/10 pt-3">
                  <Link
                    to={String(role.id)}
                    className="h-9 px-3 inline-flex items-center rounded-lg text-sm text-teal-accent hover:bg-teal-accent/10"
                  >
                    {editable ? t("roles.edit") : t("roles.view")}
                  </Link>
                  {!role.system && (
                    <Can permission={P.roles.delete}>
                      <button
                        type="button"
                        onClick={() => setRoleToDelete(role)}
                        disabled={role.staffCount > 0}
                        aria-label={`${t("roles.deleteRole")}: ${role.name}`}
                        title={
                          role.staffCount > 0
                            ? t("roles.inUse")
                            : t("roles.deleteRole")
                        }
                        className="grid h-9 w-9 place-items-center rounded-lg text-rose-400 light:text-rose-700 hover:bg-rose-500/10 disabled:opacity-35 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                      >
                        <Trash2 size={17} />
                      </button>
                    </Can>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Can permission={P.roles.delete}>
        <ConfirmDialog
          open={Boolean(roleToDelete)}
          title={t("roles.deleteTitle", { name: roleToDelete?.name })}
          body={t("roles.deleteBody")}
          confirmLabel={t("common.delete")}
          busy={isDeleting}
          onConfirm={confirmDelete}
          onClose={() => setRoleToDelete(null)}
        />
      </Can>
    </>
  );
}
