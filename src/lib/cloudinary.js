/**
 * Build an optimized Cloudinary delivery URL: modern format (f_auto), automatic
 * quality (q_auto), and an optional resize/crop. Anything that isn't a
 * Cloudinary upload URL — Google avatars, blob/data previews, the fallback SVG —
 * is returned untouched so it's always safe to call.
 *
 * @param {string} url
 * @param {{ width?: number, height?: number, crop?: string }} [opts]
 */
export const optimizeImage = (url, { width, height, crop = "fill" } = {}) => {
  if (
    typeof url !== "string" ||
    !url.includes("res.cloudinary.com/") ||
    !url.includes("/upload/")
  ) {
    return url;
  }
  const t = ["f_auto", "q_auto"];
  if (width) t.push(`w_${width}`);
  if (height) t.push(`h_${height}`);
  // Only crop to a fixed box when both dimensions are given; a single
  // dimension just scales proportionally (keeps the original aspect ratio).
  if (width && height) t.push(`c_${crop}`, "g_auto");
  return url.replace("/upload/", `/upload/${t.join(",")}/`);
};
