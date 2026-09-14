import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Footer } from "../components/layout/Footer";
import { Reveal } from "../components/ui/Reveal";
import { LEGAL_OWNER_NAME, LEGAL_PROFESSION } from "../lib/legalSiteInfo";

export function RematesPage() {
  return (
    <>
      <main className="safe-fab-padding min-h-screen bg-white">
        <div className="border-b border-slate-deep/5 bg-off-white/40">
          <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-azul-francia transition hover:text-navy"
            >
              <ArrowLeft className="size-4" strokeWidth={2} />
              Volver al inicio
            </Link>
          </div>
        </div>

        <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
          <Reveal variant="up">
            <span className="section-badge">Remates judiciales y privados</span>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-deep sm:text-3xl md:text-4xl">
              Remates inmobiliarios y subastas en Tucumán
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-deep/85">
              {LEGAL_OWNER_NAME}, {LEGAL_PROFESSION}, conduce remates judiciales
              y subastas privadas con transparencia, difusión en catálogo web y
              acompañamiento legal en cada etapa del proceso.
            </p>
          </Reveal>

          <Reveal className="mt-10 space-y-4" delay={120} variant="up">
            <div className="surface-card p-6">
              <h2 className="text-lg font-semibold text-navy">Qué encontrás</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-deep/85 sm:text-base">
                <li>Próximos remates publicados en el catálogo online.</li>
                <li>Bases, fechas y condiciones de cada subasta.</li>
                <li>Propiedades, vehículos y bienes muebles en venta.</li>
                <li>Atención directa con el martillero a cargo.</li>
              </ul>
            </div>

            <p className="text-sm leading-relaxed text-muted">
              Ver{" "}
              <Link
                to="/catalogo"
                state={{ action: { mode: "all", tab: "remates" } }}
                className="font-medium text-azul-francia hover:text-navy"
              >
                remates en el catálogo
              </Link>
              .
            </p>
          </Reveal>
        </article>
      </main>
      <Footer />
    </>
  );
}
