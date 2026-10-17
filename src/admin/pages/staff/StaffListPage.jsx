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
import Avatar from "../../components/Avatar.jsx";
import {
  ADMIN_BUTTON,
  ADMIN_CARD,
  ADMIN_CARD_RICH,
  ADMIN_INPUT,
} from "../../components/ui.js";
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
import { roleTone } from "../../utils/people.js";

const STATUSES = ["active", "invited", "disabled"];
const STATUS_TONES = {
  active:
    "bg-emerald-400/15 text-emerald-300 light:bg-emerald-500/15 light:text-emerald-800",
  invited:
    "bg-amber-400/15 text-amber-300 light:bg-amber-500/15 light:text-amber-800",
  disabled: "bg-surface/[0.08] text-muted light:text-fg/70",
};
// The bar beside each person, by account status.
const STATUS_BARS = {
  active: "bg-emerald-400 light:bg-emerald-500",
  invited: "bg-amber-400 light:bg-amber-500",
  disabled: "bg-line/20",
};
// The count on a status tab when it isn't the open one.
const COUNT_TONES = {
  invited:
    "bg-amber-400/20 text-amber-300 light:bg-amber-500/20 light:text-amber-800",
};
// Colour of an icon button: green for good news, amber for a pause, red for
// a delete.
const BUTTON_TONES = {
  neutral: "text-fg/70 hover:bg-surface/[0.06] hover:text-fg",
  green:
    "bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20 light:text-emerald-700",
  amber:
    "bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 light:text-amber-700",
  red: "bg-rose-400/10 text-rose-300 hover:bg-rose-400/20 light:text-rose-700",
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
  const [toDisable, setToDisable] = useState(null);
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
        <div
          role="tablist"
          className="flex flex-1 gap-2 overflow-x-auto pb-1 min-w-0"
        >
          {["", ...STATUSES].map((view) => {
            const active = params.status === view;
            const count = data?.counts?.[view || "all"];
            return (
              <button
                key={view || "all"}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => update({ status: view })}
                className={`inline-flex items-center gap-2 h-10 px-4 shrink-0 rounded-full text-sm transition-colors ${
                  active
                    ? "bg-teal-accent text-page font-semibold"
                    : "border border-line/15 text-fg/75 hover:text-fg hover:bg-surface/[0.05]"
                }`}
              >
                {view ? t(`staff.status.${view}`) : t("common.all")}
                {count !== undefined && (
                  <span
                    className={`min-w-6 h-6 px-1.5 grid place-items-center rounded-full text-xs ${
                      active
                        ? "bg-page/20"
                        : count > 0 && COUNT_TONES[view]
                          ? COUNT_TONES[view]
                          : "bg-surface/[0.08]"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
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
          wrapperClassName="w-full md:w-48"
        />
        <Can permission={P.staff.create}>
          <button
            type="button"
            onClick={() => setDialog({ staff: null })}
            className={`${ADMIN_BUTTON} max-md:w-full`}
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
            className={`${ADMIN_CARD_RICH} overflow-hidden transition-opacity ${
              isFetching ? "opacity-60" : ""
            }`}
          >
            {data.items.map((person) => {
              const isSelf = person.id === me?.id;
              const busy = isUpdating && originalArgs?.id === person.id;
              return (
                <li
                  key={person.id}
                  className="relative flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line/[0.06] px-4 py-3.5 max-md:ps-6 last:border-0 md:grid md:grid-cols-[4px_minmax(0,1fr)_170px_110px_110px_156px]"
                >
                  {/* Green bar for an active account, amber while invited. */}
                  <span
                    aria-hidden="true"
                    className={`h-11 w-1 rounded-full max-md:absolute max-md:inset-y-3 max-md:start-2 max-md:h-auto ${STATUS_BARS[person.status]}`}
                  />
                  {/* Who */}
                  <div className="flex min-w-0 flex-1 basis-60 md:basis-auto items-center gap-3">
                    <Avatar name={person.name} />
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
                  <span
                    className={`grid h-7 w-[150px] max-w-full place-items-center rounded-full px-3 text-center text-[13px] font-medium leading-none ${
                      roleTone(roles, person.role.id).chip
                    }`}
                  >
                    <span className="max-w-full truncate">
                      {person.role.name}
                    </span>
                  </span>
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
                        tone="green"
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
                          tone={
                            person.status === "disabled" ? "green" : "amber"
                          }
                          icon={person.status === "disabled" ? UserCheck : Ban}
                          label={
                            person.status === "disabled"
                              ? t("staff.actions.enable")
                              : t("staff.actions.disable")
                          }
                          disabled={busy}
                          onClick={() =>
                            // Enabling is safe; disabling asks first.
                            person.status === "disabled"
                              ? run(() =>
                                  updateStaff({
                                    id: person.id,
                                    status: "active",
                                  })
                                )
                              : setToDisable(person)
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
                        tone="red"
                        icon={Trash2}
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

      <Can permission={P.staff.update}>
        <ConfirmDialog
          open={Boolean(toDisable)}
          title={t("staff.actions.disableTitle", { name: toDisable?.name })}
          body={t("staff.actions.disableBody")}
          confirmLabel={t("staff.actions.disable")}
          busy={isUpdating}
          onConfirm={async () => {
            await run(() =>
              updateStaff({ id: toDisable.id, status: "disabled" })
            );
            setToDisable(null);
          }}
          onClose={() => setToDisable(null)}
        />
      </Can>

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

function IconButton({ icon: Icon, label, tone = "neutral", ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-lg transition-colors disabled:opacity-40 ${BUTTON_TONES[tone]}`}
      {...props}
    >
      <Icon size={17} />
    </button>
  );
}
