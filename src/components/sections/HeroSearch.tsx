import {
  ArrowRight,
  Building2,
  Calendar,
  Car,
  ChevronDown,
  Gavel,
  MapPin,
  Tag,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  BIEN_MUEBLE_MUEBLES_OTROS,
  getBienMuebleSearchLabel,
  type BienesMueblesFilters,
} from "../../lib/searchFilters";
import type {
  PropiedadesFilters,
  RematesFilters,
  SearchAction,
  SearchTab,
} from "../../lib/searchTypes";
import { adminTiposPropiedad } from "../../types/adminCatalog";

const tabs: { id: SearchTab; label: string; shortLabel: string }[] = [
  { id: "propiedades", label: "Propiedades", shortLabel: "Propiedades" },
  { id: "bienes_muebles", label: "Vehículos y Activos", shortLabel: "Vehículos" },
  { id: "remates", label: "Próximos Remates", shortLabel: "Remates" },
];

const propertyTypes = [
  { value: "", label: "¿Qué buscás?" },
  ...adminTiposPropiedad,
] as const;

const operations = [
  { value: "", label: "Operación" },
  { value: "venta", label: "Venta" },
  { value: "alquiler", label: "Alquiler" },
] as const;

const locations = [
  { value: "", label: "Ubicación" },
  { value: "yerba-buena", label: "Yerba Buena" },
  { value: "san-miguel", label: "San Miguel" },
  { value: "barrio-norte", label: "Barrio Norte" },
] as const;

const assetTypes = [
  { value: "", label: "Tipo de Bien Mueble" },
  { value: "vehiculos", label: "Vehículos" },
  { value: "camionetas", label: "Camionetas" },
  { value: "maquinaria-pesada", label: "Maquinaria Pesada" },
  { value: "lotes-herramientas", label: "Lotes de Herramientas" },
  {
    value: BIEN_MUEBLE_MUEBLES_OTROS,
    label: "Muebles u otros",
  },
] as const;

const assetConditions = [
  { value: "", label: "Estado" },
  { value: "nuevo", label: "Nuevo" },
  { value: "usado", label: "Usado" },
  { value: "reacondicionado", label: "Reacondicionado" },
] as const;

const auctionTypes = [
  { value: "", label: "Tipo de Subasta" },
  { value: "remates-judiciales", label: "Remates Judiciales" },
  { value: "subastas-particulares", label: "Subastas Particulares" },
] as const;

const emptyRemates: RematesFilters = {
  auctionType: "",
  dateFrom: "",
  dateTo: "",
};

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDateLabel(iso: string) {
  if (!iso) return "";

  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${iso}T12:00:00`));
}

function getDateRangeLabel(dateFrom: string, dateTo: string) {
  if (dateFrom && dateTo) {
    return `${formatDateLabel(dateFrom)} – ${formatDateLabel(dateTo)}`;
  }

  if (dateFrom) return `Desde ${formatDateLabel(dateFrom)}`;
  if (dateTo) return `Hasta ${formatDateLabel(dateTo)}`;

  return "Fecha";
}

const emptyPropiedades: PropiedadesFilters = {
  propertyType: "",
  operation: "",
  location: "",
};

const emptyBienesMuebles: BienesMueblesFilters = {
  assetType: "",
  condition: "",
};

function clampMenuRect(
  triggerRect: DOMRect,
  options: { minWidth?: number; maxWidth?: number } = {},
) {
  const viewportPadding = 12;
  const viewportWidth = window.innerWidth;
  const maxWidth =
    options.maxWidth ?? Math.min(360, viewportWidth - viewportPadding * 2);
  const minWidth = Math.min(
    options.minWidth ?? triggerRect.width,
    maxWidth,
  );
  const width = Math.min(Math.max(triggerRect.width, minWidth), maxWidth);
  const left = Math.max(
    viewportPadding,
    Math.min(triggerRect.left, viewportWidth - width - viewportPadding),
  );

  return {
    top: triggerRect.bottom + 6,
    left,
    width,
  };
}

type SearchDropdownProps = {
  id: string;
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
};

type SearchDateRangeProps = {
  dateFrom: string;
  dateTo: string;
  onChange: (dateFrom: string, dateTo: string) => void;
};

function SearchDateRange({
  dateFrom,
  dateTo,
  onChange,
}: SearchDateRangeProps) {
  const [open, setOpen] = useState(false);
  const [menuRect, setMenuRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const displayLabel = getDateRangeLabel(dateFrom, dateTo);
  const isPlaceholder = !dateFrom && !dateTo;

  function updateMenuRect() {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportPadding = 24;
    setMenuRect(
      clampMenuRect(rect, {
        minWidth: Math.min(300, window.innerWidth - viewportPadding),
      }),
    );
  }

  function applyPreset(preset: "este-mes" | "proximas-semanas") {
    const now = new Date();

    if (preset === "este-mes") {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      onChange(toIsoDate(from), toIsoDate(to));
      return;
    }

    const from = new Date(now);
    const to = new Date(now);
    to.setDate(to.getDate() + 14);
    onChange(toIsoDate(from), toIsoDate(to));
  }

  function handleFromChange(value: string) {
    const nextTo = dateTo && value && dateTo < value ? value : dateTo;
    onChange(value, nextTo);
  }

  function handleToChange(value: string) {
    const nextFrom = dateFrom && value && value < dateFrom ? value : dateFrom;
    onChange(nextFrom, value);
  }

  useEffect(() => {
    if (!open) {
      setMenuRect(null);
      return;
    }

    updateMenuRect();

    window.addEventListener("scroll", updateMenuRect, true);
    window.addEventListener("resize", updateMenuRect);

    return () => {
      window.removeEventListener("scroll", updateMenuRect, true);
      window.removeEventListener("resize", updateMenuRect);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (
        !rootRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <>
      <div
        ref={rootRef}
        className={`search-field group ${open ? "search-field-open" : ""}`}
      >
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-label="Rango de fechas"
          onClick={() => setOpen((current) => !current)}
          className="flex w-full items-center gap-2.5 text-left"
        >
          <Calendar
            className="size-4 shrink-0 text-slate-400 transition-colors group-hover:text-azul-francia/80"
            strokeWidth={1.5}
            aria-hidden
          />

          <span
            className={`min-w-0 flex-1 truncate text-sm ${
              isPlaceholder ? "text-slate-400" : "font-medium text-slate-deep"
            }`}
          >
            {displayLabel}
          </span>

          <ChevronDown
            className={`size-4 shrink-0 text-slate-400 transition-transform duration-200 ${
              open ? "rotate-180 text-azul-francia" : ""
            }`}
            strokeWidth={1.75}
            aria-hidden
          />
        </button>
      </div>

      {open &&
        menuRect &&
        createPortal(
          <div
            ref={panelRef}
            className="search-date-panel"
            style={{
              top: menuRect.top,
              left: menuRect.left,
              width: menuRect.width,
            }}
          >
            <p className="search-date-panel-title">Atajos rápidos</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset("este-mes")}
                className="search-date-preset"
              >
                Este mes
              </button>
              <button
                type="button"
                onClick={() => applyPreset("proximas-semanas")}
                className="search-date-preset"
              >
                Próximas semanas
              </button>
            </div>

            <div className="my-3 h-px bg-slate-200/80" />

            <p className="search-date-panel-title">Rango exacto</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="search-date-input-wrap">
                <span className="search-date-input-label">Desde</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => handleFromChange(e.target.value)}
                  className="search-date-input"
                />
              </label>
              <label className="search-date-input-wrap">
                <span className="search-date-input-label">Hasta</span>
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(e) => handleToChange(e.target.value)}
                  className="search-date-input"
                />
              </label>
            </div>

            {(dateFrom || dateTo) && (
              <button
                type="button"
                onClick={() => onChange("", "")}
                className="search-date-clear"
              >
                Limpiar fechas
              </button>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}

function SearchDropdown({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  options,
}: SearchDropdownProps) {
  const [open, setOpen] = useState(false);
  const [menuRect, setMenuRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const placeholder =
    options.find((option) => option.value === "")?.label ?? label;
  const selectedOption = options.find((option) => option.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;
  const isPlaceholder = !value;
  const menuOptions = options.filter((option) => option.value !== "");

  function updateMenuRect() {
    if (!triggerRef.current) return;

    setMenuRect(clampMenuRect(triggerRef.current.getBoundingClientRect()));
  }

  useEffect(() => {
    if (!open) {
      setMenuRect(null);
      return;
    }

    updateMenuRect();

    window.addEventListener("scroll", updateMenuRect, true);
    window.addEventListener("resize", updateMenuRect);

    return () => {
      window.removeEventListener("scroll", updateMenuRect, true);
      window.removeEventListener("resize", updateMenuRect);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (
        !rootRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <>
      <div
        ref={rootRef}
        className={`search-field group ${open ? "search-field-open" : ""}`}
      >
        <button
          ref={triggerRef}
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={label}
          onClick={() => setOpen((current) => !current)}
          className="flex w-full items-center gap-2.5 text-left"
        >
          <Icon
            className="size-4 shrink-0 text-slate-400 transition-colors group-hover:text-azul-francia/80"
            strokeWidth={1.5}
            aria-hidden
          />

          <span
            className={`min-w-0 flex-1 truncate text-sm ${
              isPlaceholder ? "text-slate-400" : "font-medium text-slate-deep"
            }`}
          >
            {displayLabel}
          </span>

          <ChevronDown
            className={`size-4 shrink-0 text-slate-400 transition-transform duration-200 ${
              open ? "rotate-180 text-azul-francia" : ""
            }`}
            strokeWidth={1.75}
            aria-hidden
          />
        </button>
      </div>

      {open &&
        menuRect &&
        createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            aria-label={label}
            className="search-dropdown-panel"
            style={{
              top: menuRect.top,
              left: menuRect.left,
              width: menuRect.width,
            }}
          >
            {menuOptions.map((option) => {
              const isSelected = value === option.value;

              return (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`search-dropdown-option ${
                      isSelected ? "search-dropdown-option-active" : ""
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </>
  );
}

type TabPanelProps = {
  active: boolean;
  columns: 2 | 3;
  children: ReactNode;
};

function TabPanel({ active, columns, children }: TabPanelProps) {
  return (
    <div
      className={`grid flex-1 gap-2 transition-opacity duration-300 ease-out ${
        columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
      } ${
        active
          ? "visible relative opacity-100"
          : "invisible absolute inset-x-0 top-0 opacity-0"
      }`}
      aria-hidden={!active}
    >
      {children}
    </div>
  );
}

type HeroSearchProps = {
  initialTab?: SearchTab;
  onExploreAll?: (tab: SearchTab) => void;
  onSearch?: (action: SearchAction) => void;
  onTabChange?: (tab: SearchTab) => void;
};

export function HeroSearch({
  initialTab = "propiedades",
  onExploreAll,
  onSearch,
  onTabChange,
}: HeroSearchProps = {}) {
  const [activeTab, setActiveTab] = useState<SearchTab>(initialTab);
  const [propiedades, setPropiedades] =
    useState<PropiedadesFilters>(emptyPropiedades);
  const [bienesMuebles, setBienesMuebles] =
    useState<BienesMueblesFilters>(emptyBienesMuebles);
  const [remates, setRemates] = useState<RematesFilters>(emptyRemates);
  const [lastAction, setLastAction] = useState<SearchAction | null>(null);
  const isControlled = Boolean(onExploreAll || onSearch);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  function clearAllFilters() {
    setPropiedades(emptyPropiedades);
    setBienesMuebles(emptyBienesMuebles);
    setRemates(emptyRemates);
  }

  function handleExploreAll() {
    clearAllFilters();

    if (onExploreAll) {
      onExploreAll(activeTab);
      return;
    }

    setLastAction({ mode: "all", tab: activeTab });
  }

  function handleSearch() {
    let action: SearchAction;

    if (activeTab === "propiedades") {
      action = {
        mode: "filtered",
        tab: "propiedades",
        filters: propiedades,
      };
    } else if (activeTab === "bienes_muebles") {
      action = {
        mode: "filtered",
        tab: "bienes_muebles",
        filters: bienesMuebles,
      };
    } else {
      action = {
        mode: "filtered",
        tab: "remates",
        filters: remates,
      };
    }

    if (onSearch) {
      onSearch(action);
      return;
    }

    setLastAction(action);
  }

  function switchTab(tab: SearchTab) {
    setActiveTab(tab);
    setLastAction(null);
    onTabChange?.(tab);
  }

  const feedbackMessages: Record<SearchTab, string> = {
    propiedades: "Mostrando catálogo completo sin filtros.",
    bienes_muebles: "Mostrando catálogo completo sin filtros.",
    remates: "Mostrando catálogo completo sin filtros.",
  };

  const filteredFeedbackMessages: Record<SearchTab, string> = {
    propiedades: "Buscando propiedades con los filtros seleccionados.",
    bienes_muebles: getBienMuebleSearchLabel(bienesMuebles.assetType),
    remates: "Buscando próximos remates con los filtros seleccionados.",
  };

  return (
    <div className="mx-auto mt-6 w-full max-w-4xl sm:mt-8">
      <div
        className="search-tabs mb-4 sm:mb-5"
        role="tablist"
        aria-label="Tipo de búsqueda"
      >
        {tabs.map(({ id, label, shortLabel }) => {
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => switchTab(id)}
              className={`search-tab ${isActive ? "search-tab-active" : "search-tab-inactive"}`}
            >
              <span className="sm:hidden">{shortLabel}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="search-shell relative overflow-visible">
        <div
          className="search-shell-glow absolute -inset-px rounded-[1.35rem] opacity-80"
          aria-hidden
        />

        <div className="search-glass-panel relative overflow-visible rounded-[1.25rem] p-3 sm:p-4">
          <div className="relative flex flex-col gap-2 sm:flex-row sm:items-start">
            <TabPanel active={activeTab === "propiedades"} columns={3}>
              <SearchDropdown
                id="property-type"
                label="¿Qué buscás?"
                icon={Building2}
                value={propiedades.propertyType}
                onChange={(value) =>
                  setPropiedades((current) => ({
                    ...current,
                    propertyType: value,
                  }))
                }
                options={propertyTypes}
              />
              <SearchDropdown
                id="operation"
                label="Operación"
                icon={Tag}
                value={propiedades.operation}
                onChange={(value) =>
                  setPropiedades((current) => ({
                    ...current,
                    operation: value,
                  }))
                }
                options={operations}
              />
              <SearchDropdown
                id="location"
                label="Ubicación"
                icon={MapPin}
                value={propiedades.location}
                onChange={(value) =>
                  setPropiedades((current) => ({
                    ...current,
                    location: value,
                  }))
                }
                options={locations}
              />
            </TabPanel>

            <TabPanel active={activeTab === "bienes_muebles"} columns={2}>
              <SearchDropdown
                id="asset-type"
                label="Tipo de Bien Mueble"
                icon={Car}
                value={bienesMuebles.assetType}
                onChange={(value) =>
                  setBienesMuebles((current) => ({
                    ...current,
                    assetType: value,
                  }))
                }
                options={assetTypes}
              />
              <SearchDropdown
                id="asset-condition"
                label="Estado"
                icon={Truck}
                value={bienesMuebles.condition}
                onChange={(value) =>
                  setBienesMuebles((current) => ({
                    ...current,
                    condition: value,
                  }))
                }
                options={assetConditions}
              />
            </TabPanel>

            <TabPanel active={activeTab === "remates"} columns={2}>
              <SearchDropdown
                id="auction-type"
                label="Tipo de Subasta"
                icon={Gavel}
                value={remates.auctionType}
                onChange={(value) =>
                  setRemates((current) => ({
                    ...current,
                    auctionType: value,
                  }))
                }
                options={auctionTypes}
              />
              <SearchDateRange
                dateFrom={remates.dateFrom}
                dateTo={remates.dateTo}
                onChange={(dateFrom, dateTo) =>
                  setRemates((current) => ({
                    ...current,
                    dateFrom,
                    dateTo,
                  }))
                }
              />
            </TabPanel>

            <button
              type="button"
              onClick={handleSearch}
              className="btn-primary group w-full shrink-0 gap-2 sm:w-auto sm:px-7"
            >
              Ver Oportunidades
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleExploreAll}
        className="search-explore-btn mx-auto mt-4"
      >
        ✨ Explorar catálogo completo sin filtros
      </button>

      {!isControlled && lastAction && (
        <p className="mt-4 text-center text-xs font-medium text-slate-deep/70" aria-live="polite">
          {lastAction.mode === "all"
            ? feedbackMessages[lastAction.tab]
            : filteredFeedbackMessages[lastAction.tab]}
        </p>
      )}
    </div>
  );
}

export type {
  SearchAction,
  PropiedadesFilters,
  RematesFilters,
  SearchTab,
} from "../../lib/searchTypes";

export type { BienesMueblesFilters } from "../../lib/searchFilters";
