import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, Gauge } from "lucide-react";
import { formatPrice } from "../../lib/utils";
import { tasacionServicio } from "../../services";

type AppraisalWizardViewProps = {
  onBack: () => void;
};

export function AppraisalWizardView({ onBack }: AppraisalWizardViewProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ year: 2020, mileage: 50000, brand: "Porsche" });
  const [result, setResult] = useState<number | null>(null);

  const handleAppraise = async () => {
    try {
      const data = await tasacionServicio.calcular(formData);
      setResult(data.estimatedValue);
      setStep(2);
    } catch {
      alert("No se pudo obtener la cotización.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto py-6 md:py-10 px-2">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-[#b80c0c] font-semibold mb-6 md:mb-8 hover:underline min-h-[44px]"
      >
        <ChevronRight className="w-5 h-5 rotate-180" />
        Volver al catálogo
      </button>

      <div className="bg-white rounded-2xl md:rounded-[2rem] shadow-xl p-6 md:p-12 border border-neutral-200">
        {step === 1 ? (
          <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-[#b80c0c] uppercase tracking-wide">Cotización instantánea</span>
              <h2 className="text-2xl md:text-4xl font-bold text-neutral-900">¿Cuánto vale tu auto?</h2>
              <p className="text-neutral-600 text-sm md:text-base">Obtené un estimado en tiempo real basado en datos del mercado.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Marca</label>
                <select
                  className="w-full p-3 md:p-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-[#b80c0c]/30 focus:outline-none min-h-[44px]"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                >
                  <option>Porsche</option>
                  <option>BMW</option>
                  <option>Mercedes-Benz</option>
                  <option>Audi</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Año</label>
                  <input
                    type="number"
                    className="w-full p-3 md:p-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-[#b80c0c]/30 focus:outline-none min-h-[44px]"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Kilometraje (KM)</label>
                  <input
                    type="number"
                    className="w-full p-3 md:p-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-[#b80c0c]/30 focus:outline-none min-h-[44px]"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAppraise}
              className="w-full py-4 md:py-5 bg-[#b80c0c] text-white rounded-xl font-semibold text-base shadow-sm hover:bg-[#9a0a0a] min-h-[48px] transition-colors"
            >
              Obtener cotización
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6 md:space-y-8 py-6 md:py-10">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <Gauge className="w-8 h-8 md:w-10 md:h-10 text-emerald-700" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-bold text-neutral-900">Valor estimado</h3>
              <p className="text-4xl md:text-6xl font-bold text-emerald-700 tracking-tight break-all">{formatPrice(result || 0)}</p>
            </div>
            <p className="text-neutral-600 max-w-sm mx-auto text-sm md:text-base">
              Este es un estimado basado en el mercado. Traé tu auto para una inspección final y obtener una oferta firme.
            </p>
            <button type="button" onClick={() => setStep(1)} className="text-[#b80c0c] font-semibold hover:underline min-h-[44px]">
              Empezar de nuevo
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
