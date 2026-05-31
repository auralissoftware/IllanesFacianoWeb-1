const imageExtensions = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "svgz",
  "heic",
  "heif",
  "avif",
  "tif",
  "tiff",
  "ico",
  "jfif",
  "pjpeg",
  "pjp",
  "apng",
]);

const videoExtensions = new Set([
  "mp4",
  "webm",
  "mov",
  "avi",
  "mkv",
  "m4v",
  "3gp",
  "3g2",
  "ogv",
  "mpeg",
  "mpg",
  "wmv",
  "flv",
]);

export type MediaKind = "image" | "video";

function getFileExtension(fileName: string): string {
  const parts = fileName.split(".");

  if (parts.length < 2) {
    return "";
  }

  return parts.at(-1)?.toLowerCase() ?? "";
}

export function getMediaKind(file: File): MediaKind | null {
  if (file.type.startsWith("image/")) {
    return "image";
  }

  if (file.type.startsWith("video/")) {
    return "video";
  }

  const extension = getFileExtension(file.name);

  if (imageExtensions.has(extension)) {
    return "image";
  }

  if (videoExtensions.has(extension)) {
    return "video";
  }

  return null;
}

export function isAllowedMediaFile(file: File): boolean {
  return getMediaKind(file) !== null;
}

export function isVideoFile(file: File): boolean {
  return getMediaKind(file) === "video";
}

export const mediaUploadAccept = "image/*,video/*";
