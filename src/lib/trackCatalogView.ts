import { hasAnalyticsConsent } from "./cookieConsent";
import { supabase } from "./supabase";

type VisitorRegion = {
  province: string | null;
  country: string | null;
};

const VIEW_SESSION_PREFIX = "catalog-view-";
const inFlightItemIds = new Set<string>();

function isDev(): boolean {
  return import.meta.env.DEV;
}

async function detectVisitorRegion(): Promise<VisitorRegion> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const response = await fetch("https://ipapi.co/json/", {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return { province: null, country: null };
    }

    const data = (await response.json()) as {
      region?: string;
      country_code?: string;
      country_name?: string;
    };

    return {
      province: data.region?.trim() || null,
      country: data.country_code?.trim() || data.country_name?.trim() || null,
    };
  } catch {
    return { province: null, country: null };
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
  province: string | null,
  country: string | null,
): Promise<{ ok: true; total: number | null } | { ok: false; message: string }> {
  if (!supabase) {
    return { ok: false, message: "Supabase no configurado" };
  }

  const { error } = await supabase.from("catalog_views").insert({
    catalog_item_id: itemId,
    province,
    country,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, total: null };
}

async function insertCatalogViewViaRpc(
  itemId: string,
  province: string | null,
  country: string | null,
): Promise<{ ok: true; total: number | null } | { ok: false; message: string }> {
  if (!supabase) {
    return { ok: false, message: "Supabase no configurado" };
  }

  const { data, error } = await supabase.rpc("record_catalog_view", {
    p_catalog_item_id: itemId,
    p_province: province,
    p_country: country,
  });

  if (error) {
    if (isMissingRpcError(error.message)) {
      return insertCatalogViewDirect(itemId, province, country);
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
    const { province, country } = await detectVisitorRegion();
    const result = await insertCatalogViewViaRpc(itemId, province, country);

    if (!result.ok) {
      if (isDev()) {
        console.error("[trackCatalogView] No se registró la visita:", result.message);
      }
      return;
    }

    markViewRecordedThisSession(itemId);

    if (isDev()) {
      console.info(
        "[trackCatalogView] Visita registrada",
        { itemId, province, country, totalForItem: result.total },
      );
    }
  } finally {
    inFlightItemIds.delete(itemId);
  }
}
