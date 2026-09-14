const DEFAULT_SITE_ORIGIN = "https://www.illanesfaciano.com";

export const SITE_URL =
  import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") ?? DEFAULT_SITE_ORIGIN;

/** Base canónica para metadatos (og, JSON-LD, sitemap en build). */
export const METADATA_BASE = SITE_URL;

export const SITE_NAME = "Illanes Faciano";

export const DEFAULT_PAGE_TITLE =
  "Illanes Faciano | Tasaciones y Operaciones Inmobiliarias en Tucumán";

export const DEFAULT_DESCRIPTION =
  "Martillero Público, Corredor Público Nacional y Perito Tasador en San Miguel de Tucumán. Tasaciones, peritajes, remates y catálogo inmobiliario.";

export const LOCALITY = "San Miguel de Tucumán";
export const REGION = "Tucumán";
export const COUNTRY = "AR";
