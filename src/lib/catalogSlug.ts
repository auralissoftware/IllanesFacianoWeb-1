import type { SearchTab } from "./searchTypes";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const categoriaSlugSegments: Record<SearchTab, string> = {
  propiedades: "propiedades",
  bienes_muebles: "bienes-muebles",
  remates: "remates",
};

const slugSegmentToCategoria: Record<string, SearchTab> = {
  propiedades: "propiedades",
  "bienes-muebles": "bienes_muebles",
  remates: "remates",
};

export function isUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

export function slugifyTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "publicacion";
}

export function categoriaFromSlugSegment(segment: string): SearchTab | null {
  return slugSegmentToCategoria[segment] ?? null;
}

export function categoriaToSlugSegment(categoria: SearchTab): string {
  return categoriaSlugSegments[categoria];
}

export function buildCatalogDetailPath(
  categoria: SearchTab,
  slug: string,
): string {
  return `/catalogo/${categoriaSlugSegments[categoria]}/${slug}`;
}

export function buildCatalogDetailUrl(
  origin: string,
  categoria: SearchTab,
  slug: string,
): string {
  return `${origin}${buildCatalogDetailPath(categoria, slug)}`;
}
