import {
  adminEstadosVehiculo,
  adminOperacionesPropiedad,
  adminTiposBienMueble,
  adminTiposPropiedad,
  adminTiposSubasta,
} from "../types/adminCatalog";
import type { CatalogListing } from "./catalogRepository";
import type { SearchTab } from "./searchTypes";

export type CatalogDetailRow = {
  label: string;
  value: string;
};

function findLabel(
  options: readonly { value: string; label: string }[],
  value?: string,
): string {
  if (!value) {
    return "";
  }

  return options.find((option) => option.value === value)?.label ?? value;
}

function formatDate(value: string): string {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

export function getSectionLabel(section: SearchTab): string {
  if (section === "propiedades") {
    return "Propiedad";
  }

  if (section === "bienes_muebles") {
    return "Vehículo o activo";
  }

  return "Remate";
}

export function getCatalogDetailRows(item: CatalogListing): CatalogDetailRow[] {
  const details = item.details ?? {};
  const rows: CatalogDetailRow[] = [];

  if (item.section === "propiedades") {
    const tipo = findLabel(adminTiposPropiedad, details.tipoPropiedad);
    const operacion = findLabel(adminOperacionesPropiedad, details.operacion);

    if (tipo) rows.push({ label: "Tipo", value: tipo });
    if (operacion) rows.push({ label: "Operación", value: operacion });
    if (details.superficie) rows.push({ label: "Superficie", value: `${details.superficie} m²` });
    if (details.ambientes) rows.push({ label: "Ambientes", value: details.ambientes });
    if (details.dormitorios) rows.push({ label: "Dormitorios", value: details.dormitorios });
    if (details.banos) rows.push({ label: "Baños", value: details.banos });
  }

  if (item.section === "bienes_muebles") {
    const tipo = findLabel(adminTiposBienMueble, details.tipoBien);
    const estado = findLabel(adminEstadosVehiculo, item.condition);

    if (tipo) rows.push({ label: "Tipo de bien", value: tipo });
    if (details.marcaModelo) rows.push({ label: "Marca / Modelo", value: details.marcaModelo });
    if (details.anio) rows.push({ label: "Año", value: details.anio });
    if (details.kilometraje) rows.push({ label: "Kilometraje", value: `${details.kilometraje} km` });
    if (estado) rows.push({ label: "Estado", value: estado });
  }

  if (item.section === "remates") {
    const tipo = findLabel(adminTiposSubasta, details.tipoSubasta);

    if (tipo) rows.push({ label: "Tipo de subasta", value: tipo });
    if (details.fecha) rows.push({ label: "Fecha", value: formatDate(details.fecha) });
    if (details.hora) rows.push({ label: "Hora", value: details.hora });
    if (details.martillero) rows.push({ label: "Martillero", value: details.martillero });
  }

  return rows;
}
