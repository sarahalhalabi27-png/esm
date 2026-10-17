import { adminApi, cleanParams, endpoint } from "./adminApi.js";
import {
  createRole,
  deleteRole,
  deleteStaff,
  getRole,
  inviteStaff,
  listPermissions,
  listRoles,
  listStaff,
  resendInvite,
  updateRole,
  updateStaff,
} from "./mockStaffRoles.js";

// Who's acting: the backend takes it from the token; the mock needs it to
// refuse changes to your own account.
const actorId = (getState) => getState().adminSession.user?.id;

// Staff, roles and the permission catalog (mock or API, see ./config.js).
const staffRolesApi = adminApi
  .enhanceEndpoints({ addTagTypes: ["Role", "Staff"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getPermissionCatalog: build.query(
        endpoint({
          mock: () => listPermissions(),
          query: () => "/permissions",
        })
      ),

      getRoles: build.query(
        endpoint({
          mock: () => listRoles(),
          query: () => "/roles",
          providesTags: [{ type: "Role", id: "LIST" }],
        })
      ),

      getRole: build.query(
        endpoint({
          mock: (id) => getRole(id),
          query: (id) => `/roles/${id}`,
          providesTags: (result, error, id) => [
            { type: "Role", id: Number(id) },
          ],
        })
      ),

      createRole: build.mutation(
        endpoint({
          mock: (role) => createRole(role),
          query: (role) => ({ url: "/roles", method: "POST", body: role }),
          invalidatesTags: [{ type: "Role", id: "LIST" }],
        })
      ),

      updateRole: build.mutation(
        endpoint({
          mock: (args) => updateRole(args),
          query: ({ id, ...changes }) => ({
            url: `/roles/${id}`,
            method: "PATCH",
            body: changes,
          }),
          invalidatesTags: (result, error, { id }) => [
            { type: "Role", id: Number(id) },
            { type: "Role", id: "LIST" },
            { type: "Staff", id: "LIST" },
          ],
        })
      ),

      deleteRole: build.mutation(
        endpoint({
          mock: (id) => deleteRole(id),
          query: (id) => ({ url: `/roles/${id}`, method: "DELETE" }),
          invalidatesTags: [{ type: "Role", id: "LIST" }],
        })
      ),

      getStaff: build.query(
        endpoint({
          mock: (params) => listStaff(params),
          query: (params) => ({ url: "/staff", params: cleanParams(params) }),
          providesTags: [{ type: "Staff", id: "LIST" }],
        })
      ),

      inviteStaff: build.mutation(
        endpoint({
          mock: (staff) => inviteStaff(staff),
          query: (staff) => ({ url: "/staff", method: "POST", body: staff }),
          invalidatesTags: [
            { type: "Staff", id: "LIST" },
            { type: "Role", id: "LIST" },
          ],
        })
      ),

      updateStaff: build.mutation(
        endpoint({
          mock: (args, { getState }) =>
            updateStaff({ ...args, actorId: actorId(getState) }),
          query: ({ id, ...changes }) => ({
            url: `/staff/${id}`,
            method: "PATCH",
            body: changes,
          }),
          invalidatesTags: [
            { type: "Staff", id: "LIST" },
            { type: "Role", id: "LIST" },
          ],
        })
      ),

      resendInvite: build.mutation(
        endpoint({
          mock: (id) => resendInvite(id),
          query: (id) => ({
            url: `/staff/${id}/resend-invite`,
            method: "POST",
          }),
        })
      ),

      deleteStaff: build.mutation(
        endpoint({
          mock: (id, { getState }) =>
            deleteStaff({ id, actorId: actorId(getState) }),
          query: (id) => ({ url: `/staff/${id}`, method: "DELETE" }),
          invalidatesTags: [
            { type: "Staff", id: "LIST" },
            { type: "Role", id: "LIST" },
          ],
        })
      ),
    }),
  });

export const {
  useGetPermissionCatalogQuery,
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetStaffQuery,
  useInviteStaffMutation,
  useUpdateStaffMutation,
  useResendInviteMutation,
  useDeleteStaffMutation,
} = staffRolesApi;
