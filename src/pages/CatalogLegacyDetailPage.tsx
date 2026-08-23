import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { buildCatalogDetailPath, isUuid } from "../lib/catalogSlug";
import { fetchCatalogListingById } from "../lib/catalog";

export function CatalogLegacyDetailPage() {
  const { legacyId } = useParams<{ legacyId: string }>();
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!legacyId) {
      setIsLoading(false);
      setError("Publicación no encontrada.");
      return;
    }

    if (!isUuid(legacyId)) {
      setIsLoading(false);
      setError("Publicación no encontrada.");
      return;
    }

    let cancelled = false;

    async function loadItem() {
      setIsLoading(true);
      setError("");

      try {
        const listing = await fetchCatalogListingById(legacyId!);

        if (!cancelled) {
          if (listing) {
            setRedirectTo(buildCatalogDetailPath(listing.section, listing.slug));
          } else {
            setError("Esta publicación no existe o ya no está disponible.");
          }
        }
      } catch (loadError) {
        if (!cancelled) {
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
  }, [legacyId]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <p className="text-sm font-medium text-muted">Cargando publicación...</p>
      </main>
    );
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

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
