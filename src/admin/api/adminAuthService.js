// Mock staff auth API for the dashboard. There is no backend yet, so these
// read mockAdminData.js and answer after a short delay, the way the API will.
//
// Contract the backend should follow:
//   POST /admin/auth/login  { email, password }
//     -> { token, user: { id, name, email, role: { id, name } }, permissions: ["bookings.view", ...] }
//   GET  /admin/auth/me     (Authorization: Bearer <token>)
//     -> { user, permissions }   (401 when the token is invalid or expired)
//   POST /admin/auth/logout (Authorization: Bearer <token>)
//
// Errors are thrown with a code as the message: INVALID_CREDENTIALS,
// ACCOUNT_DISABLED, INVITE_PENDING (hasn't set a password yet), UNAUTHORIZED.
import { DEMO_STAFF_PASSWORD, adminDb } from "./mockAdminData.js";

const TOKEN_PREFIX = "mock-admin-token-";
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// A copy, as a real API would send: the store freezes what it keeps.
function sessionFor(staff) {
  const role = adminDb.roles.find((r) => r.id === staff.roleId);
  return structuredClone({
    user: {
      id: staff.id,
      name: staff.name,
      email: staff.email,
      role: role ? { id: role.id, name: role.name } : null,
    },
    permissions: role ? role.permissions : [],
  });
}

// TODO(api): swap for POST /admin/auth/login.
export async function adminLoginRequest({ email, password }) {
  // return apiRequest("/admin/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  await delay();
  const staff = adminDb.staff.find(
    (s) => s.email === email.trim().toLowerCase()
  );
  if (!staff || password !== DEMO_STAFF_PASSWORD) {
    throw new Error("INVALID_CREDENTIALS");
  }
  if (staff.status === "invited") throw new Error("INVITE_PENDING");
  if (staff.status !== "active") throw new Error("ACCOUNT_DISABLED");
  staff.lastLoginAt = new Date().toISOString();
  return { token: `${TOKEN_PREFIX}${staff.id}`, ...sessionFor(staff) };
}

// TODO(api): swap for GET /admin/auth/me.
export async function getAdminMeRequest(token) {
  // return apiRequest("/admin/auth/me", { headers: { Authorization: `Bearer ${token}` } });
  await delay();
  const id = Number(token?.slice(TOKEN_PREFIX.length));
  const staff = adminDb.staff.find((s) => s.id === id);
  if (!token?.startsWith(TOKEN_PREFIX) || !staff || staff.status !== "active") {
    throw new Error("UNAUTHORIZED");
  }
  return sessionFor(staff);
}

// TODO(api): swap for POST /admin/auth/logout.
export async function adminLogoutRequest() {
  // return apiRequest("/admin/auth/logout", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
  await delay(150);
  return { success: true };
}
