export const BIEN_MUEBLE_SIN_CATEGORIA = "sin-categoria" as const;
export const BIEN_MUEBLE_MUEBLES_OTROS = "muebles-otros" as const;

export type BienMuebleCategoria =
  | "vehiculos"
  | "camionetas"
  | "maquinaria-pesada"
  | "lotes-herramientas"
  | typeof BIEN_MUEBLE_MUEBLES_OTROS
  | typeof BIEN_MUEBLE_SIN_CATEGORIA;

export type BienesMueblesFilters = {
  assetType: string;
  condition: string;
};

export type CatalogItem = {
  id: string;
  section: "bienes_muebles";
  category?: BienMuebleCategoria | string | null;
  condition?: string;
  title: string;
};

export function isSinCategoria(
  category: CatalogItem["category"],
): category is null | undefined | "" | typeof BIEN_MUEBLE_SIN_CATEGORIA {
  return (
    category == null ||
    category === "" ||
    category === BIEN_MUEBLE_SIN_CATEGORIA
  );
}

export function matchesBienMuebleCategory(
  item: CatalogItem,
  assetType: string,
): boolean {
  if (assetType === BIEN_MUEBLE_MUEBLES_OTROS) {
    return isSinCategoria(item.category);
  }

  if (!assetType) {
    return true;
  }

  return item.category === assetType;
}

export function filterBienesMuebles(
  items: CatalogItem[],
  filters: BienesMueblesFilters,
): CatalogItem[] {
  return items.filter((item) => {
    const matchesType = matchesBienMuebleCategory(item, filters.assetType);

    const matchesCondition =
      !filters.condition || item.condition === filters.condition;

    return matchesType && matchesCondition;
  });
}

export function getBienMuebleSearchLabel(assetType: string): string {
  if (assetType === BIEN_MUEBLE_MUEBLES_OTROS) {
    return "Mostrando muebles, otros bienes y publicaciones sin categoría asignada.";
  }

  if (!assetType) {
    return "Buscando vehículos y activos con los filtros seleccionados.";
  }

  return "Buscando vehículos y activos con los filtros seleccionados.";
}
