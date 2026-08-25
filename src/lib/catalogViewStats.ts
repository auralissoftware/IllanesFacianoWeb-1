import { ensureAdminSession } from "./adminAuth";

export type ProvinceViewStat = {
  province: string;
  viewCount: number;
};

export type CatalogViewStats = {
  totalSiteViews: number;
  viewCountsByItem: Record<string, number>;
  provincesByItem: Record<string, ProvinceViewStat[]>;
};

function isMissingStatsSetup(message: string): boolean {
  const normalized = message.toLowerCase();

  return (
    normalized.includes("could not find the function") ||
    normalized.includes("does not exist") ||
    normalized.includes("permission denied for function")
  );
}

const emptyStats: CatalogViewStats = {
  totalSiteViews: 0,
  viewCountsByItem: {},
  provincesByItem: {},
};

export async function fetchCatalogViewStats(): Promise<CatalogViewStats> {
  const client = await ensureAdminSession();

  const [totalResult, countsResult, provincesResult] = await Promise.all([
    client.rpc("get_catalog_total_views"),
    client.rpc("get_catalog_view_counts"),
    client.rpc("get_all_catalog_item_view_provinces"),
  ]);

  const statsError =
    totalResult.error?.message ??
    countsResult.error?.message ??
    provincesResult.error?.message;

  if (statsError) {
    if (isMissingStatsSetup(statsError)) {
      return emptyStats;
    }

    throw new Error(statsError);
  }

  const viewCountsByItem: Record<string, number> = {};
  for (const row of countsResult.data ?? []) {
    viewCountsByItem[row.catalog_item_id] = Number(row.view_count);
  }

  const provincesByItem: Record<string, ProvinceViewStat[]> = {};
  for (const row of provincesResult.data ?? []) {
    const itemId = row.catalog_item_id as string;
    const entry: ProvinceViewStat = {
      province: row.province,
      viewCount: Number(row.view_count),
    };

    if (!provincesByItem[itemId]) {
      provincesByItem[itemId] = [];
    }

    provincesByItem[itemId].push(entry);
  }

  return {
    totalSiteViews: Number(totalResult.data ?? 0),
    viewCountsByItem,
    provincesByItem,
  };
}
