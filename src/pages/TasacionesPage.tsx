import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Footer } from "../components/layout/Footer";
import { Reveal } from "../components/ui/Reveal";
import { LEGAL_OWNER_NAME, LEGAL_PROFESSION } from "../lib/legalSiteInfo";

export function TasacionesPage() {
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
            <span className="section-badge">Tasaciones en Tucumán</span>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-deep sm:text-3xl md:text-4xl">
              Tasaciones de inmuebles y peritajes oficiales
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-deep/85">
              {LEGAL_OWNER_NAME}, {LEGAL_PROFESSION}, realiza tasaciones
              comerciales, peritajes judiciales y valuaciones para operaciones
              inmobiliarias en Tucumán y el NOA, con respaldo matriculado y
              documentación clara para bancos, juzgados y particulares.
            </p>
          </Reveal>

          <Reveal className="mt-10 space-y-4" delay={120} variant="up">
            <div className="surface-card p-6">
              <h2 className="text-lg font-semibold text-navy">Servicios</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-deep/85 sm:text-base">
                <li>Tasación comercial de viviendas, locales y terrenos.</li>
                <li>Peritajes para sucesiones, divorcios y litigios.</li>
                <li>Informes para créditos hipotecarios y garantías.</li>
                <li>Asesoramiento previo a la venta o compra.</li>
              </ul>
            </div>

            <p className="text-sm leading-relaxed text-muted">
              Consultá también el{" "}
              <Link to="/catalogo" className="font-medium text-azul-francia hover:text-navy">
                catálogo de propiedades
              </Link>{" "}
              o escribinos desde la sección de contacto en la página principal.
            </p>
          </Reveal>
        </article>
      </main>
      <Footer />
    </>
  );
}
