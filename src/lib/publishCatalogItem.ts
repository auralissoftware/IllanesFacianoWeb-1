import { isSupabaseConfigured } from "./supabase";
import { publishCatalogItemToSupabase } from "./catalogRepository";
import type { PublishCatalogPayload } from "../types/adminCatalog";

export type PublishResult = { ok: true } | { ok: false; error: string };

export async function publishCatalogItem(
  payload: PublishCatalogPayload,
): Promise<PublishResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error:
        "Supabase no está configurado. Agregá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env.",
    };
  }

  try {
    await publishCatalogItemToSupabase(payload);
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo publicar el activo. Intentá de nuevo.";

    return { ok: false, error: message };
  }
}
