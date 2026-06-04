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
      className={`relative overflow-hidden bg-white ${
        compact ? "pb-6 sm:pb-8" : "pb-10 sm:pb-12"
      }`}
    >
      <div className="hero-bg-stack pointer-events-none absolute inset-0 overflow-hidden">
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

      <Navbar compact={compact} />

      <div
        className={`relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-10 ${
          compact
            ? "pt-32 pb-4 sm:pt-36 sm:pb-6 lg:pt-40 lg:pb-8"
            : "pt-40 pb-6 sm:pt-48 sm:pb-8 lg:pt-60 lg:pb-10 xl:pt-64"
        }`}
      >
        <h1
          className={`hero-animate-in text-balance mx-auto max-w-3xl leading-[1.08] font-semibold tracking-tight text-white drop-shadow-sm ${
            compact
              ? "text-2xl sm:text-3xl md:text-4xl"
              : "text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem]"
          }`}
        >
          Tu próxima inversión, al alcance de un clic
        </h1>

        <p
          className={`hero-animate-in hero-delay-1 mx-auto max-w-2xl leading-relaxed text-white/85 ${
            compact
              ? "mt-4 hidden text-sm sm:mt-5 sm:block sm:text-base lg:text-lg"
              : "mt-5 text-base sm:mt-6 sm:text-lg"
          }`}
        >
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
          />
        </div>
      </div>
    </section>
  );
}
