import { useState } from "react";
import { ArrowLeft, Expand, MapPin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { CatalogListing } from "../../lib/catalog";
import {
  getCatalogDetailRows,
  getSectionLabel,
} from "../../lib/catalogDisplay";
import { getWhatsAppUrl } from "../../lib/contact";
import { CatalogMediaLightbox } from "./CatalogMediaLightbox";

type CatalogItemDetailProps = {
  item: CatalogListing;
};

export function CatalogItemDetail({ item }: CatalogItemDetailProps) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const detailRows = getCatalogDetailRows(item);
  const activeMedia = item.media[activeMediaIndex];
  const publicationUrl = `${window.location.origin}/catalogo/${item.id}`;
  const whatsappMessage = `¡Hola! Me interesa este artículo ${publicationUrl}. ¿Me podría pasar más información?`;

  function openLightbox(index = activeMediaIndex) {
    setActiveMediaIndex(index);
    setIsLightboxOpen(true);
  }

  return (
    <main className="safe-fab-padding min-h-screen bg-white">
      <CatalogMediaLightbox
        media={item.media}
        activeIndex={activeMediaIndex}
        title={item.title}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onActiveIndexChange={setActiveMediaIndex}
      />

      <div className="border-b border-slate-deep/5 bg-off-white/40">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 text-sm font-medium text-azul-francia transition hover:text-navy"
          >
            <ArrowLeft className="size-4" strokeWidth={2} />
            Volver al catálogo
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-10">
          <section aria-label="Galería de fotos y videos">
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-deep/10 bg-off-white/60">
              {activeMedia ? (
                activeMedia.kind === "video" ? (
                  <div className="relative">
                    <div className="aspect-[4/3] bg-black">
                      <video
                        src={activeMedia.url}
                        className="h-full w-full object-contain"
                        controls
                        playsInline
                        preload="metadata"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => openLightbox()}
                      className="absolute top-3 right-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-slate-deep shadow-lg transition hover:bg-white"
                    >
                      <Expand className="size-3.5" strokeWidth={2} />
                      Pantalla completa
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => openLightbox()}
                    className="group relative block w-full cursor-zoom-in text-left"
                    aria-label="Ampliar foto"
                  >
                    <div className="aspect-[4/3] bg-off-white">
                      <img
                        src={activeMedia.url}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-deep/0 transition duration-200 group-hover:bg-slate-deep/15">
                      <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-deep opacity-0 shadow-lg transition duration-200 group-hover:opacity-100">
                        <Expand className="size-4" strokeWidth={2} />
                        Ampliar
                      </span>
                    </span>
                  </button>
                )
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center text-sm font-medium text-muted">
                  Sin fotos
                </div>
              )}
            </div>

            {item.media.length > 0 && (
              <button
                type="button"
                onClick={() => openLightbox()}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-azul-francia transition hover:text-navy"
              >
                <Expand className="size-4" strokeWidth={2} />
                Ver fotos y videos en pantalla completa
              </button>
            )}

            {item.media.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5">
                {item.media.map((media, index) => (
                  <div key={`${media.url}-${index}`} className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveMediaIndex(index)}
                      className={`w-full overflow-hidden rounded-xl border bg-off-white/60 transition ${
                        index === activeMediaIndex
                          ? "border-azul-francia ring-2 ring-azul-francia/20"
                          : "border-slate-deep/10 hover:border-azul-francia/40"
                      }`}
                      aria-label={`Seleccionar archivo ${index + 1}`}
                      aria-pressed={index === activeMediaIndex}
                    >
                      <div className="aspect-square">
                        {media.kind === "video" ? (
                          <video
                            src={media.url}
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={media.url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => openLightbox(index)}
                      className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 text-slate-deep shadow-sm transition hover:bg-white"
                      aria-label={`Ampliar archivo ${index + 1}`}
                    >
                      <Expand className="size-3.5" strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div>
              <span className="inline-flex rounded-full bg-celeste/30 px-3 py-1 text-xs font-semibold tracking-wide text-navy uppercase">
                {getSectionLabel(item.section)}
              </span>

              <h1 className="mt-4 break-words text-2xl font-semibold tracking-tight text-slate-deep sm:text-3xl md:text-4xl">
                {item.title}
              </h1>

              <p className="mt-3 text-xl font-semibold text-azul-francia sm:text-2xl">
                {item.precio}
              </p>

              <p className="mt-3 inline-flex items-start gap-2 text-sm break-words text-muted">
                <MapPin className="mt-0.5 size-4 shrink-0 text-azul-francia" strokeWidth={2} />
                {item.ubicacion}
              </p>
            </div>

            {detailRows.length > 0 && (
              <div className="rounded-[1.25rem] border border-slate-deep/10 bg-off-white/50 p-5">
                <h2 className="text-sm font-semibold tracking-wide text-navy uppercase">
                  Características
                </h2>
                <dl className="mt-4 space-y-3">
                  {detailRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex flex-col gap-1 border-b border-slate-deep/5 pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                    >
                      <dt className="text-sm text-muted">{row.label}</dt>
                      <dd className="text-sm font-medium break-words text-slate-deep sm:text-right">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <a
              href={getWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-95"
            >
              <MessageCircle className="size-4" strokeWidth={2} />
              Consultar por WhatsApp
            </a>
          </aside>
        </div>

        <section className="mt-8 rounded-[1.25rem] border border-slate-deep/10 bg-white p-5 sm:mt-10 sm:rounded-[1.5rem] sm:p-8">
          <h2 className="text-lg font-semibold text-slate-deep">Descripción</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-deep/85 sm:text-base">
            {item.description}
          </p>
        </section>
      </div>
    </main>
  );
}
