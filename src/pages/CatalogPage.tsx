import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { HeroSection } from "../components/sections/HeroSection";
import { CatalogResults } from "../components/sections/CatalogResults";
import type { SearchAction, SearchTab } from "../lib/searchTypes";

const defaultAction: SearchAction = {
  mode: "all",
  tab: "propiedades",
};

function resolveInitialAction(state: unknown): SearchAction {
  if (!state || typeof state !== "object") {
    return defaultAction;
  }

  const viewState = state as { action?: SearchAction };

  if (viewState.action) {
    return viewState.action;
  }

  return defaultAction;
}

export function CatalogPage() {
  const location = useLocation();
  const [action, setAction] = useState<SearchAction>(() =>
    resolveInitialAction(location.state),
  );

  const activeTab: SearchTab =
    action.mode === "all" ? action.tab : action.tab;

  function handleExploreAll(tab: SearchTab) {
    setAction({ mode: "all", tab });
  }

  function handleSearch(nextAction: SearchAction) {
    setAction(nextAction);
  }

  return (
    <main className="min-h-screen bg-white">
      <HeroSection
        initialTab={activeTab}
        onExploreAll={handleExploreAll}
        onSearch={handleSearch}
        onTabChange={handleExploreAll}
        compact
      />

      <section
        id="catalogo"
        className="relative z-10 -mt-2 border-t border-slate-deep/5 bg-white safe-fab-padding sm:pb-28"
        aria-label="Resultados del catálogo"
      >
        <div className="mx-auto max-w-6xl px-4 pt-5 sm:px-6 sm:pt-6 lg:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-azul-francia transition hover:text-navy"
          >
            <ArrowLeft className="size-4" strokeWidth={2} />
            Volver al inicio
          </Link>
        </div>

        <CatalogResults action={action} />
      </section>
    </main>
  );
}
