import { useState } from "react";
import { motion } from "motion/react";
import {
  ChevronRight,
  Calendar,
  MessageCircle,
  Share2,
  Wallet,
  CreditCard,
  Building2,
  ArrowLeft,
  Home,
} from "lucide-react";
import { formatPrice, buildCarDetailTitle, whatsappConsultUrl, urlsImagenesAuto } from "../../lib/utils";
import { ImageCarousel } from "../ui/ImageCarousel";
import { catalogoServicio } from "../../services";
import { SpecBlock } from "./SpecBlock";
import { buildMetaLine, mergeSpecSummary } from "./detailUtils";
import { useOnInit } from "../../hooks/useOnInit";
import type { Car } from "../../types";

type Props = {
  id: number;
  onBack: () => void;
  onSelectCar: (carId: number) => void;
};

export function CarDetailsView({ id, onBack, onSelectCar }: Props) {
  const [car, setCar] = useState<Car | null>(null);
  const [related, setRelated] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useOnInit(() => {
    catalogoServicio
      .obtenerPorId(id)
      .then((data) => {
        setCar(data);
        if (data.brandSlug) {
          catalogoServicio
            .obtenerPorMarca(data.brandSlug)
            .then((list) => setRelated(list.filter((c) => c.id !== data.id).slice(0, 4)))
            .catch(() => {});
        }
      })
      .catch(() => setCar(null))
      .finally(() => setLoading(false));
  });

  const copyShare = () => {
    void navigator.clipboard.writeText(window.location.href);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#f5f5f5] z-[100] flex items-center justify-center text-neutral-600">
        Cargando ficha…
      </div>
    );
  }

  if (!car) {
    return (
      <div className="fixed inset-0 bg-[#f5f5f5] z-[100] flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-neutral-600">No encontramos este vehículo.</p>
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-lg bg-[#b80c0c] text-white font-semibold"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  const summaryExtra = mergeSpecSummary(car);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#f5f5f5] z-[100] overflow-y-auto"
    >
      <div className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-3xl mx-auto h-14 flex items-center justify-between px-4">
          <button type="button" onClick={onBack} className="p-2 -ml-2 hover:bg-neutral-100 rounded-full" aria-label="Volver">
            <ArrowLeft className="w-5 h-5 text-neutral-800" />
          </button>
          <span className="text-sm font-semibold text-neutral-900 truncate max-w-[50%]">GSM Automotores</span>
          <button type="button" onClick={copyShare} className="p-2 -mr-2 hover:bg-neutral-100 rounded-full" aria-label="Compartir">
            <Share2 className="w-5 h-5 text-neutral-700" />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto pb-36">
        <nav className="px-4 pt-4 flex items-center gap-1 text-xs text-neutral-500 flex-wrap">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-1 hover:text-[#b80c0c]">
            <Home className="w-3.5 h-3.5" />
            Inicio
          </button>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <button type="button" onClick={onBack} className="hover:text-[#b80c0c]">Catálogo</button>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-neutral-800 font-medium">{car.brandName}</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-neutral-800 font-medium truncate">{car.modelName}</span>
        </nav>

        <div className="bg-white mt-4 border-y border-neutral-200">
          <ImageCarousel
            images={urlsImagenesAuto(car)}
            alt={buildCarDetailTitle(car)}
            aspectClass="aspect-[16/10] w-full"
          />

          <div className="px-4 py-6 space-y-3 border-b border-neutral-100">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 leading-tight">{buildCarDetailTitle(car)}</h1>
            <p className="text-sm text-neutral-600">{buildMetaLine(car)}</p>
            <div className="flex flex-wrap items-baseline gap-3 pt-1">
              <p className="text-2xl md:text-3xl font-bold text-neutral-900">{formatPrice(car.price, car.currency)}</p>
              {car.status === "reserved" && (
                <span className="text-xs font-semibold bg-amber-100 text-amber-900 px-2.5 py-1 rounded">Reservado</span>
              )}
              {car.status === "sold" && (
                <span className="text-xs font-semibold bg-neutral-200 text-neutral-600 px-2.5 py-1 rounded">Vendido</span>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 mt-6 space-y-8">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900">Descripción</h2>
            <p className="text-sm text-neutral-700 leading-relaxed">{car.description}</p>
          </section>

          <section className="space-y-6">
            <h2 className="text-lg font-bold text-neutral-900">Ficha técnica</h2>
            <SpecBlock title="Resumen" rows={summaryExtra} />
            <SpecBlock title="Equipamiento" rows={car.equipment} />
            <SpecBlock title="Otras características" rows={car.otherFeatures} />
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-5 space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-neutral-900">Contactá un asesor</h2>
            <p className="text-sm text-neutral-600">
              Completá tus datos y te respondemos a la brevedad. Los valores son referenciales; confirmá condiciones comerciales con el equipo.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" placeholder="Nombre" className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b80c0c]/30" />
              <input type="text" placeholder="Apellido" className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b80c0c]/30" />
              <input type="email" placeholder="Email" className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b80c0c]/30" />
              <input type="tel" placeholder="Teléfono" className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b80c0c]/30" />
            </div>
            <button type="button" className="w-full py-3 rounded-lg bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800">
              Enviar consulta
            </button>
          </section>

          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 space-y-4">
            <h3 className="text-base font-bold text-neutral-900">Financiación y permuta</h3>
            <div className="space-y-4">
              {[
                { icon: Wallet, title: "Recibimos tu usado", desc: "Tasación orientativa; oferta sujeta a revisión." },
                { icon: Calendar, title: "Planes y cuotas", desc: "Consultá disponibilidad según entidad y perfil crediticio." },
                { icon: Building2, title: "Crédito prendario", desc: "Requisitos y tasas según banco o financiera." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-white border border-neutral-200 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#b80c0c]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-neutral-900">{title}</p>
                    <p className="text-xs text-neutral-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {related.length > 0 && (
            <section className="space-y-4 pb-4">
              <h2 className="text-lg font-bold text-neutral-900">Vehículos relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onSelectCar(r.id)}
                    className="text-left rounded-lg border border-neutral-200 bg-white overflow-hidden hover:border-neutral-400 transition-colors"
                  >
                    <div className="aspect-[16/10] bg-neutral-100">
                      <ImageCarousel
                        images={urlsImagenesAuto(r)}
                        alt={r.modelName}
                        aspectClass="aspect-[16/10] w-full"
                        compact
                      />
                    </div>
                    <div className="p-3 space-y-1">
                      <p className="text-xs text-neutral-500">{r.brandName} · {r.condition === "0km" ? "0 km" : r.year}</p>
                      <p className="text-sm font-semibold text-neutral-900 line-clamp-2">
                        {r.versionName ? `${r.modelName} ${r.versionName}` : r.modelName}
                      </p>
                      <p className="text-sm font-bold text-neutral-900">{formatPrice(r.price, r.currency)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-[110] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-3xl mx-auto p-4 flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-neutral-500 truncate">{buildCarDetailTitle(car)}</p>
              <p className="text-lg font-bold text-neutral-900">{formatPrice(car.price, car.currency)}</p>
            </div>
            <a href={whatsappConsultUrl(car)} target="_blank" rel="noreferrer"
              className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#25d366] text-white min-h-[48px] min-w-[48px]"
              aria-label="WhatsApp">
              <MessageCircle className="w-6 h-6 fill-current" />
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <a href={whatsappConsultUrl(car)} target="_blank" rel="noreferrer"
              className="flex-1 py-3.5 sm:py-3 rounded-lg bg-[#b80c0c] text-white text-sm font-semibold hover:bg-[#9a0a0a] text-center min-h-[44px] flex items-center justify-center">
              Consultar por este auto
            </a>
            <button type="button"
              className="py-3 px-4 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" />
              Señar
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
