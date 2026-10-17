// The website's HTTP client: every real request goes through apiRequest.
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.esmlimo.com";

const TIMEOUT_MS = 15000;

// Thrown for any failed request. `message` is the backend's error code (e.g.
// "EMAIL_TAKEN", see docs/admin-api.md), the same convention the mocks and the
// dashboard use, so the forms can map it to a translated text. `status` is the
// HTTP status, or 0 when the server could not be reached (or timed out).
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// `body` may be a plain object (sent as JSON) or an already-stringified one.
// Resolves with the parsed JSON, or null for an empty answer (e.g. 204).
export async function apiRequest(path, { body, headers, ...options } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      signal: controller.signal,
      ...options,
      headers: { "Content-Type": "application/json", ...headers },
      body: body && typeof body !== "string" ? JSON.stringify(body) : body,
    });
  } catch {
    throw new ApiError("NETWORK_ERROR", 0);
  } finally {
    clearTimeout(timer);
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(data?.code ?? "REQUEST_FAILED", response.status);
  }
  return data;
}
