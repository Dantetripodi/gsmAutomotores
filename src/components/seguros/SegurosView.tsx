import { motion } from "motion/react";
import {
  Shield,
  CheckCircle2,
  Phone,
  ArrowRight,
  Car,
  Zap,
  Umbrella,
  HeartHandshake,
} from "lucide-react";

const WHATSAPP = "5491100000000"; // Reemplazá con el número real

type Props = {
  onVolverAlCatalogo: () => void;
};

type PlanSeguro = {
  nombre: string;
  etiqueta: string;
  destacado?: boolean;
  coberturas: string[];
  extras?: string[];
};

const PLANES: PlanSeguro[] = [
  {
    nombre: "Responsabilidad Civil",
    etiqueta: "Cobertura básica",
    coberturas: [
      "Daños materiales a terceros",
      "Lesiones y muerte de terceros",
      "Gastos de sepelio y sanatorio",
      "Defensa penal y civil",
    ],
  },
  {
    nombre: "Contra Terceros Completo",
    etiqueta: "Más elegido",
    destacado: true,
    coberturas: [
      "Todo lo del plan básico",
      "Robo y/o hurto total",
      "Incendio total y parcial",
      "Cerraduras y cristales",
      "Granizo",
    ],
    extras: ["Sin franquicia", "Asistencia en ruta 24/7"],
  },
  {
    nombre: "Todo Riesgo",
    etiqueta: "Protección total",
    coberturas: [
      "Todo lo del plan anterior",
      "Daño parcial por accidente",
      "Reposición directa 0km · 24 meses",
      "Robo parcial",
      "Inundación y terremoto",
    ],
    extras: ["Vehículo de reemplazo", "Asistencia en ruta 24/7"],
  },
];

const FAQS = [
  {
    q: "¿Qué documentación necesito?",
    a: "Tarjeta verde, DNI y, si tenés GNC, la tarjeta y factura correspondiente.",
  },
  {
    q: "¿De qué depende el valor del seguro?",
    a: "Del tipo de uso, edad del conductor, condición fiscal, kilometraje anual y cobertura elegida.",
  },
  {
    q: "¿Qué hago ante un accidente?",
    a: "Conservá la calma, verificá lesionados, pedí datos del seguro del otro vehículo y denunciá a tu aseguradora dentro de las 72 hs.",
  },
  {
    q: "¿Si no pago tengo cobertura?",
    a: "No. Recomendamos adherir el pago a débito automático para evitar lapsos sin cobertura.",
  },
];

const BENEFICIOS = [
  { icon: Shield, titulo: "Compañías líderes", desc: "Trabajamos con las aseguradoras más sólidas del mercado." },
  { icon: HeartHandshake, titulo: "Asesoría personalizada", desc: "Un asesor te guía para elegir la cobertura que más te conviene." },
  { icon: Zap, titulo: "100% online", desc: "Cotizá y contratá desde cualquier parte del país." },
  { icon: Umbrella, titulo: "Asistencia 24/7", desc: "Soporte en ruta disponible todos los días, todo el año." },
];

function renderPlan(plan: PlanSeguro) {
  const msgWA = encodeURIComponent(
    `Hola, quiero cotizar el plan "${plan.nombre}" para mi vehículo.`
  );
  return (
    <div
      key={plan.nombre}
      className={`relative flex flex-col rounded-2xl border p-6 md:p-8 ${
        plan.destacado
          ? "border-[#b80c0c] shadow-lg shadow-[#b80c0c]/10"
          : "border-neutral-200 shadow-sm"
      }`}
    >
      {plan.destacado && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#b80c0c] text-white text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
          {plan.etiqueta}
        </span>
      )}
      {!plan.destacado && (
        <span className="text-xs font-semibold text-neutral-500 mb-3">{plan.etiqueta}</span>
      )}
      <h3 className="text-xl font-bold text-neutral-900 mb-5 mt-2">{plan.nombre}</h3>

      <ul className="space-y-2.5 flex-1">
        {plan.coberturas.map((c) => (
          <li key={c} className="flex items-start gap-2.5 text-sm text-neutral-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            {c}
          </li>
        ))}
      </ul>

      {plan.extras && plan.extras.length > 0 && (
        <ul className="mt-4 pt-4 border-t border-neutral-100 space-y-2">
          {plan.extras.map((e) => (
            <li key={e} className="flex items-start gap-2.5 text-sm font-medium text-[#b80c0c]">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              {e}
            </li>
          ))}
        </ul>
      )}

      <a
        href={`https://wa.me/${WHATSAPP}?text=${msgWA}`}
        target="_blank"
        rel="noreferrer"
        className={`mt-6 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
          plan.destacado
            ? "bg-[#b80c0c] text-white hover:bg-[#9a0a0a]"
            : "border border-neutral-200 text-neutral-800 hover:bg-neutral-50"
        }`}
      >
        Solicitar cotización
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}

export function SegurosView({ onVolverAlCatalogo }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="pb-20"
    >
      {/* Hero */}
      <section className="relative bg-neutral-900 text-white overflow-hidden rounded-2xl mb-10">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1511918984145-570f7052bebe?auto=format&fit=crop&q=80&w=1400"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative px-6 py-16 md:py-24 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#e8553a] mb-4">
            <Shield className="w-4 h-4" />
            Seguros
          </span>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Protegé tu vehículo con las mejores coberturas
          </h1>
          <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
            Trabajamos con compañías líderes para ofrecerte la cobertura que más se adapta a tu necesidad. Cotizá 100% online y contratá desde cualquier parte del país.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola, quiero cotizar un seguro para mi vehículo.")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#b80c0c] text-white rounded-xl font-semibold text-sm hover:bg-[#9a0a0a] transition-colors min-h-[44px]"
            >
              Cotizar por WhatsApp
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="tel:08001234567"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/30 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors min-h-[44px]"
            >
              <Phone className="w-4 h-4" />
              0810 · consultá
            </a>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">¿Por qué asegurarte con nosotros?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BENEFICIOS.map(({ icon: Icon, titulo, desc }) => (
            <div key={titulo} className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[#b80c0c]/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[#b80c0c]" />
              </div>
              <p className="font-semibold text-neutral-900 text-sm mb-1">{titulo}</p>
              <p className="text-xs text-neutral-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Planes */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-neutral-900">Coberturas disponibles</h2>
          <span className="text-xs text-neutral-500">Todos los precios son referenciales y sujetos a confirmación.</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANES.map(renderPlan)}
        </div>
      </section>

      {/* Qué cubre */}
      <section className="mb-14 bg-white rounded-2xl border border-neutral-200 p-6 md:p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Car className="w-6 h-6 text-[#b80c0c]" />
          <h2 className="text-xl font-bold text-neutral-900">¿Qué cubre un seguro de auto?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 text-sm text-neutral-700">
          {[
            "Daños materiales y lesiones a terceros",
            "Gastos de sanatorio y sepelio",
            "Robo total y parcial",
            "Incendio total y parcial",
            "Rotura de cristales y cerraduras",
            "Daño parcial por accidente",
            "Granizo, inundación y catástrofes",
            "Defensa penal y civil",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {item}
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-neutral-500">
          * Las coberturas incluidas dependen del plan contratado. Consultá con un asesor para más detalle.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Preguntas frecuentes</h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="group bg-white rounded-xl border border-neutral-200 shadow-sm"
            >
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold text-neutral-900 select-none list-none gap-3">
                {q}
                <span className="shrink-0 w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="px-5 pb-4 text-sm text-neutral-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-neutral-900 text-white rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl font-bold mb-3">¿Listo para asegurar tu vehículo?</h2>
        <p className="text-neutral-400 text-sm mb-8 max-w-md mx-auto">
          Un asesor de GSM Automotores te acompaña en cada paso. Cotización sin compromiso.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola, quiero cotizar un seguro para mi vehículo.")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#b80c0c] text-white rounded-xl font-semibold text-sm hover:bg-[#9a0a0a] transition-colors min-h-[44px]"
          >
            Cotizar ahora
            <ArrowRight className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={onVolverAlCatalogo}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/30 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors min-h-[44px]"
          >
            Ver catálogo
          </button>
        </div>
      </section>
    </motion.div>
  );
}
