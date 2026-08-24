import { BarChart3, Eye, MapPin, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { buildCatalogDetailPath } from "../../lib/catalog";
import { getSectionLabel } from "../../lib/catalogDisplay";
import type { CatalogViewStats } from "../../lib/catalogViewStats";
import type { SearchTab } from "../../lib/searchTypes";

type AdminViewStatsProps = {
  stats: CatalogViewStats | null;
  isLoading: boolean;
  error: string;
};

function formatCount(value: number): string {
  return new Intl.NumberFormat("es-AR").format(value);
}

export function AdminViewStats({ stats, isLoading, error }: AdminViewStatsProps) {
  const maxProvinceViews = stats?.byProvince[0]?.viewCount ?? 0;

  return (
    <section className="admin-stats-panel">
      <div className="admin-stats-panel-header">
        <div className="admin-stats-panel-icon">
          <BarChart3 className="size-5 text-azul-francia" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-deep">
            Estadísticas de visitas
          </h2>
          <p className="mt-1 text-sm text-muted">
            Visualizaciones del catálogo y provincias de origen en Argentina.
          </p>
        </div>
      </div>

      {error && (
        <div className="admin-dashboard-alert mt-5" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="admin-stats-empty">Cargando estadísticas...</p>
      ) : !stats ||
        (stats.topPublications.length === 0 && stats.byProvince.length === 0) ? (
        <p className="admin-stats-empty">
          Todavía no hay visitas registradas. Aparecerán cuando alguien abra una
          publicación en el sitio.
        </p>
      ) : (
        <div className="admin-stats-grid">
          <div className="admin-stats-card">
            <div className="admin-stats-card-title">
              <TrendingUp className="size-4 text-azul-francia" strokeWidth={2} />
              Top 5 publicaciones más visitadas
            </div>

            {stats.topPublications.length === 0 ? (
              <p className="text-sm text-muted">Sin datos todavía.</p>
            ) : (
              <ol className="admin-stats-top-list">
                {stats.topPublications.map((item, index) => (
                  <li key={item.catalogItemId} className="admin-stats-top-item">
                    <span className="admin-stats-rank">{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={buildCatalogDetailPath(
                          item.categoria as SearchTab,
                          item.slug,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="line-clamp-1 text-sm font-semibold text-navy transition hover:text-azul-francia"
                      >
                        {item.title}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">
                        {getSectionLabel(item.categoria as SearchTab)}
                      </p>
                    </div>
                    <span className="admin-stats-count">
                      <Eye className="size-3.5" strokeWidth={2} />
                      {formatCount(item.viewCount)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="admin-stats-card">
            <div className="admin-stats-card-title">
              <MapPin className="size-4 text-azul-francia" strokeWidth={2} />
              Visitas por provincia (Argentina)
            </div>

            {stats.byProvince.length === 0 ? (
              <p className="text-sm text-muted">
                Aún no hay visitas con provincia detectada desde Argentina.
              </p>
            ) : (
              <ul className="admin-stats-province-list">
                {stats.byProvince.map((entry) => {
                  const width =
                    maxProvinceViews > 0
                      ? Math.max(8, (entry.viewCount / maxProvinceViews) * 100)
                      : 0;

                  return (
                    <li key={entry.province} className="admin-stats-province-item">
                      <div className="admin-stats-province-row">
                        <span className="line-clamp-1 text-sm font-medium text-slate-deep">
                          {entry.province}
                        </span>
                        <span className="text-sm font-semibold text-azul-francia">
                          {formatCount(entry.viewCount)}
                        </span>
                      </div>
                      <div className="admin-stats-province-bar-track">
                        <div
                          className="admin-stats-province-bar-fill"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
