import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CatalogItemDetail } from "../components/sections/CatalogItemDetail";
import {
  fetchCatalogListingById,
  type CatalogListing,
} from "../lib/catalog";

export function CatalogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<CatalogListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setError("Publicación no encontrada.");
      return;
    }

    const listingId = id;
    let cancelled = false;

    async function loadItem() {
      setIsLoading(true);
      setError("");

      try {
        const listing = await fetchCatalogListingById(listingId);

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
  }, [id]);

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

  return <CatalogItemDetail item={item} />;
}
