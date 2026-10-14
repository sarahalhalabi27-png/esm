import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  Lock,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Can from "../../components/Can.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_CARD,
  ADMIN_CARD_RICH,
} from "../../components/ui.js";
import {
  useDeleteRoleMutation,
  useGetRolesQuery,
} from "../../api/staffRolesApi.js";
import useCan from "../../hooks/useCan.js";
import { P } from "../../permissions.js";
import { roleTone } from "../../utils/people.js";

// How many section tags a card shows before "+N".
const MAX_SECTIONS = 5;

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
            const tone = roleTone(roles, role.id);
            const sections = [
              ...new Set(role.permissions.map((p) => p.split(".")[0])),
            ];
            const editable = !role.system && can(P.roles.update);
            const inUse = role.staffCount > 0;
            return (
              <li
                key={role.id}
                className={`${ADMIN_CARD_RICH} relative flex flex-col overflow-hidden p-5`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r to-transparent ${tone.bar}`}
                />

                <div className="flex items-start gap-3">
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tone.chip}`}
                  >
                    <ShieldCheck size={21} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold text-fg">
                      {role.name}
                      {role.system && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface/[0.08] px-2.5 py-0.5 text-xs font-medium text-muted light:text-fg/70">
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

                <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-fg/80">
                  <span className="inline-flex items-center gap-1.5">
                    <Users
                      size={15}
                      className="text-sky-300 light:text-sky-600"
                    />
                    {t("roles.staffCount", { count: role.staffCount })}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck size={15} className="text-teal-accent" />
                    {t("roles.permissionCount", {
                      count: role.permissions.length,
                    })}
                  </span>
                </p>

                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {sections.slice(0, MAX_SECTIONS).map((resource) => (
                    <li
                      key={resource}
                      className="rounded-md bg-surface/[0.07] px-2 py-0.5 text-xs text-fg/75"
                    >
                      {t(`roles.resources.${resource}`, {
                        defaultValue: resource,
                      })}
                    </li>
                  ))}
                  {sections.length > MAX_SECTIONS && (
                    <li className="rounded-md bg-surface/[0.07] px-2 py-0.5 text-xs text-muted light:text-fg/70 tabular-nums">
                      +{sections.length - MAX_SECTIONS}
                    </li>
                  )}
                </ul>

                <div className="mt-auto pt-4" />
                <div className="flex items-center justify-end gap-2 border-t border-line/10 pt-3">
                  {!role.system && (
                    <Can permission={P.roles.delete}>
                      <button
                        type="button"
                        onClick={() => setRoleToDelete(role)}
                        disabled={inUse}
                        aria-label={`${t("roles.deleteRole")}: ${role.name}`}
                        title={inUse ? t("roles.inUse") : t("roles.deleteRole")}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-rose-400/10 px-3 text-sm font-medium text-rose-300 transition-colors hover:bg-rose-400/20 light:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-rose-400/10"
                      >
                        <Trash2 size={15} />
                        {t("common.delete")}
                      </button>
                    </Can>
                  )}
                  <Link
                    to={String(role.id)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-teal-accent/15 px-3 text-sm font-medium text-teal-accent transition-colors hover:bg-teal-accent/25"
                  >
                    {editable && <Pencil size={14} />}
                    {editable ? t("roles.edit") : t("roles.view")}
                  </Link>
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
