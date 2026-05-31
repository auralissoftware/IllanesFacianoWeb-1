import { Navbar } from "../layout/Navbar";
import { HeroSearch } from "./HeroSearch";
import type { SearchAction, SearchTab } from "../../lib/searchTypes";

type HeroSectionProps = {
  initialTab?: SearchTab;
  onExploreAll?: (tab: SearchTab) => void;
  onSearch?: (action: SearchAction) => void;
  onTabChange?: (tab: SearchTab) => void;
  compact?: boolean;
};

export function HeroSection({
  initialTab,
  onExploreAll,
  onSearch,
  onTabChange,
  compact = false,
}: HeroSectionProps = {}) {
  return (
    <section
      id="inicio"
      className={`relative overflow-x-hidden bg-white ${compact ? "pb-6 sm:pb-8" : "pb-10 sm:pb-12"}`}
    >
      <div className="hero-bg-stack absolute inset-0">
        <img
          src="/images/hero-aerial.png"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-slate-deep/35" aria-hidden />

        <div className="hero-mesh absolute inset-0" aria-hidden />

        <div className="hero-overlay-top absolute inset-x-0 top-0 h-64" aria-hidden />
      </div>

      <div className="hero-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 z-[1]" aria-hidden />

      <Navbar />

      <div
        className={`relative z-10 mx-auto max-w-4xl px-6 pt-60 text-center sm:pt-64 lg:px-10 lg:pt-72 ${
          compact ? "pb-4 sm:pb-6 lg:pb-8" : "pb-6 sm:pb-8 lg:pb-10"
        }`}
      >
        <h1 className="text-balance mx-auto max-w-3xl text-3xl leading-[1.08] font-semibold tracking-tight text-white drop-shadow-sm sm:text-4xl md:text-5xl lg:text-[3.25rem]">
          Tu próxima inversión, al alcance de un clic
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
          Tu próximo hogar o tu mejor oportunidad de negocio. Catálogo
          inmobiliario y remates conducidos por el martillero Alberto
          Illanes Faciano.
        </p>

        <HeroSearch
          initialTab={initialTab}
          onExploreAll={onExploreAll}
          onSearch={onSearch}
          onTabChange={onTabChange}
        />
      </div>
    </section>
  );
}
