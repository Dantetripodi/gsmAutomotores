import { Gauge } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Brand } from "../../types";

type CatalogHeroProps = {
  brands: Brand[];
  selectedBrand: string;
  onSelectBrand: (slug: string) => void;
  onOpenAppraisal: () => void;
};

export function CatalogHero({ brands, selectedBrand, onSelectBrand, onOpenAppraisal }: CatalogHeroProps) {
  return (
    <section className="mb-10 md:mb-12">
      <div className="flex flex-col gap-2 mb-6 md:mb-8">
        <span className="text-xs font-semibold text-[#b80c0c] uppercase tracking-wide">Catálogo</span>
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">
          Encontrá el auto perfecto entre 0 km y usados
        </h2>
        <p className="text-neutral-600 text-sm md:text-base max-w-2xl">
          Filtrá por marca y presupuesto. Entrá a la ficha para ver descripción y ficha técnica al detalle.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <button
          type="button"
          onClick={onOpenAppraisal}
          className="flex-grow md:flex-none px-6 py-3.5 bg-white border border-neutral-200 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-neutral-50 transition-colors shadow-sm min-h-[44px]"
        >
          <Gauge className="w-5 h-5 text-[#b80c0c]" />
          Cotizar mi auto
        </button>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar flex-grow">
          <button
            type="button"
            onClick={() => onSelectBrand("")}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border min-h-[40px]",
              selectedBrand === "" ? "bg-[#b80c0c] text-white border-[#b80c0c]" : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
            )}
          >
            Todas las marcas
          </button>
          {brands.map((brand) => (
            <button
              type="button"
              key={brand.id}
              onClick={() => onSelectBrand(brand.slug)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border min-h-[40px]",
                selectedBrand === brand.slug ? "bg-[#b80c0c] text-white border-[#b80c0c]" : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
              )}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
