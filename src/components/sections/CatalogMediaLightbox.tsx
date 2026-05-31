import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { CatalogMedia } from "../../lib/catalog";

type CatalogMediaLightboxProps = {
  media: CatalogMedia[];
  activeIndex: number;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onActiveIndexChange: (index: number) => void;
};

export function CatalogMediaLightbox({
  media,
  activeIndex,
  title,
  isOpen,
  onClose,
  onActiveIndexChange,
}: CatalogMediaLightboxProps) {
  const activeMedia = media[activeIndex];
  const hasMultiple = media.length > 1;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft" && hasMultiple) {
        onActiveIndexChange(
          activeIndex === 0 ? media.length - 1 : activeIndex - 1,
        );
      }

      if (event.key === "ArrowRight" && hasMultiple) {
        onActiveIndexChange(
          activeIndex === media.length - 1 ? 0 : activeIndex + 1,
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, hasMultiple, isOpen, media.length, onActiveIndexChange, onClose]);

  if (!isOpen || !activeMedia) {
    return null;
  }

  function showPrevious() {
    onActiveIndexChange(activeIndex === 0 ? media.length - 1 : activeIndex - 1);
  }

  function showNext() {
    onActiveIndexChange(activeIndex === media.length - 1 ? 0 : activeIndex + 1);
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-[#0b1220]/96 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de ${title}`}
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between px-4 py-4 sm:px-6"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-sm font-medium text-white/80">
          {hasMultiple ? `${activeIndex + 1} / ${media.length}` : "Vista ampliada"}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/20"
          aria-label="Cerrar galería"
        >
          <X className="size-5" strokeWidth={2} />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-14 sm:px-20"
        onClick={(event) => event.stopPropagation()}
      >
        {hasMultiple && (
          <button
            type="button"
            onClick={showPrevious}
            className="absolute left-3 rounded-full border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/20 sm:left-5"
            aria-label="Anterior"
          >
            <ChevronLeft className="size-6" strokeWidth={2} />
          </button>
        )}

        <div className="flex h-full max-h-[70vh] w-full max-w-6xl items-center justify-center">
          {activeMedia.kind === "video" ? (
            <video
              key={activeMedia.url}
              src={activeMedia.url}
              className="max-h-[70vh] max-w-full rounded-xl bg-black object-contain shadow-2xl"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={activeMedia.url}
              alt={title}
              className="max-h-[70vh] max-w-full rounded-xl object-contain shadow-2xl"
            />
          )}
        </div>

        {hasMultiple && (
          <button
            type="button"
            onClick={showNext}
            className="absolute right-3 rounded-full border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/20 sm:right-5"
            aria-label="Siguiente"
          >
            <ChevronRight className="size-6" strokeWidth={2} />
          </button>
        )}
      </div>

      {hasMultiple && (
        <div
          className="border-t border-white/10 px-4 py-4 sm:px-6"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto pb-1">
            {media.map((item, index) => (
              <button
                key={`${item.url}-${index}`}
                type="button"
                onClick={() => onActiveIndexChange(index)}
                className={`shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  index === activeIndex
                    ? "border-celeste"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
                aria-label={`Ver archivo ${index + 1}`}
                aria-pressed={index === activeIndex}
              >
                <div className="size-16 sm:size-20">
                  {item.kind === "video" ? (
                    <video
                      src={item.url}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
