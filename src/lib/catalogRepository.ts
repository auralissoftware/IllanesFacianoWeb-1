import type { AdminMoneda, PublishCatalogPayload } from "../types/adminCatalog";
import { formatPrecioForDisplay } from "../types/adminCatalog";
import { filterBienesMuebles } from "./searchFilters";
import { requireSupabase, supabase } from "./supabase";
import type {
  PropiedadesFilters,
  RematesFilters,
  SearchAction,
  SearchTab,
} from "./searchTypes";
import { isVideoFile } from "./mediaUpload";

export type CatalogMedia = {
  url: string;
  kind: "image" | "video";
};

export type CatalogListing = {
  id: string;
  section: SearchTab;
  title: string;
  description: string;
  ubicacion: string;
  precio: string;
  media: CatalogMedia[];
  details: Record<string, string>;
  propertyType?: string;
  operation?: string;
  location?: string;
  category?: string;
  condition?: string;
  auctionType?: string;
  dateFrom?: string;
  dateTo?: string;
};

type DbCatalogRow = {
  id: string;
  categoria: SearchTab;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  precio: string;
  estado: string | null;
  details: Record<string, string> | null;
  catalog_media: {
    public_url: string;
    kind: "image" | "video";
    sort_order: number;
  }[] | null;
};

function normalizeLocation(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function mapRowToListing(row: DbCatalogRow): CatalogListing {
  const details = row.details ?? {};
  const media = (row.catalog_media ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      url: item.public_url,
      kind: item.kind,
    }));

  const base: CatalogListing = {
    id: row.id,
    section: row.categoria,
    title: row.titulo,
    description: row.descripcion,
    ubicacion: row.ubicacion,
    precio: formatPrecioForDisplay(
      row.precio,
      (details.moneda as AdminMoneda | undefined) ?? "ars",
    ),
    media,
    details,
    location: normalizeLocation(row.ubicacion),
  };

  if (row.categoria === "propiedades") {
    return {
      ...base,
      propertyType: details.tipoPropiedad,
      operation: details.operacion,
    };
  }

  if (row.categoria === "bienes_muebles") {
    return {
      ...base,
      category: details.tipoBien,
      condition: row.estado ?? undefined,
    };
  }

  return {
    ...base,
    auctionType: details.tipoSubasta,
    dateFrom: details.fecha,
    dateTo: details.fecha,
  };
}

function filterPropiedades(
  items: CatalogListing[],
  filters: PropiedadesFilters,
): CatalogListing[] {
  return items.filter((item) => {
    const matchesType =
      !filters.propertyType || item.propertyType === filters.propertyType;
    const matchesOperation =
      !filters.operation || item.operation === filters.operation;
    const matchesLocation =
      !filters.location || item.location === filters.location;

    return matchesType && matchesOperation && matchesLocation;
  });
}

function filterRemates(
  items: CatalogListing[],
  filters: RematesFilters,
): CatalogListing[] {
  return items.filter((item) => {
    const matchesType =
      !filters.auctionType || item.auctionType === filters.auctionType;

    const matchesFrom =
      !filters.dateFrom ||
      (item.dateFrom != null && item.dateFrom >= filters.dateFrom);

    const matchesTo =
      !filters.dateTo ||
      (item.dateTo != null && item.dateTo <= filters.dateTo);

    return matchesType && matchesFrom && matchesTo;
  });
}

function filterListings(
  items: CatalogListing[],
  action: SearchAction,
): CatalogListing[] {
  const tab = action.mode === "all" ? action.tab : action.tab;
  const sectionItems = items.filter((item) => item.section === tab);

  if (action.mode === "all") {
    return sectionItems;
  }

  if (action.tab === "propiedades") {
    return filterPropiedades(sectionItems, action.filters);
  }

  if (action.tab === "bienes_muebles") {
    return filterBienesMuebles(
      sectionItems.map((item) => ({
        id: item.id,
        section: "bienes_muebles" as const,
        title: item.title,
        category: item.category,
        condition: item.condition,
      })),
      action.filters,
    )
      .map((filtered) => sectionItems.find((item) => item.id === filtered.id))
      .filter((item): item is CatalogListing => item != null);
  }

  return filterRemates(sectionItems, action.filters);
}

const catalogItemSelect = `
  id,
  categoria,
  titulo,
  descripcion,
  ubicacion,
  precio,
  estado,
  details,
  catalog_media (
    public_url,
    kind,
    sort_order
  )
`;

export async function fetchCatalogListings(
  action: SearchAction,
): Promise<CatalogListing[]> {
  if (!supabase) {
    return [];
  }

  const tab = action.mode === "all" ? action.tab : action.tab;

  const { data, error } = await supabase
    .from("catalog_items")
    .select(catalogItemSelect)
    .eq("published", true)
    .eq("categoria", tab)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const listings = (data as DbCatalogRow[]).map(mapRowToListing);
  return filterListings(listings, action);
}

export async function fetchCatalogListingById(
  id: string,
): Promise<CatalogListing | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("catalog_items")
    .select(catalogItemSelect)
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapRowToListing(data as DbCatalogRow);
}

function buildDetails(payload: PublishCatalogPayload): Record<string, string> {
  const moneda = { moneda: payload.common.moneda };

  if (payload.categoria === "propiedades" && payload.propiedad) {
    return {
      ...moneda,
      tipoPropiedad: payload.propiedad.tipoPropiedad,
      operacion: payload.propiedad.operacion,
      superficie: payload.propiedad.superficie,
      ambientes: payload.propiedad.ambientes,
      dormitorios: payload.propiedad.dormitorios,
      banos: payload.propiedad.banos,
    };
  }

  if (payload.categoria === "bienes_muebles" && payload.vehiculo) {
    return {
      ...moneda,
      tipoBien: payload.vehiculo.tipoBien,
      marcaModelo: payload.vehiculo.marcaModelo,
      anio: payload.vehiculo.anio,
      kilometraje: payload.vehiculo.kilometraje,
    };
  }

  if (payload.categoria === "remates" && payload.remate) {
    return {
      ...moneda,
      tipoSubasta: payload.remate.tipoSubasta,
      fecha: payload.remate.fecha,
      hora: payload.remate.hora,
      martillero: payload.remate.martillero,
    };
  }

  return moneda;
}

export async function publishCatalogItemToSupabase(
  payload: PublishCatalogPayload,
): Promise<void> {
  const client = requireSupabase();

  const {
    data: { session },
  } = await client.auth.getSession();

  if (!session) {
    throw new Error("Tenés que iniciar sesión en el panel admin para publicar.");
  }

  const details = buildDetails(payload);
  const estado =
    payload.categoria === "bienes_muebles"
      ? payload.vehiculo?.estado ?? null
      : null;

  const { data: createdItem, error: insertError } = await client
    .from("catalog_items")
    .insert({
      categoria: payload.categoria,
      titulo: payload.common.titulo.trim(),
      descripcion: payload.common.descripcion.trim(),
      ubicacion: payload.common.ubicacion.trim(),
      precio: payload.common.precio.trim(),
      estado,
      details,
      published: true,
    })
    .select("id")
    .single();

  if (insertError || !createdItem) {
    throw new Error(insertError?.message ?? "No se pudo crear la publicación.");
  }

  for (const [index, file] of payload.images.entries()) {
    const extension = file.name.includes(".")
      ? file.name.slice(file.name.lastIndexOf("."))
      : "";
    const storagePath = `${createdItem.id}/${crypto.randomUUID()}${extension}`;

    const { error: uploadError } = await client.storage
      .from("catalog-media")
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });

    if (uploadError) {
      throw new Error(`Error al subir ${file.name}: ${uploadError.message}`);
    }

    const { data: publicUrlData } = client.storage
      .from("catalog-media")
      .getPublicUrl(storagePath);

    const { error: mediaError } = await client.from("catalog_media").insert({
      catalog_item_id: createdItem.id,
      storage_path: storagePath,
      public_url: publicUrlData.publicUrl,
      kind: isVideoFile(file) ? "video" : "image",
      sort_order: index,
    });

    if (mediaError) {
      throw new Error(mediaError.message);
    }
  }
}
