import { adminApi, fromMock } from "./adminApi.js";

// Image uploads, shared by every screen with photos (fleet, blog, ...).
// TODO(api): replace `queryFn` with:
//   query: (file) => { const body = new FormData(); body.append("file", file);
//     return { url: "/uploads", method: "POST", body }; }
// POST /admin/uploads (multipart "file") -> { url }

async function readAsDataUrl(file) {
  // The mock keeps the image in memory as a data URL.
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
    uploadImage: build.mutation({
      queryFn: (file) => fromMock(readAsDataUrl(file)),
    }),
  }),
});

export const { useUploadImageMutation } = uploadsApi;
