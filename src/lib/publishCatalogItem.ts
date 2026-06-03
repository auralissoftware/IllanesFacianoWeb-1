import { isSupabaseConfigured } from "./supabase";
import {
  deleteCatalogItemToSupabase,
  publishCatalogItemToSupabase,
  updateCatalogItemToSupabase,
} from "./catalogRepository";
import type {
  PublishCatalogPayload,
  UpdateCatalogPayload,
} from "../types/adminCatalog";

export type PublishResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type MutationResult = { ok: true } | { ok: false; error: string };

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

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
    const id = await publishCatalogItemToSupabase(payload);
    return { ok: true, id };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(error, "No se pudo publicar el activo. Intentá de nuevo."),
    };
  }
}

export async function updateCatalogItem(
  payload: UpdateCatalogPayload,
): Promise<MutationResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error:
        "Supabase no está configurado. Agregá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env.",
    };
  }

  try {
    await updateCatalogItemToSupabase(payload);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(error, "No se pudo guardar los cambios. Intentá de nuevo."),
    };
  }
}

export async function deleteCatalogItem(id: string): Promise<MutationResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error:
        "Supabase no está configurado. Agregá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env.",
    };
  }

  try {
    await deleteCatalogItemToSupabase(id);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: getErrorMessage(error, "No se pudo eliminar la publicación. Intentá de nuevo."),
    };
  }
}
