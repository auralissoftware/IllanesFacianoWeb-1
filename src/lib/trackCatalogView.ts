import { supabase } from "./supabase";

type VisitorRegion = {
  province: string | null;
  country: string | null;
};

const VIEW_SESSION_PREFIX = "catalog-view-";

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

export async function trackCatalogView(itemId: string): Promise<void> {
  if (!supabase || !itemId || hasRecordedViewThisSession(itemId)) {
    return;
  }

  markViewRecordedThisSession(itemId);

  const { province, country } = await detectVisitorRegion();

  const { error } = await supabase.from("catalog_views").insert({
    catalog_item_id: itemId,
    province,
    country,
  });

  if (error) {
    try {
      sessionStorage.removeItem(`${VIEW_SESSION_PREFIX}${itemId}`);
    } catch {
      // noop
    }
  }
}
