import type { SearchAction } from "./searchTypes";

export type { CatalogListing, CatalogMedia } from "./catalogRepository";
export {
  fetchCatalogListingById,
  fetchCatalogListingBySlug,
  fetchCatalogListings,
} from "./catalogRepository";
export { buildCatalogDetailPath, buildCatalogDetailUrl } from "./catalogSlug";

/** @deprecated Usar fetchCatalogListings desde Supabase */
export function getCatalogItems(_action: SearchAction) {
  return [];
}
