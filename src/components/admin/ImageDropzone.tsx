import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import { Clapperboard, ImagePlus, Upload, X } from "lucide-react";
import { isAllowedMediaFile, isVideoFile, mediaUploadAccept } from "../../lib/mediaUpload";
import type { AdminMediaFile } from "../../types/adminCatalog";

type ImageDropzoneProps = {
  images: AdminMediaFile[];
  onChange: (images: AdminMediaFile[]) => void;
  disabled?: boolean;
};

function createMediaFile(file: File): AdminMediaFile {
  return {
    id: crypto.randomUUID(),
    file,
    previewUrl: URL.createObjectURL(file),
    kind: isVideoFile(file) ? "video" : "image",
  };
}

export function ImageDropzone({
  images,
  onChange,
  disabled = false,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rejectedCount, setRejectedCount] = useState(0);

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || disabled) {
        return;
      }

      const files = Array.from(fileList);
      const incoming = files.filter(isAllowedMediaFile);
      const skipped = files.length - incoming.length;

      setRejectedCount(skipped);

      if (incoming.length === 0) {
        return;
      }

      onChange([...images, ...incoming.map(createMediaFile)]);
    },
    [disabled, images, onChange],
  );

  function removeMedia(id: string) {
    if (disabled) {
      return;
    }

    const target = images.find((item) => item.id === id);

    if (target) {
      URL.revokeObjectURL(target.previewUrl);
    }

    onChange(images.filter((item) => item.id !== id));
  }

  const imagesRef = useRef(images);
  imagesRef.current = images;

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (!disabled) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  }

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(event) => {
          if ((event.key === "Enter" || event.key === " ") && !disabled) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`admin-dropzone ${isDragging ? "admin-dropzone-active" : ""} ${
          disabled ? "admin-dropzone-disabled" : ""
        }`}
        aria-disabled={disabled}
      >
        <div className="admin-dropzone-icon">
          <Upload className="size-6" strokeWidth={1.75} />
        </div>

        <p className="text-sm font-medium text-slate-deep">
          Arrastrá fotos o videos acá, o hacé clic para seleccionar
        </p>
        <p className="mt-1 text-xs text-muted">
          Todas las imágenes y videos habituales · Múltiples archivos
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={mediaUploadAccept}
          multiple
          className="hidden"
          disabled={disabled}
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {rejectedCount > 0 && (
        <p className="text-xs font-medium text-red-600">
          {rejectedCount} archivo{rejectedCount === 1 ? "" : "s"} no compatible
          {rejectedCount === 1 ? "" : "s"} (solo fotos y videos).
        </p>
      )}

      {images.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-deep">
            <ImagePlus className="size-4 text-azul-francia" strokeWidth={2} />
            Vista previa ({images.length})
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((item) => (
              <div key={item.id} className="admin-thumbnail group">
                {item.kind === "video" ? (
                  <video
                    src={item.previewUrl}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="h-full w-full object-cover"
                  />
                )}

                {item.kind === "video" && (
                  <span className="admin-thumbnail-badge">
                    <Clapperboard className="size-3" strokeWidth={2} />
                    Video
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => removeMedia(item.id)}
                  className="admin-thumbnail-remove"
                  aria-label={`Eliminar ${item.file.name}`}
                  disabled={disabled}
                >
                  <X className="size-3.5" strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
