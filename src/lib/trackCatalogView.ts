import { hasAnalyticsConsent } from "./cookieConsent";
import { supabase } from "./supabase";

export type VisitorGeo = {
  countryCode: string | null;
  countryName: string | null;
  region: string | null;
  city: string | null;
};

const VIEW_SESSION_PREFIX = "catalog-view-";
const inFlightItemIds = new Set<string>();

function isDev(): boolean {
  return import.meta.env.DEV;
}

async function detectVisitorGeo(): Promise<VisitorGeo> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const response = await fetch("https://ipapi.co/json/", {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        countryCode: null,
        countryName: null,
        region: null,
        city: null,
      };
    }

    const data = (await response.json()) as {
      country_code?: string;
      country_name?: string;
      region?: string;
      city?: string;
    };

    return {
      countryCode: data.country_code?.trim().toUpperCase() || null,
      countryName: data.country_name?.trim() || null,
      region: data.region?.trim() || null,
      city: data.city?.trim() || null,
    };
  } catch {
    return {
      countryCode: null,
      countryName: null,
      region: null,
      city: null,
    };
  }
}

function hasRecordedViewThisSession(itemId: string): boolean {
  try {
    return sessionStorage.getItem(`${VIEW_SESSION_PREFIX}${itemId}`) === "1";
  } catch {
    return false;
  }
}

function markViewRecordedThisSession(itemId: string) {
  try {
    sessionStorage.setItem(`${VIEW_SESSION_PREFIX}${itemId}`, "1");
  } catch {
    // sessionStorage puede no estar disponible
  }
}

function isMissingRpcError(message: string): boolean {
  const normalized = message.toLowerCase();

  return (
    normalized.includes("could not find the function") ||
    normalized.includes("function public.record_catalog_view") ||
    (normalized.includes("record_catalog_view") && normalized.includes("does not exist"))
  );
}

async function insertCatalogViewDirect(
  itemId: string,
  geo: VisitorGeo,
): Promise<{ ok: true; total: number | null } | { ok: false; message: string }> {
  if (!supabase) {
    return { ok: false, message: "Supabase no configurado" };
  }

  const legacyCountry = geo.countryCode ?? geo.countryName;

  const { error } = await supabase.from("catalog_views").insert({
    catalog_item_id: itemId,
    country: legacyCountry,
    country_code: geo.countryCode,
    country_name: geo.countryName,
    province: geo.region,
    region: geo.region,
    city: geo.city,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, total: null };
}

async function insertCatalogViewViaRpc(
  itemId: string,
  geo: VisitorGeo,
): Promise<{ ok: true; total: number | null } | { ok: false; message: string }> {
  if (!supabase) {
    return { ok: false, message: "Supabase no configurado" };
  }

  const { data, error } = await supabase.rpc("record_catalog_view", {
    p_catalog_item_id: itemId,
    p_country_code: geo.countryCode,
    p_country_name: geo.countryName,
    p_region: geo.region,
    p_city: geo.city,
  });

  if (error) {
    if (isMissingRpcError(error.message)) {
      return insertCatalogViewDirect(itemId, geo);
    }

    return { ok: false, message: error.message };
  }

  return { ok: true, total: typeof data === "number" ? data : Number(data) };
}

export async function trackCatalogView(itemId: string): Promise<void> {
  if (!supabase || !itemId) {
    if (isDev()) {
      console.error("[trackCatalogView] Supabase no disponible o itemId vacío.");
    }
    return;
  }

  if (!hasAnalyticsConsent()) {
    if (isDev()) {
      console.info(
        "[trackCatalogView] Visita no registrada: el usuario no aceptó cookies analíticas.",
      );
    }
    return;
  }

  if (hasRecordedViewThisSession(itemId) || inFlightItemIds.has(itemId)) {
    return;
  }

  inFlightItemIds.add(itemId);

  try {
    const geo = await detectVisitorGeo();
    const result = await insertCatalogViewViaRpc(itemId, geo);

    if (!result.ok) {
      if (isDev()) {
        console.error("[trackCatalogView] No se registró la visita:", result.message);
      }
      return;
    }

    markViewRecordedThisSession(itemId);

    if (isDev()) {
      console.info("[trackCatalogView] Visita registrada", {
        itemId,
        geo,
        totalForItem: result.total,
      });
    }
  } finally {
    inFlightItemIds.delete(itemId);
  }
}
