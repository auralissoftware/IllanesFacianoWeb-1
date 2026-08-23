import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CatalogItemDetail } from "../components/sections/CatalogItemDetail";
import {
  buildCatalogDetailPath,
  categoriaFromSlugSegment,
} from "../lib/catalogSlug";
import {
  fetchCatalogListingBySlug,
  type CatalogListing,
} from "../lib/catalog";

export function CatalogDetailPage() {
  const { categoria: categoriaParam, slug } = useParams<{
    categoria: string;
    slug: string;
  }>();
  const [item, setItem] = useState<CatalogListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug || !categoriaParam) {
      setIsLoading(false);
      setError("Publicación no encontrada.");
      return;
    }

    const categoria = categoriaFromSlugSegment(categoriaParam);

    if (!categoria) {
      setIsLoading(false);
      setError("Publicación no encontrada.");
      return;
    }

    let cancelled = false;

    async function loadItem() {
      setIsLoading(true);
      setError("");

      try {
        const listing = await fetchCatalogListingBySlug(slug!, categoria!);

        if (!cancelled) {
          setItem(listing);
          if (!listing) {
            setError("Esta publicación no existe o ya no está disponible.");
          }
        }
      } catch (loadError) {
        if (!cancelled) {
          setItem(null);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No pudimos cargar la publicación.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadItem();

    return () => {
      cancelled = true;
    };
  }, [categoriaParam, slug]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <p className="text-sm font-medium text-muted">Cargando publicación...</p>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
        <p className="max-w-md rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error || "Publicación no encontrada."}
        </p>
        <Link
          to="/catalogo"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-azul-francia transition hover:text-navy"
        >
          <ArrowLeft className="size-4" strokeWidth={2} />
          Volver al catálogo
        </Link>
      </main>
    );
  }

  const canonicalPath = buildCatalogDetailPath(item.section, item.slug);

  if (categoriaParam && slug && canonicalPath !== `/catalogo/${categoriaParam}/${slug}`) {
    return <Navigate to={canonicalPath} replace />;
  }

  return <CatalogItemDetail item={item} />;
}
