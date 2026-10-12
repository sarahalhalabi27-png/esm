import { adminApi, fromMock } from "./adminApi.js";
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

// Staff, roles and the permission catalog. TODO(api): replace each
// `queryFn` with the `query` in the comment above it (and drop actorId).
const staffRolesApi = adminApi
  .enhanceEndpoints({ addTagTypes: ["Role", "Staff"] })
  .injectEndpoints({
    endpoints: (build) => ({
      // query: () => "/permissions"
      getPermissionCatalog: build.query({
        queryFn: () => fromMock(listPermissions()),
      }),

      // query: () => "/roles"
      getRoles: build.query({
        queryFn: () => fromMock(listRoles()),
        providesTags: [{ type: "Role", id: "LIST" }],
      }),

      // query: (id) => `/roles/${id}`
      getRole: build.query({
        queryFn: (id) => fromMock(getRole(id)),
        providesTags: (result, error, id) => [{ type: "Role", id: Number(id) }],
      }),

      // query: (role) => ({ url: "/roles", method: "POST", body: role })
      createRole: build.mutation({
        queryFn: (role) => fromMock(createRole(role)),
        invalidatesTags: [{ type: "Role", id: "LIST" }],
      }),

      // query: ({ id, ...changes }) => ({ url: `/roles/${id}`, method: "PATCH", body: changes })
      updateRole: build.mutation({
        queryFn: (args) => fromMock(updateRole(args)),
        invalidatesTags: (result, error, { id }) => [
          { type: "Role", id: Number(id) },
          { type: "Role", id: "LIST" },
          { type: "Staff", id: "LIST" },
        ],
      }),

      // query: (id) => ({ url: `/roles/${id}`, method: "DELETE" })
      deleteRole: build.mutation({
        queryFn: (id) => fromMock(deleteRole(id)),
        invalidatesTags: [{ type: "Role", id: "LIST" }],
      }),

      // query: (params) => ({ url: "/staff", params })
      getStaff: build.query({
        queryFn: (params) => fromMock(listStaff(params)),
        providesTags: [{ type: "Staff", id: "LIST" }],
      }),

      // query: (staff) => ({ url: "/staff", method: "POST", body: staff })
      inviteStaff: build.mutation({
        queryFn: (staff) => fromMock(inviteStaff(staff)),
        invalidatesTags: [
          { type: "Staff", id: "LIST" },
          { type: "Role", id: "LIST" },
        ],
      }),

      // query: ({ id, ...changes }) => ({ url: `/staff/${id}`, method: "PATCH", body: changes })
      updateStaff: build.mutation({
        queryFn: (args, { getState }) =>
          fromMock(updateStaff({ ...args, actorId: actorId(getState) })),
        invalidatesTags: [
          { type: "Staff", id: "LIST" },
          { type: "Role", id: "LIST" },
        ],
      }),

      // query: (id) => ({ url: `/staff/${id}/resend-invite`, method: "POST" })
      resendInvite: build.mutation({
        queryFn: (id) => fromMock(resendInvite(id)),
      }),

      // query: (id) => ({ url: `/staff/${id}`, method: "DELETE" })
      deleteStaff: build.mutation({
        queryFn: (id, { getState }) =>
          fromMock(deleteStaff({ id, actorId: actorId(getState) })),
        invalidatesTags: [
          { type: "Staff", id: "LIST" },
          { type: "Role", id: "LIST" },
        ],
      }),
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
