import { useState } from "react";
import { useLocation } from "react-router-dom";
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
        showExploreAll={false}
        backLink={{ to: "/", label: "Volver al inicio" }}
      />

      <section
        id="catalogo"
        className="catalog-listing-section safe-fab-padding sm:pb-28"
        aria-label="Resultados del catálogo"
      >
        <CatalogResults action={action} />
      </section>
    </main>
  );
}
