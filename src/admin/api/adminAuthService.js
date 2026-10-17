// Staff auth for the dashboard. With VITE_ADMIN_MOCK on (the default, see
// ./config.js) these read mockAdminData.js and answer after a short delay;
// with it set to "false" they call the real API below.
//
// Contract the backend should follow:
//   POST /admin/auth/login  { email, password }
//     -> { token, user: { id, name, email, role: { id, name } }, permissions: ["bookings.view", ...] }
//   GET  /admin/auth/me     (Authorization: Bearer <token>)
//     -> { user, permissions }   (401 when the token is invalid or expired)
//   POST /admin/auth/logout (Authorization: Bearer <token>)
//
// Errors are thrown with the backend's code as the message (see
// docs/admin-api.md): INVALID_CREDENTIALS, ACCOUNT_DISABLED, INVITE_PENDING
// (hasn't set a password yet), UNAUTHORIZED.
import { DEMO_STAFF_PASSWORD, adminDb } from "./mockAdminData.js";
import { BASE_URL } from "../../api/apiClient.js";
import { USE_MOCK } from "./config.js";

// A JSON request to /admin/auth/... that throws an Error whose message is the
// backend's error code, like the mocks below.
export async function authRequest(path, { token, body, method = "GET" } = {}) {
  const response = await fetch(`${BASE_URL}/admin/auth${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body && JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      data.code ?? (response.status === 401 ? "UNAUTHORIZED" : "REQUEST_FAILED")
    );
    error.status = response.status;
    throw error;
  }
  return data;
}

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

// POST /admin/auth/login
export async function adminLoginRequest({ email, password }) {
  if (!USE_MOCK) {
    return authRequest("/login", { method: "POST", body: { email, password } });
  }
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

// GET /admin/auth/me
export async function getAdminMeRequest(token) {
  if (!USE_MOCK) return authRequest("/me", { token });
  await delay();
  const id = Number(token?.slice(TOKEN_PREFIX.length));
  const staff = adminDb.staff.find((s) => s.id === id);
  if (!token?.startsWith(TOKEN_PREFIX) || !staff || staff.status !== "active") {
    throw new Error("UNAUTHORIZED");
  }
  return sessionFor(staff);
}

// POST /admin/auth/logout
export async function adminLogoutRequest(token) {
  if (!USE_MOCK) return authRequest("/logout", { method: "POST", token });
  await delay(150);
  return { success: true };
}
