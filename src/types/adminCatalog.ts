export type AdminCategoria = "propiedades" | "bienes_muebles" | "remates";

export type AdminEstadoVehiculo = "nuevo" | "usado" | "reacondicionado";

export type AdminMoneda = "ars" | "usd";

export type AdminCommonFields = {
  titulo: string;
  descripcion: string;
  ubicacion: string;
  precio: string;
  moneda: AdminMoneda;
};

export type AdminPropiedadFields = {
  tipoPropiedad: string;
  operacion: string;
  superficie: string;
  ambientes: string;
  dormitorios: string;
  banos: string;
};

export type AdminVehiculoFields = {
  tipoBien: string;
  marcaModelo: string;
  anio: string;
  kilometraje: string;
  estado: AdminEstadoVehiculo;
};

export type AdminRemateFields = {
  tipoSubasta: string;
  fecha: string;
  hora: string;
  martillero: string;
};

export type AdminMediaFile = {
  id: string;
  previewUrl: string;
  kind: "image" | "video";
  file?: File;
  storagePath?: string;
};

/** @deprecated Use AdminMediaFile */
export type AdminImageFile = AdminMediaFile;

export type PublishCatalogPayload = {
  categoria: AdminCategoria;
  common: AdminCommonFields;
  propiedad?: AdminPropiedadFields;
  vehiculo?: AdminVehiculoFields;
  remate?: AdminRemateFields;
  images: File[];
};

export type UpdateCatalogPayload = PublishCatalogPayload & {
  itemId: string;
  keptMediaIds: string[];
};

export type AdminEditCatalogItem = {
  id: string;
  categoria: AdminCategoria;
  common: AdminCommonFields;
  propiedad: AdminPropiedadFields;
  vehiculo: AdminVehiculoFields;
  remate: AdminRemateFields;
  media: AdminMediaFile[];
};

export const adminCategorias: {
  id: AdminCategoria;
  label: string;
  description: string;
}[] = [
  {
    id: "propiedades",
    label: "Propiedades",
    description: "Tipo, operación, superficie y ambientes.",
  },
  {
    id: "bienes_muebles",
    label: "Vehículos y Activos",
    description: "Los campos cambian según el tipo de bien que elijas.",
  },
  {
    id: "remates",
    label: "Remates",
    description: "Tipo de subasta, fecha, hora y martillero.",
  },
];

export const adminTiposPropiedad = [
  { value: "casas", label: "Casas" },
  { value: "departamentos", label: "Departamentos" },
  { value: "oficinas", label: "Oficinas" },
  { value: "lotes", label: "Lotes" },
  { value: "terrenos", label: "Terrenos" },
  { value: "cocheras", label: "Cocheras" },
  { value: "locales-comerciales", label: "Locales comerciales" },
  { value: "galpones-depositos", label: "Galpones y depósitos" },
  { value: "campos-quintas", label: "Campos y quintas" },
  { value: "otros", label: "Otros" },
] as const;

export const adminOperacionesPropiedad = [
  { value: "venta", label: "Venta" },
  { value: "alquiler", label: "Alquiler" },
] as const;

export const adminTiposBienMueble = [
  { value: "vehiculos", label: "Vehículos" },
  { value: "camionetas", label: "Camionetas" },
  { value: "maquinaria-pesada", label: "Maquinaria Pesada" },
  { value: "lotes-herramientas", label: "Lotes de Herramientas" },
  { value: "muebles-otros", label: "Muebles u otros" },
] as const;

export const adminEstadosVehiculo: {
  value: AdminEstadoVehiculo;
  label: string;
}[] = [
  { value: "nuevo", label: "Nuevo" },
  { value: "usado", label: "Usado" },
  { value: "reacondicionado", label: "Reacondicionado" },
];

export const adminTiposSubasta = [
  { value: "remates-judiciales", label: "Remates Judiciales" },
  { value: "subastas-particulares", label: "Subastas Particulares" },
] as const;

export const initialCommonFields: AdminCommonFields = {
  titulo: "",
  descripcion: "",
  ubicacion: "",
  precio: "",
  moneda: "ars",
};

export const adminMonedas: { value: AdminMoneda; label: string }[] = [
  { value: "ars", label: "Pesos" },
  { value: "usd", label: "Dólares" },
];

export function formatPrecioForDisplay(
  precio: string,
  moneda?: AdminMoneda | string,
): string {
  const value = precio.trim();
  if (!value) {
    return "";
  }

  if (/^(USD|US\$|\$|ARS)/i.test(value)) {
    return value;
  }

  return moneda === "usd" ? `USD ${value}` : `$ ${value}`;
}

export const initialPropiedadFields: AdminPropiedadFields = {
  tipoPropiedad: "casas",
  operacion: "venta",
  superficie: "",
  ambientes: "",
  dormitorios: "",
  banos: "",
};

export const initialVehiculoFields: AdminVehiculoFields = {
  tipoBien: "vehiculos",
  marcaModelo: "",
  anio: "",
  kilometraje: "",
  estado: "usado",
};

export const initialRemateFields: AdminRemateFields = {
  tipoSubasta: "remates-judiciales",
  fecha: "",
  hora: "",
  martillero: "Alberto Illanes Faciano",
};

export function getPrecioLabel(categoria: AdminCategoria): string {
  return categoria === "remates" ? "Base *" : "Precio *";
}

export function getPrecioPlaceholder(
  categoria: AdminCategoria,
  moneda: AdminMoneda = "ars",
): string {
  if (categoria === "remates") {
    return moneda === "usd" ? "Ej: 50.000" : "Ej: 5.000.000";
  }

  if (categoria === "bienes_muebles") {
    return moneda === "usd" ? "Ej: 15.000" : "Ej: 18.500.000";
  }

  return moneda === "usd" ? "Ej: 120.000" : "Ej: 85.000.000";
}

export type BienMuebleFieldId = "marcaModelo" | "anio" | "kilometraje" | "estado";

export type BienMuebleFieldConfig = {
  id: BienMuebleFieldId;
  label: string;
  placeholder: string;
  required: boolean;
};

const bienMuebleFieldPresets: Record<
  (typeof adminTiposBienMueble)[number]["value"],
  BienMuebleFieldConfig[]
> = {
  vehiculos: [
    {
      id: "marcaModelo",
      label: "Marca / Modelo",
      placeholder: "Ej: Toyota Corolla 1.8",
      required: true,
    },
    {
      id: "anio",
      label: "Año",
      placeholder: "Ej: 2021",
      required: true,
    },
    {
      id: "kilometraje",
      label: "Kilometraje",
      placeholder: "Ej: 45.000 km",
      required: true,
    },
    {
      id: "estado",
      label: "Estado",
      placeholder: "",
      required: true,
    },
  ],
  camionetas: [
    {
      id: "marcaModelo",
      label: "Marca / Modelo",
      placeholder: "Ej: Toyota Hilux 2.8 CD 4x4",
      required: true,
    },
    {
      id: "anio",
      label: "Año",
      placeholder: "Ej: 2021",
      required: true,
    },
    {
      id: "kilometraje",
      label: "Kilometraje",
      placeholder: "Ej: 45.000 km",
      required: true,
    },
    {
      id: "estado",
      label: "Estado",
      placeholder: "",
      required: true,
    },
  ],
  "maquinaria-pesada": [
    {
      id: "marcaModelo",
      label: "Marca / Modelo",
      placeholder: "Ej: Caterpillar 320D",
      required: false,
    },
    {
      id: "anio",
      label: "Año",
      placeholder: "Ej: 2018",
      required: false,
    },
    {
      id: "kilometraje",
      label: "Horas de uso / Kilometraje",
      placeholder: "Ej: 3.200 hs",
      required: false,
    },
    {
      id: "estado",
      label: "Estado",
      placeholder: "",
      required: true,
    },
  ],
  "lotes-herramientas": [
    {
      id: "estado",
      label: "Estado",
      placeholder: "",
      required: true,
    },
  ],
  "muebles-otros": [
    {
      id: "marcaModelo",
      label: "Referencia / Detalle",
      placeholder: "Ej: Juego de living, biblioteca",
      required: false,
    },
    {
      id: "estado",
      label: "Estado",
      placeholder: "",
      required: true,
    },
  ],
};

export function getBienMuebleFields(tipoBien: string): BienMuebleFieldConfig[] {
  const preset =
    bienMuebleFieldPresets[
      tipoBien as (typeof adminTiposBienMueble)[number]["value"]
    ];

  return preset ?? bienMuebleFieldPresets.vehiculos;
}

export function getBienMuebleFieldLabel(field: BienMuebleFieldConfig): string {
  if (field.id === "estado") {
    return field.required ? `${field.label} *` : field.label;
  }

  return field.required ? `${field.label} *` : `${field.label} (opcional)`;
}

export function getBienMuebleDescription(tipoBien: string): string {
  const descriptions: Record<string, string> = {
    vehiculos: "Para vehículos se piden marca, año, kilometraje y estado.",
    camionetas: "Para camionetas se piden marca, año, kilometraje y estado.",
    "maquinaria-pesada":
      "Para maquinaria, marca, año y uso son opcionales. El estado es obligatorio.",
    "lotes-herramientas":
      "Para lotes de herramientas solo se pide el estado del bien.",
    "muebles-otros":
      "Para muebles u otros, la referencia es opcional y el estado es obligatorio.",
  };

  return descriptions[tipoBien] ?? getBienMuebleDescription("vehiculos");
}

export function validateBienMuebleFields(
  vehiculo: AdminVehiculoFields,
): Partial<Record<BienMuebleFieldId, string>> {
  const errors: Partial<Record<BienMuebleFieldId, string>> = {};

  if (!vehiculo.tipoBien) {
    return { estado: "Elegí el tipo de bien." };
  }

  for (const field of getBienMuebleFields(vehiculo.tipoBien)) {
    if (!field.required) {
      continue;
    }

    const value = vehiculo[field.id];

    if (field.id === "estado") {
      if (!value) {
        errors.estado = "Elegí el estado.";
      }
      continue;
    }

    if (typeof value === "string" && !value.trim()) {
      errors[field.id] = `Completá ${field.label.toLowerCase()}.`;
    }
  }

  return errors;
}
