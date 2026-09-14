import type { AdminCategoria } from "../types/adminCatalog";

export type AdminDashboardFilterTab = AdminCategoria | "all";

const FILTER_VALUES: AdminDashboardFilterTab[] = [
  "all",
  "propiedades",
  "bienes_muebles",
  "remates",
];

export function isAdminDashboardFilterTab(value: string | null): value is AdminDashboardFilterTab {
  return value !== null && FILTER_VALUES.includes(value as AdminDashboardFilterTab);
}

export function adminDashboardPath(search: string): string {
  return search ? `/admin/dashboard?${search}` : "/admin/dashboard";
}

export function buildAdminDashboardSearch(params: {
  filtro?: AdminDashboardFilterTab;
  accion?: "nueva" | "editar";
  id?: string;
}): string {
  const sp = new URLSearchParams();

  if (params.filtro && params.filtro !== "all") {
    sp.set("filtro", params.filtro);
  }

  if (params.accion === "nueva") {
    sp.set("accion", "nueva");
  } else if (params.accion === "editar" && params.id) {
    sp.set("accion", "editar");
    sp.set("id", params.id);
  }

  return sp.toString();
}

export function parseAdminDashboardSearch(searchParams: URLSearchParams): {
  filtro: AdminDashboardFilterTab;
  accion: "nueva" | "editar" | null;
  editId: string | null;
} {
  const filtroRaw = searchParams.get("filtro");
  const accionRaw = searchParams.get("accion");
  const editId = searchParams.get("id");

  return {
    filtro: isAdminDashboardFilterTab(filtroRaw) ? filtroRaw : "all",
    accion:
      accionRaw === "nueva"
        ? "nueva"
        : accionRaw === "editar" && editId
          ? "editar"
          : null,
    editId: accionRaw === "editar" && editId ? editId : null,
  };
}
