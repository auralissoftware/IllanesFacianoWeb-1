import { useEffect, useState } from "react";
import { Clock, Eye, Loader2, MapPin, X } from "lucide-react";
import {
  fetchCatalogItemViewDetails,
  type CatalogItemViewDetails,
} from "../../lib/catalogViewStats";
import {
  countryCodeToFlag,
  formatCountryLabel,
  formatRelativeTimeEs,
} from "../../lib/geoDisplay";

type AdminPublicationViewsModalProps = {
  itemId: string;
  itemTitle: string;
  fallbackTotal: number;
  onClose: () => void;
};

function formatCount(value: number): string {
  return value.toLocaleString("es-AR");
}

export function AdminPublicationViewsModal({
  itemId,
  itemTitle,
  fallbackTotal,
  onClose,
}: AdminPublicationViewsModalProps) {
  const [details, setDetails] = useState<CatalogItemViewDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDetails() {
      setIsLoading(true);
      setError("");

      try {
        const data = await fetchCatalogItemViewDetails(itemId);

        if (!cancelled) {
          setDetails(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setDetails(null);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No pudimos cargar el detalle de visitas.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [itemId]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const total = details?.total ?? fallbackTotal;

  return (
    <div
      className="admin-views-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="admin-views-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-views-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-views-modal-header">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">
              Visualizaciones
            </p>
            <h2
              id="admin-views-modal-title"
              className="mt-1 line-clamp-2 text-lg font-semibold text-slate-deep"
            >
              {itemTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="admin-views-modal-close"
            aria-label="Cerrar"
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>

        <div className="admin-views-modal-total">
          <Eye className="size-4 text-azul-francia" strokeWidth={2} />
          <span className="text-sm font-medium text-slate-deep">Total</span>
          <span className="admin-views-modal-total-value">
            {isLoading ? "..." : formatCount(total)}
          </span>
        </div>

        {error && (
          <div className="admin-dashboard-alert mt-4" role="alert">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="admin-views-modal-loading">
            <Loader2 className="size-5 animate-spin text-azul-francia" strokeWidth={2} />
            <span className="text-sm text-muted">Cargando desglose...</span>
          </div>
        ) : total === 0 ? (
          <p className="admin-views-modal-empty">Sin visualizaciones aún.</p>
        ) : (
          <div className="admin-views-modal-body">
            <section>
              <h3 className="admin-views-modal-section-title">
                <MapPin className="size-4" strokeWidth={2} />
                Origen geográfico
              </h3>

              {(details?.byCountry.length ?? 0) === 0 ? (
                <p className="text-sm text-muted">
                  Hay visitas registradas, pero sin datos geográficos detectados.
                </p>
              ) : (
                <ul className="admin-views-modal-country-list">
                  {details?.byCountry.map((country) => (
                    <li
                      key={`${country.countryCode}-${country.countryName}`}
                      className="admin-views-modal-country"
                    >
                      <div className="admin-views-modal-country-row">
                        <span className="font-medium text-slate-deep">
                          {countryCodeToFlag(country.countryCode)}{" "}
                          {formatCountryLabel(country.countryCode, country.countryName)}
                        </span>
                        <span className="font-semibold text-azul-francia">
                          {formatCount(country.viewCount)}
                        </span>
                      </div>
                      <ul className="admin-views-modal-region-list">
                        {country.regions.map((region) => (
                          <li
                            key={`${country.countryCode}-${region.region}`}
                            className="admin-views-modal-region-row"
                          >
                            <span className="line-clamp-1">{region.region}</span>
                            <span>{formatCount(region.viewCount)}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3 className="admin-views-modal-section-title">
                <Clock className="size-4" strokeWidth={2} />
                Últimas visitas
              </h3>

              {(details?.recent.length ?? 0) === 0 ? (
                <p className="text-sm text-muted">No hay registros recientes.</p>
              ) : (
                <ul className="admin-views-modal-recent-list">
                  {details?.recent.map((entry, index) => (
                    <li
                      key={`${entry.viewedAt}-${index}`}
                      className="admin-views-modal-recent-row"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-deep">
                          {countryCodeToFlag(entry.countryCode)}{" "}
                          {formatCountryLabel(entry.countryCode, entry.countryName)}
                          {entry.region !== "Sin región" && ` · ${entry.region}`}
                          {entry.city ? ` · ${entry.city}` : ""}
                        </p>
                        <p className="text-xs text-muted">
                          {formatRelativeTimeEs(entry.viewedAt)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
