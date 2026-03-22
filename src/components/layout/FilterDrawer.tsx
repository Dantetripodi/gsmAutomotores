import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn, formatPrice } from "../../lib/utils";
import type { Brand } from "../../types";
import { PRICE_RANGE_MAX, PRICE_RANGE_MIN, PRICE_RANGE_STEP } from "../../config/app";

type FilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  brands: Brand[];
  selectedBrand: string;
  onSelectBrand: (slug: string) => void;
  priceMax: number;
  onPriceMaxChange: (value: number) => void;
  resultCount: number;
};

export function FilterDrawer({
  open,
  onClose,
  brands,
  selectedBrand,
  onSelectBrand,
  priceMax,
  onPriceMaxChange,
  resultCount,
}: FilterDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[70] shadow-2xl p-6 sm:p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8 sm:mb-10">
              <h3 className="text-xl font-bold text-neutral-900">Filtros</h3>
              <button type="button" onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow space-y-10 overflow-y-auto">
              <div className="space-y-4">
                <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Marca</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectBrand("")}
                    className={cn(
                      "py-3 rounded-lg text-sm font-medium border transition-colors min-h-[44px]",
                      selectedBrand === "" ? "bg-[#b80c0c] text-white border-[#b80c0c]" : "bg-white border-neutral-200"
                    )}
                  >
                    Todas
                  </button>
                  {brands.map((brand) => (
                    <button
                      type="button"
                      key={brand.id}
                      onClick={() => onSelectBrand(brand.slug)}
                      className={cn(
                        "py-3 rounded-lg text-sm font-medium border transition-colors min-h-[44px]",
                        selectedBrand === brand.slug ? "bg-[#b80c0c] text-white border-[#b80c0c]" : "bg-white border-neutral-200"
                      )}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Precio máximo</label>
                  <span className="text-lg font-bold text-neutral-900">{formatPrice(priceMax)}</span>
                </div>
                <input
                  type="range"
                  min={PRICE_RANGE_MIN}
                  max={PRICE_RANGE_MAX}
                  step={PRICE_RANGE_STEP}
                  value={priceMax}
                  onChange={(e) => onPriceMaxChange(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#b80c0c]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-4 bg-neutral-900 text-white rounded-lg font-semibold active:scale-[0.99] transition-transform min-h-[48px] mt-4"
            >
              Ver {resultCount} resultados
            </button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
