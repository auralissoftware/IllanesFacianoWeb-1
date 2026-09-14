import { ensureAdminSession } from "./adminAuth";

/** @deprecated Usar GeoViewStat */
export type ProvinceViewStat = GeoViewStat;

export type GeoViewStat = {
  countryCode: string;
  countryName: string;
  region: string;
  viewCount: number;
};

export type CatalogViewStats = {
  totalSiteViews: number;
  viewCountsByItem: Record<string, number>;
  geoByItem: Record<string, GeoViewStat[]>;
};

export type CatalogItemViewDetails = {
  total: number;
  byCountry: {
    countryCode: string;
    countryName: string;
    viewCount: number;
    regions: { region: string; viewCount: number }[];
  }[];
  recent: {
    viewedAt: string;
    countryCode: string;
    countryName: string;
    region: string;
    city: string | null;
  }[];
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
  geoByItem: {},
};

export async function fetchCatalogViewStats(): Promise<CatalogViewStats> {
  const client = await ensureAdminSession();

  const [totalResult, countsResult, geoResult] = await Promise.all([
    client.rpc("get_catalog_total_views"),
    client.rpc("get_catalog_view_counts"),
    client.rpc("get_all_catalog_item_geo_summary"),
  ]);

  let geoRows = geoResult.data;
  let geoError = geoResult.error?.message;

  if (geoError && isMissingStatsSetup(geoError)) {
    const legacy = await client.rpc("get_all_catalog_item_view_provinces");
    if (!legacy.error) {
      geoRows = (legacy.data ?? []).map(
        (row: { catalog_item_id: string; province: string; view_count: number }) => ({
          catalog_item_id: row.catalog_item_id,
          country_code: "AR",
          country_name: "Argentina",
          region: row.province,
          view_count: row.view_count,
        }),
      );
      geoError = undefined;
    }
  }

  const statsError =
    totalResult.error?.message ?? countsResult.error?.message ?? geoError;

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

  const geoByItem: Record<string, GeoViewStat[]> = {};

  for (const raw of geoRows ?? []) {
    const row = raw as {
      catalog_item_id: string;
      country_code: string;
      country_name: string;
      region: string;
      view_count: number;
    };

    if (!geoByItem[row.catalog_item_id]) {
      geoByItem[row.catalog_item_id] = [];
    }

    geoByItem[row.catalog_item_id].push({
      countryCode: row.country_code,
      countryName: row.country_name,
      region: row.region,
      viewCount: Number(row.view_count),
    });
  }

  return {
    totalSiteViews: Number(totalResult.data ?? 0),
    viewCountsByItem,
    geoByItem,
  };
}

export async function fetchCatalogItemViewDetails(
  itemId: string,
): Promise<CatalogItemViewDetails> {
  const client = await ensureAdminSession();

  const [breakdownResult, recentResult, countResult] = await Promise.all([
    client.rpc("get_catalog_item_view_breakdown", { p_item_id: itemId }),
    client.rpc("get_catalog_item_recent_views", { p_item_id: itemId, p_limit: 12 }),
    client.rpc("get_catalog_view_counts"),
  ]);

  const breakdownError = breakdownResult.error?.message;
  const recentError = recentResult.error?.message;

  if (breakdownError && !isMissingStatsSetup(breakdownError)) {
    throw new Error(breakdownError);
  }

  if (recentError && !isMissingStatsSetup(recentError)) {
    throw new Error(recentError);
  }

  const breakdownRows = (breakdownResult.data ?? []) as {
    country_code: string;
    country_name: string;
    region: string;
    view_count: number;
  }[];

  const countryMap = new Map<
    string,
    {
      countryCode: string;
      countryName: string;
      viewCount: number;
      regions: { region: string; viewCount: number }[];
    }
  >();

  for (const row of breakdownRows) {
    const key = `${row.country_code}|${row.country_name}`;
    const existing = countryMap.get(key) ?? {
      countryCode: row.country_code,
      countryName: row.country_name,
      viewCount: 0,
      regions: [],
    };

    existing.viewCount += Number(row.view_count);
    existing.regions.push({
      region: row.region,
      viewCount: Number(row.view_count),
    });
    countryMap.set(key, existing);
  }

  const byCountry = [...countryMap.values()].sort((a, b) => b.viewCount - a.viewCount);
  for (const country of byCountry) {
    country.regions.sort((a, b) => b.viewCount - a.viewCount);
  }

  const totalFromCounts = (countResult.data ?? []).find(
    (row: { catalog_item_id: string }) => row.catalog_item_id === itemId,
  );

  const total = totalFromCounts
    ? Number(totalFromCounts.view_count)
    : breakdownRows.reduce((sum, row) => sum + Number(row.view_count), 0);

  const recent = (recentResult.data ?? []).map(
    (row: {
      viewed_at: string;
      country_code: string;
      country_name: string;
      region: string;
      city: string | null;
    }) => ({
      viewedAt: row.viewed_at,
      countryCode: row.country_code,
      countryName: row.country_name,
      region: row.region,
      city: row.city,
    }),
  );

  return { total, byCountry, recent };
}
