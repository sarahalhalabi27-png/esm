import { adminDb } from "./mockAdminData.js";
import { PERMISSION_RESOURCES } from "../permissions.js";

// Mock staff, roles and permission-catalog service (shares adminDb with the
// mock auth). The backend must enforce the same rules: system roles are
// locked, a role in use can't be deleted, and nobody can change their own
// role or status, or delete themselves (so no one locks themselves out).
//
// A role:  { id, name, description, system, permissions: ["bookings.view", ...], staffCount }
// A staff member: { id, name, email, role: { id, name }, status, createdAt, lastLoginAt }
//   status: "active" | "invited" (hasn't set a password yet) | "disabled"

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
const copy = (value) => structuredClone(value);

function apiError(code, status) {
  const error = new Error(code);
  error.status = status;
  return error;
}

const nextId = (rows) => Math.max(0, ...rows.map((row) => row.id)) + 1;

// ----- permission catalog -----

// GET /admin/permissions -> [{ resource, actions: ["view", ...] }, ...]
// Everything a role can be given, so the Roles screen is built from the
// backend's list rather than one hardcoded in the dashboard.
export async function listPermissions() {
  await delay(150);
  return Object.entries(PERMISSION_RESOURCES).map(([resource, actions]) => ({
    resource,
    actions: [...actions],
  }));
}

// ----- roles -----

const roleOut = (role) => ({
  ...role,
  staffCount: adminDb.staff.filter((s) => s.roleId === role.id).length,
});

function findRole(id) {
  const role = adminDb.roles.find((r) => r.id === Number(id));
  if (!role) throw apiError("NOT_FOUND", 404);
  return role;
}

const cleanName = (name) => name.trim().toLowerCase();
function assertRoleNameFree(name, exceptId) {
  if (
    adminDb.roles.some(
      (r) => r.id !== exceptId && cleanName(r.name) === cleanName(name)
    )
  ) {
    throw apiError("NAME_TAKEN", 409);
  }
}

// GET /admin/roles
export async function listRoles() {
  await delay();
  return copy(adminDb.roles.map(roleOut));
}

// GET /admin/roles/:id
export async function getRole(id) {
  await delay(200);
  return copy(roleOut(findRole(id)));
}

// POST /admin/roles  { name, description, permissions }   (409 NAME_TAKEN)
export async function createRole({ name, description, permissions }) {
  await delay();
  assertRoleNameFree(name);
  const role = {
    id: nextId(adminDb.roles),
    name: name.trim(),
    description: description.trim(),
    system: false,
    permissions: [...permissions],
  };
  adminDb.roles = [...adminDb.roles, role];
  return copy(roleOut(role));
}

// PATCH /admin/roles/:id  { name, description, permissions }
//   (403 SYSTEM_ROLE, 409 NAME_TAKEN)
export async function updateRole({ id, ...changes }) {
  await delay();
  const role = findRole(id);
  if (role.system) throw apiError("SYSTEM_ROLE", 403);
  if (changes.name !== undefined) assertRoleNameFree(changes.name, role.id);
  const updated = {
    ...role,
    ...changes,
    name: (changes.name ?? role.name).trim(),
    description: (changes.description ?? role.description).trim(),
  };
  adminDb.roles = adminDb.roles.map((r) => (r.id === role.id ? updated : r));
  return copy(roleOut(updated));
}

// DELETE /admin/roles/:id   (403 SYSTEM_ROLE, 409 ROLE_IN_USE)
export async function deleteRole(id) {
  await delay();
  const role = findRole(id);
  if (role.system) throw apiError("SYSTEM_ROLE", 403);
  if (adminDb.staff.some((s) => s.roleId === role.id)) {
    throw apiError("ROLE_IN_USE", 409);
  }
  adminDb.roles = adminDb.roles.filter((r) => r.id !== role.id);
  return { id: role.id };
}

// ----- staff -----

function staffOut(staff) {
  const role = adminDb.roles.find((r) => r.id === staff.roleId);
  const { roleId, ...rest } = staff;
  return {
    ...rest,
    role: role ? { id: role.id, name: role.name } : { id: roleId, name: "" },
  };
}

function findStaff(id) {
  const staff = adminDb.staff.find((s) => s.id === Number(id));
  if (!staff) throw apiError("NOT_FOUND", 404);
  return staff;
}

// GET /admin/staff?q&roleId&status -> { items }
export async function listStaff({ q = "", roleId = "", status = "" } = {}) {
  await delay();
  const needle = q.trim().toLowerCase();
  return copy({
    items: adminDb.staff
      .filter(
        (s) =>
          (!roleId || s.roleId === Number(roleId)) &&
          (!status || s.status === status) &&
          (!needle ||
            s.name.toLowerCase().includes(needle) ||
            s.email.toLowerCase().includes(needle))
      )
      .map(staffOut),
  });
}

// POST /admin/staff  { name, email, roleId }
// Creates an "invited" account and emails an invitation to set a password.
//   (409 EMAIL_TAKEN)
export async function inviteStaff({ name, email, roleId }) {
  await delay(500);
  const cleanEmail = email.trim().toLowerCase();
  if (adminDb.staff.some((s) => s.email === cleanEmail)) {
    throw apiError("EMAIL_TAKEN", 409);
  }
  findRole(roleId);
  const staff = {
    id: nextId(adminDb.staff),
    name: name.trim(),
    email: cleanEmail,
    roleId: Number(roleId),
    status: "invited",
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  };
  adminDb.staff = [...adminDb.staff, staff];
  return copy(staffOut(staff));
}

// PATCH /admin/staff/:id  { name?, roleId?, status? ("active" | "disabled") }
//   (403 CANNOT_CHANGE_SELF when changing your own role or status)
export async function updateStaff({ id, actorId, ...changes }) {
  await delay();
  const staff = findStaff(id);
  const isSelf = staff.id === actorId;
  if (
    isSelf &&
    ((changes.roleId !== undefined &&
      Number(changes.roleId) !== staff.roleId) ||
      (changes.status !== undefined && changes.status !== staff.status))
  ) {
    throw apiError("CANNOT_CHANGE_SELF", 403);
  }
  if (changes.roleId !== undefined) findRole(changes.roleId);
  const updated = {
    ...staff,
    ...(changes.name !== undefined && { name: changes.name.trim() }),
    ...(changes.roleId !== undefined && { roleId: Number(changes.roleId) }),
    ...(changes.status !== undefined && { status: changes.status }),
  };
  adminDb.staff = adminDb.staff.map((s) => (s.id === staff.id ? updated : s));
  return copy(staffOut(updated));
}

// POST /admin/staff/:id/resend-invite
export async function resendInvite(id) {
  await delay(400);
  const staff = findStaff(id);
  if (staff.status !== "invited") throw apiError("NOT_INVITED", 409);
  return { success: true };
}

// DELETE /admin/staff/:id   (403 CANNOT_CHANGE_SELF for your own account)
export async function deleteStaff({ id, actorId }) {
  await delay();
  const staff = findStaff(id);
  if (staff.id === actorId) throw apiError("CANNOT_CHANGE_SELF", 403);
  adminDb.staff = adminDb.staff.filter((s) => s.id !== staff.id);
  return { id: staff.id };
}
