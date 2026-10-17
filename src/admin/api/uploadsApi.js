import { adminApi, endpoint } from "./adminApi.js";

// Image uploads, shared by every screen with photos (fleet, blog, ...), as
// POST /admin/uploads (multipart "file") -> { url } (mock or API, see
// ./config.js). The mock keeps the image in memory as a data URL.

async function readAsDataUrl(file) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ url: reader.result });
    reader.onerror = () => {
      const error = new Error("UPLOAD_FAILED");
      error.status = 500;
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}

const uploadsApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    uploadImage: build.mutation(
      endpoint({
        mock: (file) => readAsDataUrl(file),
        query: (file) => {
          const body = new FormData();
          body.append("file", file);
          return { url: "/uploads", method: "POST", body };
        },
      })
    ),
  }),
});

export const { useUploadImageMutation } = uploadsApi;
