import { motion } from "motion/react";
import { formatPrice } from "../../lib/utils";
import type { Car } from "../../types";

type CarCardProps = {
  car: Car;
  onOpen: (id: number) => void;
};

export function CarCard({ car, onOpen }: CarCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex flex-col cursor-pointer bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      onClick={() => onOpen(car.id)}
    >
      <div className="relative aspect-[4/3] bg-neutral-100">
        <img
          src={car.mainImageUrl}
          alt={car.modelName}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {car.status === "reserved" && (
          <span className="absolute top-3 right-3 bg-amber-100 text-amber-800 px-2.5 py-1 rounded text-[11px] font-semibold">
            Reservado
          </span>
        )}
        {car.status === "sold" && (
          <span className="absolute top-3 right-3 bg-neutral-800 text-white px-2.5 py-1 rounded text-[11px] font-semibold">
            Vendido
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-xs text-neutral-500">
          {car.brandName} · {car.condition === "0km" ? "0 km" : `${car.year} · ${car.mileage.toLocaleString("es-AR")} km`}
        </p>
        <h3 className="text-lg font-bold text-neutral-900 leading-snug">
          {car.versionName ? `${car.modelName} ${car.versionName}` : car.modelName}
        </h3>
        <p className="text-sm text-neutral-600">
          {car.fuelType} · {car.transmission}
        </p>
        <p className="text-xl font-bold text-neutral-900 mt-auto pt-2">{formatPrice(car.price, car.currency)}</p>
        <span className="text-[#b80c0c] text-sm font-semibold group-hover:underline">Ver modelo</span>
      </div>
    </motion.article>
  );
}
