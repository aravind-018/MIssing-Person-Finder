/**
 * Resolve media and upload URLs across local development and production environments.
 * Uses VITE_UPLOADS_URL or extracts root from VITE_API_URL if configured,
 * otherwise falls back to relative /uploads path.
 */
const getBaseUploadsUrl = () => {
  if (import.meta.env.VITE_UPLOADS_URL) {
    return import.meta.env.VITE_UPLOADS_URL.replace(/\/+$/, "");
  }
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.startsWith("http")) {
    try {
      const url = new URL(import.meta.env.VITE_API_URL);
      // Remove trailing /api or similar path segment
      return `${url.origin}/uploads`;
    } catch {
      // fallback
    }
  }
  return "/uploads";
};

const BASE_UPLOADS_URL = getBaseUploadsUrl();

export const getUploadUrl = (filename) => {
  if (!filename) return "";
  if (
    typeof filename === "string" &&
    (filename.startsWith("http://") ||
      filename.startsWith("https://") ||
      filename.startsWith("data:") ||
      filename.startsWith("blob:"))
  ) {
    return filename;
  }

  let clean = String(filename);
  if (clean.startsWith("/")) clean = clean.slice(1);
  if (clean.startsWith("uploads/")) clean = clean.slice(8);

  return `${BASE_UPLOADS_URL}/${clean}`;
};

export default getUploadUrl;
