import { catalogSectionLabels, type SearchTab } from "../../lib/searchTypes";

type CatalogEmptyStateProps = {
  tab: SearchTab;
};

export function CatalogEmptyState({ tab }: CatalogEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
      <span className="text-5xl sm:text-6xl" role="img" aria-hidden>
        😢
      </span>
      <p className="mt-6 max-w-md text-lg font-medium text-navy sm:text-xl">
        Por el momento no tenemos {catalogSectionLabels[tab]}
      </p>
    </div>
  );
}
