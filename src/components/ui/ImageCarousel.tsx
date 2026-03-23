import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

type Props = {
  images: string[];
  alt: string;
  className?: string;
  /** Contenedor (ej. aspect ratio) */
  aspectClass?: string;
  /** Vista tarjeta del catálogo: controles más chicos */
  compact?: boolean;
};

export function ImageCarousel({ images, alt, className, aspectClass = "aspect-[4/3]", compact }: Props) {
  const urls = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const total = urls.length;

  useEffect(() => {
    setIndex(0);
  }, [urls.join("|")]);

  const avanzar = useCallback(
    (delta: number) => {
      if (total <= 1) return;
      setIndex((prev) => (prev + delta + total) % total);
    },
    [total]
  );

  if (total === 0) {
    return <div className={cn("bg-neutral-100", aspectClass, className)} />;
  }

  const btnBase =
    "absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/60 transition-colors";
  const btnSize = compact ? "w-8 h-8" : "w-10 h-10";

  return (
    <div className={cn("relative overflow-hidden bg-neutral-100", aspectClass, className)}>
      <img
        src={urls[index]}
        alt={alt}
        className="w-full h-full object-cover"
        referrerPolicy={urls[index].includes("drive.google.com") ? "strict-origin-when-cross-origin" : "no-referrer"}
      />

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Foto anterior"
            className={cn(btnBase, btnSize, "left-2")}
            onClick={(e) => {
              e.stopPropagation();
              avanzar(-1);
            }}
          >
            <ChevronLeft className={compact ? "w-4 h-4" : "w-5 h-5"} />
          </button>
          <button
            type="button"
            aria-label="Foto siguiente"
            className={cn(btnBase, btnSize, "right-2")}
            onClick={(e) => {
              e.stopPropagation();
              avanzar(1);
            }}
          >
            <ChevronRight className={compact ? "w-4 h-4" : "w-5 h-5"} />
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
            {urls.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "rounded-full transition-all",
                  compact ? "h-1 w-1" : "h-1.5 w-1.5",
                  i === index ? "bg-white w-4" : "bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
