import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../layout/Navbar";
import { HeroSearch } from "./HeroSearch";
import type { SearchAction, SearchTab } from "../../lib/searchTypes";

type HeroBackLink = {
  to: string;
  label: string;
};

type HeroSectionProps = {
  initialTab?: SearchTab;
  onExploreAll?: (tab: SearchTab) => void;
  onSearch?: (action: SearchAction) => void;
  onTabChange?: (tab: SearchTab) => void;
  showExploreAll?: boolean;
  backLink?: HeroBackLink;
};

export function HeroSection({
  initialTab,
  onExploreAll,
  onSearch,
  onTabChange,
  showExploreAll = true,
  backLink,
}: HeroSectionProps = {}) {
  return (
    <section
      id="inicio"
      className="hero-section hero-section--full relative overflow-hidden bg-white pb-10 sm:pb-12"
    >
      <div className="hero-bg-stack pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src="/images/hero-aerial.png"
          alt=""
          aria-hidden
          fetchPriority="high"
          decoding="async"
          className="hero-bg-photo absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-slate-deep/28" aria-hidden />

        <div className="hero-mesh absolute inset-0" aria-hidden />

        <div className="hero-overlay-top absolute inset-x-0 top-0 h-64" aria-hidden />
      </div>

      <Navbar />

      {backLink && (
        <Link
          to={backLink.to}
          className="absolute left-4 top-4 z-40 inline-flex items-center gap-2 rounded-full border border-white/30 bg-slate-deep/45 px-3.5 py-2 text-sm font-medium text-white shadow-[0_8px_24px_rgba(15,23,42,0.25)] backdrop-blur-md transition hover:bg-slate-deep/60 sm:left-6 sm:top-6 lg:left-10 lg:top-8"
        >
          <ArrowLeft className="size-4 shrink-0" strokeWidth={2} />
          {backLink.label}
        </Link>
      )}

      <div className="hero-content relative z-20 mx-auto max-w-4xl px-4 pb-6 pt-40 text-center sm:px-6 sm:pb-8 sm:pt-48 lg:px-10 lg:pb-10 lg:pt-60 xl:pt-64">
        <h1 className="hero-animate-in text-balance mx-auto max-w-3xl text-3xl leading-[1.08] font-semibold tracking-tight text-white drop-shadow-sm sm:text-4xl md:text-5xl lg:text-[3.25rem]">
          Tu próxima inversión, al alcance de un clic
        </h1>

        <p className="hero-animate-in hero-delay-1 mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/90 drop-shadow-sm sm:mt-6 sm:text-lg">
          Tu próximo hogar o tu mejor oportunidad de negocio. Catálogo
          inmobiliario y remates conducidos por el martillero Alberto
          Illanes Faciano.
        </p>

        <div className="hero-animate-in hero-delay-2">
          <HeroSearch
            initialTab={initialTab}
            onExploreAll={onExploreAll}
            onSearch={onSearch}
            onTabChange={onTabChange}
            showExploreAll={showExploreAll}
          />
        </div>
      </div>
    </section>
  );
}
