/** Evita contenido mixto si alguna URL externa llega con http:// */
export function ensureHttpsUrl(url: string): string {
  if (!url) {
    return url;
  }

  if (
    url.startsWith("/") ||
    url.startsWith("blob:") ||
    url.startsWith("data:") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  ) {
    return url;
  }

  return url.replace(/^http:\/\//i, "https://");
}
