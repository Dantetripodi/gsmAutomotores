import { Fragment, useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, Trash2, LogOut, CircleDot, Pencil } from "lucide-react";
import { formatPrice, urlsImagenesAuto } from "../../lib/utils";
import { catalogoServicio, dashboardServicio } from "../../services";
import { useOnInit } from "../../hooks/useOnInit";
import { useAuth } from "../../context/AuthContext";
import { AddCarForm } from "./AddCarForm";
import type { Car, CarStatus, DashboardStats } from "../../types";

type Props = {
  onBack: () => void;
};

const STATUS_CYCLE: Record<CarStatus, CarStatus> = {
  available: "reserved",
  reserved: "sold",
  sold: "available",
};

const STATUS_LABEL: Record<CarStatus, string> = {
  available: "Disponible",
  reserved: "Reservado",
  sold: "Vendido",
};

const STATUS_STYLE: Record<CarStatus, string> = {
  available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  reserved: "bg-amber-50 text-amber-700 border-amber-200",
  sold: "bg-neutral-100 text-neutral-500 border-neutral-200",
};

export function AdminDashboardView({ onBack }: Props) {
  const { token, logout } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formCar, setFormCar] = useState<Car | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [stock, setStock] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([dashboardServicio.obtenerEstadisticas(), catalogoServicio.obtenerCatalogo()])
      .then(([s, c]) => {
        setStats(s);
        setStock(c);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useOnInit(loadData);

  const handleDelete = async (carId: number) => {
    if (!confirm("¿Eliminar este vehículo del catálogo?")) return;
    if (!token) return;
    try {
      await catalogoServicio.eliminar(carId, token);
      loadData();
    } catch {
      alert("No se pudo eliminar el vehículo.");
    }
  };

  const handleStatusCycle = async (car: Car) => {
    if (!token) return;
    const next = STATUS_CYCLE[car.status];
    try {
      const updated = await catalogoServicio.actualizarEstado(car.id, next, token);
      setStock((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setStats((prev) =>
        prev
          ? {
              ...prev,
              available: stock.filter((c) => (c.id === car.id ? next : c.status) === "available").length,
              reserved: stock.filter((c) => (c.id === car.id ? next : c.status) === "reserved").length,
              sold: stock.filter((c) => (c.id === car.id ? next : c.status) === "sold").length,
            }
          : prev
      );
    } catch {
      alert("No se pudo cambiar el estado.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-10 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[#b80c0c] font-semibold hover:underline text-sm w-fit min-h-[44px]"
        >
          <ChevronRight className="w-5 h-5 rotate-180 shrink-0" />
          Volver al catálogo
        </button>
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-sm font-semibold min-h-[44px]"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setFormCar(null);
              setShowAddForm(true);
            }}
            className="px-5 py-3 bg-[#b80c0c] text-white rounded-lg font-semibold text-sm shadow-sm hover:bg-[#9a0a0a] min-h-[44px]"
          >
            Agregar vehículo
          </button>
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">Panel de administración</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="p-4 md:p-6 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] md:text-xs font-semibold text-neutral-500 uppercase tracking-wide">Stock total</span>
          <p className="text-2xl md:text-4xl font-bold mt-1 md:mt-2">{stats?.totalStock ?? "—"}</p>
        </div>
        <div className="p-4 md:p-6 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] md:text-xs font-semibold text-neutral-500 uppercase tracking-wide">Disponibles</span>
          <p className="text-2xl md:text-4xl font-bold mt-1 md:mt-2 text-emerald-700">{stats?.available ?? "—"}</p>
        </div>
        <div className="p-4 md:p-6 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] md:text-xs font-semibold text-neutral-500 uppercase tracking-wide">Reservados</span>
          <p className="text-2xl md:text-4xl font-bold mt-1 md:mt-2 text-amber-700">{stats?.reserved ?? "—"}</p>
        </div>
        <div className="col-span-2 lg:col-span-1 p-4 md:p-6 bg-white rounded-xl border border-neutral-200 shadow-sm">
          <span className="text-[10px] md:text-xs font-semibold text-neutral-500 uppercase tracking-wide">Vendidos</span>
          <p className="text-2xl md:text-4xl font-bold mt-1 md:mt-2 text-neutral-400">{stats?.sold ?? "—"}</p>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="text-lg font-bold text-neutral-900">Vehículos en catálogo</h3>
        {loading ? (
          <p className="text-sm text-neutral-500 py-8">Cargando…</p>
        ) : (
          <ul className="space-y-3">
            {stock.map((car) => {
              const portada = urlsImagenesAuto(car)[0];
              return (
              <li
                key={car.id}
                className="flex flex-col sm:flex-row sm:items-stretch gap-3 p-3 md:p-4 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden"
              >
                <div className="w-full sm:w-36 md:w-40 h-28 sm:h-auto shrink-0 rounded-lg bg-neutral-100 overflow-hidden">
                  {portada ? (
                    <img
                      src={portada}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[7rem] flex items-center justify-center text-[10px] text-neutral-500 px-2 text-center">
                      Sin foto
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-neutral-500">
                      {car.brandName} · ID {car.id}
                    </p>
                    <p className="font-semibold text-neutral-900 truncate">
                      {car.versionName ? `${car.modelName} ${car.versionName}` : car.modelName}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {car.year} · {car.condition === "0km" ? "0 km" : `${car.mileage.toLocaleString("es-AR")} km`}
                    </p>
                    <p className="text-sm font-bold text-neutral-900 mt-1">{formatPrice(car.price, car.currency)}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    {/* Botón de estado: click para ciclar */}
                    <button
                      type="button"
                      title="Click para cambiar estado"
                      onClick={() => handleStatusCycle(car)}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold min-h-[40px] transition-opacity hover:opacity-70 ${STATUS_STYLE[car.status]}`}
                    >
                      <CircleDot className="w-3.5 h-3.5" />
                      {STATUS_LABEL[car.status]}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormCar(car);
                        setShowAddForm(true);
                      }}
                      className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-200 text-neutral-800 hover:bg-neutral-50 text-sm font-semibold min-h-[44px] w-full sm:w-auto"
                    >
                      <Pencil className="w-4 h-4" />
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(car.id)}
                      className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-sm font-semibold min-h-[44px] w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            );
            })}
          </ul>
        )}
      </section>

      {showAddForm && (
        <Fragment key={formCar ? `edit-${formCar.id}` : "nuevo"}>
          <AddCarForm
            carToEdit={formCar}
            onClose={() => {
              setShowAddForm(false);
              setFormCar(null);
            }}
            onSaved={() => {
              loadData();
              setShowAddForm(false);
              setFormCar(null);
            }}
          />
        </Fragment>
      )}
    </motion.div>
  );
}
