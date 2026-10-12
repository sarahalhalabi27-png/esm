import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  Pencil,
  Search,
  Send,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import AdminMessage from "../../components/AdminMessage.jsx";
import Can from "../../components/Can.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import { ADMIN_BUTTON, ADMIN_CARD, ADMIN_INPUT } from "../../components/ui.js";
import {
  useDeleteStaffMutation,
  useGetRolesQuery,
  useGetStaffQuery,
  useResendInviteMutation,
  useUpdateStaffMutation,
} from "../../api/staffRolesApi.js";
import useCan from "../../hooks/useCan.js";
import useUrlFilters, { useSearchBox } from "../../hooks/useUrlFilters.js";
import { P } from "../../permissions.js";
import { selectAdminUser } from "../../store/adminSessionSlice.js";
import { formatShortDateTime } from "../../utils/format.js";
import Select from "../../components/Select.jsx";
import StaffFormDialog from "./StaffFormDialog.jsx";
import { initials } from "../../utils/people.js";

const STATUSES = ["active", "invited", "disabled"];
const STATUS_TONES = {
  active:
    "bg-emerald-400/15 text-emerald-300 light:bg-emerald-500/15 light:text-emerald-800",
  invited:
    "bg-amber-400/15 text-amber-300 light:bg-amber-500/15 light:text-amber-800",
  disabled: "bg-surface/[0.08] text-muted",
};

// The team: who has dashboard access, with which role, and whether their
// account is active, waiting for them to accept the invitation, or disabled.
export default function StaffListPage() {
  const { t, i18n } = useTranslation("admin");
  const can = useCan();
  const me = useSelector(selectAdminUser);
  const { get, update } = useUrlFilters();
  const params = { q: get("q"), roleId: get("role"), status: get("status") };
  const search = useSearchBox(params.q, (q) => update({ q }));

  const { data, isLoading, isFetching, isError, refetch } =
    useGetStaffQuery(params);
  const { data: roles = [] } = useGetRolesQuery();
  const [updateStaff, { isLoading: isUpdating, originalArgs }] =
    useUpdateStaffMutation();
  const [resendInvite, { isLoading: isResending }] = useResendInviteMutation();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();

  const [dialog, setDialog] = useState(null); // { staff } (null staff = invite)
  const [toDelete, setToDelete] = useState(null);
  const [notice, setNotice] = useState(null); // { ok, text }

  const run = async (action, okText) => {
    setNotice(null);
    try {
      await action().unwrap();
      if (okText) setNotice({ ok: true, text: okText });
    } catch (failure) {
      setNotice({
        ok: false,
        text: t(`staff.errors.${failure?.message}`, {
          defaultValue: t("common.actionFailed"),
        }),
      });
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative block w-full md:w-72">
          <span className="sr-only">{t("staff.searchPlaceholder")}</span>
          <Search
            size={18}
            className="absolute top-1/2 -translate-y-1/2 start-3.5 text-muted pointer-events-none"
          />
          <input
            type="search"
            value={search.value}
            onChange={search.onChange}
            placeholder={t("staff.searchPlaceholder")}
            className={`${ADMIN_INPUT} ps-10`}
          />
        </label>
        <Select
          value={params.roleId}
          onChange={(role) => update({ role })}
          options={[
            { value: "", label: t("staff.allRoles") },
            ...roles.map((role) => ({
              value: String(role.id),
              label: role.name,
            })),
          ]}
          aria-label={t("staff.columns.role")}
          wrapperClassName="w-[calc(50%-6px)] md:w-48"
        />
        <Select
          value={params.status}
          onChange={(status) => update({ status })}
          options={[
            { value: "", label: t("staff.allStatuses") },
            ...STATUSES.map((status) => ({
              value: status,
              label: t(`staff.status.${status}`),
            })),
          ]}
          aria-label={t("staff.columns.status")}
          wrapperClassName="w-[calc(50%-6px)] md:w-40"
        />
        <Can permission={P.staff.create}>
          <button
            type="button"
            onClick={() => setDialog({ staff: null })}
            className={`${ADMIN_BUTTON} md:ms-auto max-md:w-full`}
          >
            <UserPlus size={18} />
            {t("staff.invite")}
          </button>
        </Can>
      </div>

      {notice && (
        <p
          role={notice.ok ? "status" : "alert"}
          className={`mt-4 flex items-center gap-2 text-sm ${
            notice.ok
              ? "text-emerald-400 light:text-emerald-700"
              : "text-red-400 light:text-red-600"
          }`}
        >
          {notice.ok && <CheckCircle2 size={16} />}
          {notice.text}
        </p>
      )}

      <div className="mt-5">
        {isError && !data ? (
          <div className={ADMIN_CARD}>
            <AdminMessage
              icon={AlertCircle}
              title={t("common.loadFailed")}
              action={
                <button
                  type="button"
                  className={ADMIN_BUTTON}
                  onClick={refetch}
                >
                  {t("common.retry")}
                </button>
              }
            />
          </div>
        ) : isLoading ? (
          <div
            className={`${ADMIN_CARD} p-4`}
            role="status"
            aria-label={t("common.loading")}
          >
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-14 my-2 rounded-lg bg-surface/[0.06] animate-pulse"
              />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <div className={ADMIN_CARD}>
            <AdminMessage icon={Users} title={t("staff.empty")} />
          </div>
        ) : (
          <ul
            className={`${ADMIN_CARD} overflow-hidden transition-opacity ${
              isFetching ? "opacity-60" : ""
            }`}
          >
            {data.items.map((person) => {
              const isSelf = person.id === me?.id;
              const busy = isUpdating && originalArgs?.id === person.id;
              return (
                <li
                  key={person.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-3 md:grid md:grid-cols-[minmax(0,1fr)_170px_110px_110px_156px] border-b border-line/[0.06] px-4 py-3.5 last:border-0"
                >
                  {/* Who */}
                  <div className="flex min-w-0 flex-1 basis-60 md:basis-auto items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-accent/15 text-sm font-semibold text-teal-accent">
                      {initials(person.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-medium text-fg">
                          {person.name}
                        </span>
                        {isSelf && (
                          <span className="shrink-0 rounded-full bg-teal-accent/15 px-2 py-0.5 text-xs text-teal-accent">
                            {t("staff.you")}
                          </span>
                        )}
                      </span>
                      <span
                        className="block truncate text-sm text-muted"
                        dir="ltr"
                      >
                        {person.email}
                      </span>
                    </span>
                  </div>

                  {/* Role, status, last sign-in */}
                  <span className="text-sm text-fg/85">{person.role.name}</span>
                  <span
                    className={`inline-flex h-7 w-fit items-center rounded-full px-3 text-[13px] font-medium ${STATUS_TONES[person.status]}`}
                  >
                    {t(`staff.status.${person.status}`)}
                  </span>
                  <span className="text-sm text-muted tabular-nums">
                    <span className="md:sr-only">
                      {t("staff.columns.lastLogin")}:{" "}
                    </span>
                    {person.lastLoginAt
                      ? formatShortDateTime(person.lastLoginAt, i18n.language)
                      : t("staff.never")}
                  </span>

                  {/* Actions */}
                  <div className="ms-auto flex items-center justify-end gap-1">
                    {can(P.staff.update) && person.status === "invited" && (
                      <IconButton
                        icon={Send}
                        label={t("staff.actions.resendInvite")}
                        disabled={isResending}
                        onClick={() =>
                          run(
                            () => resendInvite(person.id),
                            t("staff.actions.inviteSent")
                          )
                        }
                      />
                    )}
                    {can(P.staff.update) &&
                      !isSelf &&
                      person.status !== "invited" && (
                        <IconButton
                          icon={person.status === "disabled" ? UserCheck : Ban}
                          label={
                            person.status === "disabled"
                              ? t("staff.actions.enable")
                              : t("staff.actions.disable")
                          }
                          disabled={busy}
                          onClick={() =>
                            run(() =>
                              updateStaff({
                                id: person.id,
                                status:
                                  person.status === "disabled"
                                    ? "active"
                                    : "disabled",
                              })
                            )
                          }
                        />
                      )}
                    {can(P.staff.update) && (
                      <IconButton
                        icon={Pencil}
                        label={t("staff.actions.edit")}
                        onClick={() => setDialog({ staff: person })}
                      />
                    )}
                    {can(P.staff.delete) && !isSelf && (
                      <IconButton
                        icon={Trash2}
                        danger
                        label={t("staff.actions.delete")}
                        onClick={() => setToDelete(person)}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <StaffFormDialog
        open={Boolean(dialog)}
        staff={dialog?.staff ?? null}
        isSelf={dialog?.staff?.id === me?.id}
        onClose={() => setDialog(null)}
      />

      <Can permission={P.staff.delete}>
        <ConfirmDialog
          open={Boolean(toDelete)}
          title={t("staff.actions.deleteTitle", { name: toDelete?.name })}
          body={t("staff.actions.deleteBody")}
          confirmLabel={t("common.delete")}
          busy={isDeleting}
          onConfirm={async () => {
            await run(() => deleteStaff(toDelete.id));
            setToDelete(null);
          }}
          onClose={() => setToDelete(null)}
        />
      </Can>
    </>
  );
}

function IconButton({ icon: Icon, label, danger = false, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-lg transition-colors disabled:opacity-40 ${
        danger
          ? "text-rose-400 light:text-rose-700 hover:bg-rose-500/10"
          : "text-fg/70 hover:bg-surface/[0.06] hover:text-fg"
      }`}
      {...props}
    >
      <Icon size={17} />
    </button>
  );
}
