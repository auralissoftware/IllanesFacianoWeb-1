import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { CatalogListing } from "../../lib/catalogRepository";
import { getSectionLabel } from "../../lib/catalogDisplay";
import {
  adminCategorias,
  type AdminCategoria,
} from "../../types/adminCatalog";

type FilterTab = AdminCategoria | "all";

type AdminPublicationListProps = {
  items: CatalogListing[];
  isLoading: boolean;
  error: string;
  filterTab: FilterTab;
  deletingId: string | null;
  onFilterChange: (tab: FilterTab) => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: "all", label: "Todas" },
  ...adminCategorias.map(({ id, label }) => ({ id, label })),
];

export function AdminPublicationList({
  items,
  isLoading,
  error,
  filterTab,
  deletingId,
  onFilterChange,
  onAdd,
  onEdit,
  onDelete,
}: AdminPublicationListProps) {
  const filteredItems =
    filterTab === "all"
      ? items
      : items.filter((item) => item.section === filterTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-deep">
            Previsualización del catálogo
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Así ven tus clientes las publicaciones en el sitio. Podés agregar,
            modificar o eliminar activos desde acá.
          </p>
        </div>

        <button type="button" onClick={onAdd} className="btn-primary shrink-0 gap-2">
          <Plus className="size-4" strokeWidth={2} />
          Agregar publicación
        </button>
      </div>

      <div
        className="admin-preview-tabs"
        role="tablist"
        aria-label="Filtrar publicaciones"
      >
        {filterTabs.map(({ id, label }) => {
          const isActive = filterTab === id;

          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(id)}
              className={`admin-preview-tab ${
                isActive ? "admin-preview-tab-active" : "admin-preview-tab-inactive"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="admin-dashboard-alert" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="admin-preview-empty">Cargando publicaciones...</div>
      ) : filteredItems.length === 0 ? (
        <div className="admin-preview-empty">
          <p className="text-base font-medium text-navy">
            {filterTab === "all"
              ? "Todavía no hay publicaciones."
              : `No hay publicaciones en ${getSectionLabel(filterTab)}.`}
          </p>
          <p className="mt-2 text-sm text-muted">
            Usá el botón de arriba para cargar la primera.
          </p>
        </div>
      ) : (
        <div className="admin-preview-grid">
          {filteredItems.map((item) => {
            const cover = item.media[0];
            const isDeleting = deletingId === item.id;

            return (
              <article
                key={item.id}
                className="admin-preview-card group"
              >
                <div className="admin-preview-card-media">
                  {cover ? (
                    cover.kind === "video" ? (
                      <video
                        src={cover.url}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={cover.url}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-medium text-muted">
                      Sin fotos
                    </div>
                  )}

                  <span className="admin-preview-card-badge">
                    {getSectionLabel(item.section)}
                  </span>
                </div>

                <div className="admin-preview-card-body">
                  <h3 className="line-clamp-2 text-base font-semibold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-azul-francia">
                    {item.precio}
                  </p>
                  <p className="mt-1 text-sm text-muted">{item.ubicacion}</p>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-deep/80">
                    {item.description}
                  </p>
                </div>

                <div className="admin-preview-card-actions">
                  <Link
                    to={`/catalogo/${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-preview-action admin-preview-action-view"
                  >
                    <ExternalLink className="size-3.5" strokeWidth={2} />
                    Ver en sitio
                  </Link>

                  <button
                    type="button"
                    onClick={() => onEdit(item.id)}
                    className="admin-preview-action admin-preview-action-edit"
                  >
                    <Pencil className="size-3.5" strokeWidth={2} />
                    Modificar
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    disabled={isDeleting}
                    className="admin-preview-action admin-preview-action-delete"
                  >
                    <Trash2 className="size-3.5" strokeWidth={2} />
                    {isDeleting ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
