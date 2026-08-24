import { requireSupabase } from "./supabase";

export type TopCatalogPublication = {
  catalogItemId: string;
  title: string;
  slug: string;
  categoria: string;
  viewCount: number;
};

export type ProvinceViewStat = {
  province: string;
  viewCount: number;
};

export type CatalogViewStats = {
  topPublications: TopCatalogPublication[];
  byProvince: ProvinceViewStat[];
  viewCountsByItem: Record<string, number>;
};

async function requireAdminClient() {
  return requireSupabase();
}

export async function fetchCatalogViewStats(): Promise<CatalogViewStats> {
  const client = await requireAdminClient();

  const [topResult, provinceResult, countsResult] = await Promise.all([
    client.rpc("get_top_catalog_publications", { p_limit: 5 }),
    client.rpc("get_catalog_views_by_province"),
    client.rpc("get_catalog_view_counts"),
  ]);

  if (topResult.error) {
    throw new Error(topResult.error.message);
  }

  if (provinceResult.error) {
    throw new Error(provinceResult.error.message);
  }

  if (countsResult.error) {
    throw new Error(countsResult.error.message);
  }

  const topPublications: TopCatalogPublication[] = (topResult.data ?? []).map(
    (row: {
      catalog_item_id: string;
      titulo: string;
      slug: string;
      categoria: string;
      view_count: number;
    }) => ({
      catalogItemId: row.catalog_item_id,
      title: row.titulo,
      slug: row.slug,
      categoria: row.categoria,
      viewCount: Number(row.view_count),
    }),
  );

  const byProvince: ProvinceViewStat[] = (provinceResult.data ?? []).map(
    (row: { province: string; view_count: number }) => ({
      province: row.province,
      viewCount: Number(row.view_count),
    }),
  );

  const viewCountsByItem: Record<string, number> = {};
  for (const row of countsResult.data ?? []) {
    viewCountsByItem[row.catalog_item_id] = Number(row.view_count);
  }

  return { topPublications, byProvince, viewCountsByItem };
}

export async function fetchCatalogItemViewProvinces(
  itemId: string,
): Promise<ProvinceViewStat[]> {
  const client = await requireAdminClient();

  const { data, error } = await client.rpc("get_catalog_item_view_provinces", {
    p_item_id: itemId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row: { province: string; view_count: number }) => ({
    province: row.province,
    viewCount: Number(row.view_count),
  }));
}
