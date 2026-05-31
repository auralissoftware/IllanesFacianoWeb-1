import type { BienesMueblesFilters } from "./searchFilters";

export type SearchTab = "propiedades" | "bienes_muebles" | "remates";

export type PropiedadesFilters = {
  propertyType: string;
  operation: string;
  location: string;
};

export type RematesFilters = {
  auctionType: string;
  dateFrom: string;
  dateTo: string;
};

export type SearchAction =
  | { mode: "all"; tab: SearchTab }
  | { mode: "filtered"; tab: "propiedades"; filters: PropiedadesFilters }
  | { mode: "filtered"; tab: "bienes_muebles"; filters: BienesMueblesFilters }
  | { mode: "filtered"; tab: "remates"; filters: RematesFilters };

export type CatalogViewState = SearchAction;

export const catalogSectionLabels: Record<SearchTab, string> = {
  propiedades: "Propiedades",
  bienes_muebles: "Vehículos u otros activos",
  remates: "Remates",
};

export function getActiveTabFromAction(action: SearchAction): SearchTab {
  return action.mode === "all" ? action.tab : action.tab;
}
