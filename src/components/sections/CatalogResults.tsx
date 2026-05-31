import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCatalogListings, type CatalogListing } from "../../lib/catalog";
import type { SearchAction } from "../../lib/searchTypes";
import { CatalogEmptyState } from "./CatalogEmptyState";

type CatalogResultsProps = {
  action: SearchAction;
};

export function CatalogResults({ action }: CatalogResultsProps) {
  const tab = action.mode === "all" ? action.tab : action.tab;
  const [items, setItems] = useState<CatalogListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      setIsLoading(true);
      setError("");

      try {
        const listings = await fetchCatalogListings(action);

        if (!cancelled) {
          setItems(listings);
        }
      } catch (loadError) {
        if (!cancelled) {
          setItems([]);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No pudimos cargar el catálogo.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [action]);

  if (isLoading) {
    return (
      <div className="px-6 py-16 text-center text-sm font-medium text-muted sm:py-20">
        Cargando catálogo...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center sm:py-20">
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return <CatalogEmptyState tab={tab} />;
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
      {items.map((item) => {
        const cover = item.media[0];

        return (
          <Link
            key={item.id}
            to={`/catalogo/${item.id}`}
            className="group block overflow-hidden rounded-2xl border border-slate-deep/10 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-azul-francia/20 hover:shadow-md"
          >
            <div className="aspect-[4/3] bg-off-white/70">
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
            </div>

            <div className="space-y-2 p-5">
              <h3 className="text-lg font-semibold text-navy transition group-hover:text-azul-francia">
                {item.title}
              </h3>
              <p className="text-sm font-medium text-azul-francia">{item.precio}</p>
              <p className="text-sm text-muted">{item.ubicacion}</p>
              <p className="line-clamp-3 text-sm leading-relaxed text-slate-deep/80">
                {item.description}
              </p>
              <p className="pt-1 text-xs font-semibold text-azul-francia">
                Ver publicación →
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
