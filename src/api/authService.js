// Mock account API (sign up, email verification, login). There is no backend
// yet, so these only log and resolve, like the other services. Passwords are
// never logged or stored.
//
// The demo verification code is DEMO_VERIFICATION_CODE; any other code is
// rejected with "INVALID_CODE" so the form's error state can be tried.
export const DEMO_VERIFICATION_CODE = "123456";

// TODO(api): swap for POST /auth/signup (creates the account and emails a
// 6-digit code).
export async function signUpRequest({ email }) {
  // return apiRequest("/auth/signup", { method: "POST", body: JSON.stringify({ email, password }) });
  console.info("Sign up (mock): verification code sent to", email);
  return Promise.resolve({ success: true, email });
}

// TODO(api): swap for POST /auth/verify-email.
export async function verifyEmailRequest({ email, code }) {
  // return apiRequest("/auth/verify-email", { method: "POST", body: JSON.stringify({ email, code }) });
  if (code !== DEMO_VERIFICATION_CODE) {
    return Promise.reject(new Error("INVALID_CODE"));
  }
  console.info("Email verified (mock):", email);
  return Promise.resolve({ success: true, email });
}

// TODO(api): swap for POST /auth/resend-code.
export async function resendCodeRequest({ email }) {
  // return apiRequest("/auth/resend-code", { method: "POST", body: JSON.stringify({ email }) });
  console.info("Verification code re-sent (mock) to", email);
  return Promise.resolve({ success: true, email });
}

// TODO(api): swap for POST /auth/login (answers with the signed-in user).
export async function loginRequest({ email }) {
  // return apiRequest("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  console.info("Login (mock):", email);
  return Promise.resolve({ success: true, email });
}

// TODO(api): swap for PUT /me (name, phone) and a photo upload (the photo goes
// to storage and the profile keeps its URL, not the data URL kept here).
export async function updateProfileRequest({ name, phone, photo }) {
  // return apiRequest("/me", { method: "PUT", body: JSON.stringify({ name, phone, photo }) });
  console.info("Profile saved (mock):", {
    name,
    phone,
    hasPhoto: Boolean(photo),
  });
  return Promise.resolve({ success: true });
}
