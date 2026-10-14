import { apiRequest } from "./apiClient.js";
import { USE_MOCK } from "./config.js";

// POST /contact-messages
export async function submitContactMessage(payload) {
  if (!USE_MOCK) {
    return apiRequest("/contact-messages", { method: "POST", body: payload });
  }
  console.info("Contact message (mock submit):", payload);
  return { success: true, payload };
}
