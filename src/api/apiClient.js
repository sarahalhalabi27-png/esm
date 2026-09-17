// Central place to wire up a real backend later.
// Swap BASE_URL and drop in fetch/axios once the API exists.
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.esmlimo.com";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
  return response.json();
}
