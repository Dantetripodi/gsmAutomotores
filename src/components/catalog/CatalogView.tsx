import { Fragment } from "react";
import { motion } from "motion/react";
import { Search, Filter } from "lucide-react";
import type { Car, Brand } from "../../types";
import { CatalogHero } from "./CatalogHero";
import { CarCard } from "./CarCard";

type CatalogViewProps = {
  cars: Car[];
  brands: Brand[];
  loading: boolean;
  selectedBrand: string;
  onSelectBrand: (slug: string) => void;
  onOpenDetails: (id: number) => void;
  onOpenAppraisal: () => void;
  onOpenFilters: () => void;
  onClearFilters: () => void;
};

export function CatalogView({
  cars,
  brands,
  loading,
  selectedBrand,
  onSelectBrand,
  onOpenDetails,
  onOpenAppraisal,
  onOpenFilters,
  onClearFilters,
}: CatalogViewProps) {
  return (
    <motion.div
      key="catalog"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <CatalogHero
        brands={brands}
        selectedBrand={selectedBrand}
        onSelectBrand={onSelectBrand}
        onOpenAppraisal={onOpenAppraisal}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-neutral-200 rounded-lg mb-4" />
              <div className="h-4 bg-neutral-200 w-1/3 rounded mb-2" />
              <div className="h-6 bg-neutral-200 w-2/3 rounded" />
            </div>
          ))
        ) : (
          cars.map((car) => (
            <Fragment key={car.id}>
              <CarCard car={car} onOpen={onOpenDetails} />
            </Fragment>
          ))
        )}
      </div>

      {!loading && cars.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center mb-6">
            <Search className="w-8 h-8 text-neutral-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">No se encontraron vehículos</h3>
          <p className="text-neutral-600">Intentá ajustando los filtros para encontrar lo que buscás.</p>
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-6 text-[#b80c0c] font-semibold hover:underline min-h-[44px]"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onOpenFilters}
        className="fixed bottom-6 right-4 md:bottom-8 md:right-8 h-12 md:h-14 px-5 md:px-6 rounded-full bg-[#b80c0c] text-white shadow-lg flex items-center gap-2 hover:bg-[#9a0a0a] transition-colors z-40 min-h-[48px]"
      >
        <Filter className="w-5 h-5" />
        <span className="text-sm font-semibold">Filtros</span>
      </button>
    </motion.div>
  );
}
