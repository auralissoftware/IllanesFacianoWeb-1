import type { SearchAction } from "./searchTypes";

export type { CatalogListing, CatalogMedia } from "./catalogRepository";
export { fetchCatalogListingById, fetchCatalogListings } from "./catalogRepository";

/** @deprecated Usar fetchCatalogListings desde Supabase */
export function getCatalogItems(_action: SearchAction) {
  return [];
}
