import { apiRequest } from "./apiClient.js";
import { USE_MOCK } from "./config.js";

// Account API (sign up, email verification, login, profile). With
// VITE_API_MOCK on (the default, see ./config.js) these only log and resolve.
// Passwords are never logged or stored by the mocks.
//
// The demo verification code is DEMO_VERIFICATION_CODE; any other code is
// rejected with "INVALID_CODE" so the form's error state can be tried.
export const DEMO_VERIFICATION_CODE = "123456";

// POST /auth/signup (creates the account and emails a 6-digit code)
export async function signUpRequest({ email, password }) {
  if (!USE_MOCK) {
    return apiRequest("/auth/signup", {
      method: "POST",
      body: { email, password },
    });
  }
  console.info("Sign up (mock): verification code sent to", email);
  return { success: true, email };
}

// POST /auth/verify-email
export async function verifyEmailRequest({ email, code }) {
  if (!USE_MOCK) {
    return apiRequest("/auth/verify-email", {
      method: "POST",
      body: { email, code },
    });
  }
  if (code !== DEMO_VERIFICATION_CODE) throw new Error("INVALID_CODE");
  console.info("Email verified (mock):", email);
  return { success: true, email };
}

// POST /auth/resend-code
export async function resendCodeRequest({ email }) {
  if (!USE_MOCK) {
    return apiRequest("/auth/resend-code", { method: "POST", body: { email } });
  }
  console.info("Verification code re-sent (mock) to", email);
  return { success: true, email };
}

// POST /auth/login (answers with the signed-in user)
export async function loginRequest({ email, password }) {
  if (!USE_MOCK) {
    return apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    });
  }
  console.info("Login (mock):", email);
  return { success: true, email };
}

// PUT /me (name, phone). TODO(api): the photo should go to storage and the
// profile keep its URL, not the data URL kept here.
export async function updateProfileRequest({ name, phone, photo }) {
  if (!USE_MOCK) {
    return apiRequest("/me", { method: "PUT", body: { name, phone, photo } });
  }
  console.info("Profile saved (mock):", {
    name,
    phone,
    hasPhoto: Boolean(photo),
  });
  return { success: true };
}
