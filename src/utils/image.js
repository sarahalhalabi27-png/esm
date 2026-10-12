// Profile photo helpers.

export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

// Reads an image file and returns a square JPEG data URL: the picture is
// cropped to its centre and scaled to `size` px, so what is stored (and kept
// in the browser until there is a server) is small, whatever was picked.
// Rejects with Error("TYPE"), Error("SIZE") or Error("READ").
export async function squarePhotoDataUrl(file, size = 256) {
  if (!PHOTO_TYPES.includes(file.type)) throw new Error("TYPE");
  if (file.size > PHOTO_MAX_BYTES) throw new Error("SIZE");

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("READ");
  }

  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  context.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    size,
    size
  );
  bitmap.close?.();
  return canvas.toDataURL("image/jpeg", 0.85);
}
