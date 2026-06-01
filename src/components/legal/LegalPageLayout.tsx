import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../layout/Footer";
import { LEGAL_LAST_UPDATED } from "../../lib/legalSiteInfo";

type LegalPageLayoutProps = {
  title: string;
  children: ReactNode;
};

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="border-b border-slate-deep/5 bg-off-white/40">
          <div className="mx-auto max-w-3xl px-6 py-5 lg:px-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-azul-francia transition hover:text-navy"
            >
              <ArrowLeft className="size-4" strokeWidth={2} />
              Volver al inicio
            </Link>
          </div>
        </div>

        <article className="mx-auto max-w-3xl px-6 py-10 lg:px-10 lg:py-14">
          <header className="mb-10 border-b border-slate-deep/10 pb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-deep sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-muted">
              Última actualización: {LEGAL_LAST_UPDATED}
            </p>
          </header>

          <div className="legal-prose space-y-8">{children}</div>
        </article>
      </main>
      <Footer />
    </>
  );
}

type LegalSectionProps = {
  title: string;
  children: ReactNode;
};

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-navy">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-slate-deep/85 sm:text-base">
        {children}
      </div>
    </section>
  );
}
