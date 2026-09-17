// TODO(api): swap for POST /contact-messages once the backend is ready.
export async function submitContactMessage(payload) {
  // return apiRequest("/contact-messages", { method: "POST", body: JSON.stringify(payload) });
  console.info("Contact message (mock submit):", payload);
  return Promise.resolve({ success: true, payload });
}
