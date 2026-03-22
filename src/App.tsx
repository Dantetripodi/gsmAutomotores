import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Gauge, 
  Settings2, 
  Fuel, 
  Calendar,
  X,
  Menu,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Play,
  CheckCircle2,
  Wallet,
  CreditCard,
  Building2,
  ArrowLeft,
  Palette,
  DoorOpen
} from "lucide-react";
import { cn, formatPrice } from "./lib/utils";
import type { Car, Brand } from "./types";

export default function App() {
  const [view, setView] = useState<"catalog" | "details" | "admin" | "appraisal">("catalog");
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [priceMax, setPriceMax] = useState<number>(300000);

  useEffect(() => {
    if (view === "catalog") {
      fetchData();
    }
    fetchBrands();
  }, [view, selectedBrand, priceMax]);

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedBrand) params.append("brand", selectedBrand);
    if (priceMax) params.append("price_max", priceMax.toString());
    
    const res = await fetch(`/api/catalog?${params.toString()}`);
    const data = await res.json();
    setCars(data);
    setLoading(false);
  };

  const fetchBrands = async () => {
    const res = await fetch("/api/brands");
    const data = await res.json();
    setBrands(data);
  };

  const navigateToDetails = (id: number) => {
    setSelectedCarId(id);
    setView("details");
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#e5eeff] h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 text-[#0050cb] cursor-pointer" onClick={() => setView("catalog")} />
          <h1 
            className="text-xl font-black tracking-tighter uppercase cursor-pointer"
            onClick={() => setView("catalog")}
          >
            AERO DRIVE
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView("admin")}
            className="text-xs font-bold uppercase tracking-widest text-[#727687] hover:text-[#0050cb]"
          >
            Administrador
          </button>
          <div className="h-8 w-8 rounded-full bg-[#0066ff] flex items-center justify-center text-white font-bold text-xs">
            AD
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {view === "catalog" && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero */}
              <section className="mb-12">
                <div className="flex flex-col gap-2 mb-8">
                  <span className="text-xs font-bold tracking-[0.2em] text-[#0050cb] uppercase">Selección Elite</span>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                    Encontrá tu próximo <br />vehículo de performance.
                  </h2>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <button 
                    onClick={() => setView("appraisal")}
                    className="flex-grow md:flex-none px-8 py-4 bg-white border border-[#dce9ff] rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-[#eff4ff] transition-all"
                  >
                    <Gauge className="w-5 h-5 text-[#0050cb]" />
                    Cotizar mi auto
                  </button>
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar flex-grow">
                    <button 
                      onClick={() => setSelectedBrand("")}
                      className={cn(
                        "px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                        selectedBrand === "" ? "bg-[#0050cb] text-white" : "bg-white text-[#424656] border border-[#dce9ff]"
                      )}
                    >
                      Todas las marcas
                    </button>
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => setSelectedBrand(brand.slug)}
                        className={cn(
                          "px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                          selectedBrand === brand.slug ? "bg-[#0050cb] text-white" : "bg-white text-[#424656] border border-[#dce9ff]"
                        )}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Catalog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[4/3] bg-[#eff4ff] rounded-2xl mb-6" />
                      <div className="h-4 bg-[#eff4ff] w-1/3 rounded mb-2" />
                      <div className="h-6 bg-[#eff4ff] w-2/3 rounded" />
                    </div>
                  ))
                ) : (
                  cars.map((car) => (
                    <motion.article
                      key={car.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group flex flex-col cursor-pointer"
                      onClick={() => navigateToDetails(car.id)}
                    >
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-[#eff4ff]">
                        <img 
                          src={car.mainImageUrl} 
                          alt={car.modelName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md rounded-xl p-3 flex justify-between items-center">
                          <div className="flex gap-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase tracking-wider text-[#727687] font-bold">Kilometraje</span>
                              <span className="text-xs font-bold">{car.mileage.toLocaleString()} KM</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase tracking-wider text-[#727687] font-bold">Transmisión</span>
                              <span className="text-xs font-bold">{car.transmission}</span>
                            </div>
                          </div>
                          {car.status === "reserved" && (
                            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                              Reservado
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-[10px] font-bold text-[#727687] tracking-widest uppercase">
                              {car.year} {car.brandName}
                            </h3>
                            <p className="text-2xl font-black tracking-tighter uppercase">{car.modelName}</p>
                          </div>
                          <button className="bg-white shadow-sm p-3 rounded-full text-[#006646] active:scale-90 transition-transform">
                            <MessageCircle className="w-5 h-5 fill-current" />
                          </button>
                        </div>
                        <p className="text-2xl font-black text-[#006646] tracking-tight mt-2">
                          {formatPrice(car.price)}
                        </p>
                      </div>
                    </motion.article>
                  ))
                )}
              </div>

              {/* Empty State */}
              {!loading && cars.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-[#eff4ff] rounded-full flex items-center justify-center mb-6">
                    <Search className="w-8 h-8 text-[#727687]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No se encontraron vehículos</h3>
                  <p className="text-[#424656]">Intentá ajustando los filtros para encontrar lo que buscás.</p>
                  <button 
                    onClick={() => { setSelectedBrand(""); setPriceMax(300000); }}
                    className="mt-6 text-[#0050cb] font-bold hover:underline"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}

              {/* Floating Action Button (Filters) */}
              <button 
                onClick={() => setShowFilters(true)}
                className="fixed bottom-8 right-8 h-14 px-6 rounded-full bg-gradient-to-r from-[#0050cb] to-[#0066ff] text-white shadow-lg shadow-blue-500/20 flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 z-40"
              >
                <Filter className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Filtros</span>
              </button>
            </motion.div>
          )}

          {view === "details" && selectedCarId && (
            <CarDetailsView id={selectedCarId} onBack={() => setView("catalog")} />
          )}

          {view === "admin" && (
            <AdminDashboardView onBack={() => setView("catalog")} />
          )}

          {view === "appraisal" && (
            <AppraisalWizardView onBack={() => setView("catalog")} />
          )}
        </AnimatePresence>
      </main>

      {/* Filter Sidebar Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[70] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black tracking-tighter uppercase">Filtros</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-[#f8f9ff] rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow space-y-10">
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#727687]">Marca</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedBrand("")}
                      className={cn(
                        "py-3 rounded-xl text-sm font-bold border transition-all",
                        selectedBrand === "" ? "bg-[#0050cb] text-white border-[#0050cb]" : "bg-white border-[#dce9ff]"
                      )}
                    >
                      Todas
                    </button>
                    {brands.map(brand => (
                      <button
                        key={brand.id}
                        onClick={() => setSelectedBrand(brand.slug)}
                        className={cn(
                          "py-3 rounded-xl text-sm font-bold border transition-all",
                          selectedBrand === brand.slug ? "bg-[#0050cb] text-white border-[#0050cb]" : "bg-white border-[#dce9ff]"
                        )}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#727687]">Precio Máximo</label>
                    <span className="text-lg font-black text-[#006646]">{formatPrice(priceMax)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="50000" 
                    max="300000" 
                    step="5000"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full h-2 bg-[#eff4ff] rounded-lg appearance-none cursor-pointer accent-[#0050cb]"
                  />
                </div>
              </div>

              <button 
                onClick={() => setShowFilters(false)}
                className="w-full py-5 bg-[#0b1c30] text-white rounded-2xl font-bold text-lg tracking-tight active:scale-[0.98] transition-all"
              >
                Ver {cars.length} resultados
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e5eeff] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-lg font-black tracking-tighter uppercase">AERO DRIVE</span>
            <p className="text-xs text-[#727687] mt-2">© 2026 AERO DRIVE. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-xs font-bold text-[#727687] uppercase tracking-widest">
            <a href="#" className="hover:text-[#0050cb]">Privacy</a>
            <a href="#" className="hover:text-[#0050cb]">Terms</a>
            <a href="#" className="hover:text-[#0050cb]">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CarDetailsView({ id, onBack }: { id: number; onBack: () => void }) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/catalog/${id}`)
      .then(res => res.json())
      .then(data => {
        setCar(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="py-20 text-center">Cargando detalles...</div>;
  if (!car) return <div className="py-20 text-center">Vehículo no encontrado</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-[100] overflow-y-auto"
    >
      {/* Detail Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-[#e5eeff] h-16 flex items-center justify-between px-6">
        <button onClick={onBack} className="p-2 hover:bg-[#f8f9ff] rounded-full">
          <ArrowLeft className="w-6 h-6 text-[#0050cb]" />
        </button>
        <h2 className="text-lg font-black tracking-tighter uppercase">AERO DRIVE</h2>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-[#f8f9ff] rounded-full">
            <Share2 className="w-5 h-5 text-[#0050cb]" />
          </button>
          <button className="p-2 hover:bg-[#f8f9ff] rounded-full">
            <Heart className="w-5 h-5 text-[#0050cb]" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto pb-32">
        {/* Image Section */}
        <div className="relative aspect-[16/10] md:aspect-[16/7] overflow-hidden bg-[#0b1c30]">
          <img 
            src={car.mainImageUrl} 
            alt={car.modelName} 
            className="w-full h-full object-cover opacity-80" 
            referrerPolicy="no-referrer" 
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-white fill-current ml-1" />
            </div>
          </div>
          <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Aero Performance Series</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Disponible ahora</span>
          </div>
        </div>

        <div className="px-6 pt-8 space-y-8">
          {/* Title & Price */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#727687] uppercase tracking-widest">{car.year} EDICIÓN</span>
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">{car.brandName} {car.modelName}</h1>
            <p className="text-[#424656] text-sm">{car.description.split('.')[0]}.</p>
            <div className="pt-4">
              <p className="text-4xl font-black text-[#006646] tracking-tight">{formatPrice(car.price)}</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff4ff] rounded-full text-[#0050cb] text-[10px] font-bold uppercase border border-[#dce9ff]">
              <CheckCircle2 className="w-3 h-3" />
              Papeles al día
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff4ff] rounded-full text-[#0050cb] text-[10px] font-bold uppercase border border-[#dce9ff]">
              <CheckCircle2 className="w-3 h-3" />
              Único dueño
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff4ff] rounded-full text-[#0050cb] text-[10px] font-bold uppercase border border-[#dce9ff]">
              <CheckCircle2 className="w-3 h-3" />
              Peritado
            </div>
          </div>

          {/* Technical Specs */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-[#727687] uppercase tracking-[0.2em]">Especificaciones Técnicas</h3>
            <div className="grid grid-cols-3 gap-y-8">
              <div className="space-y-1">
                <Gauge className="w-5 h-5 text-[#0050cb]" />
                <p className="text-[10px] font-bold text-[#727687] uppercase">Kilometraje</p>
                <p className="text-sm font-black">{car.mileage.toLocaleString()} KM</p>
              </div>
              <div className="space-y-1">
                <Settings2 className="w-5 h-5 text-[#0050cb]" />
                <p className="text-[10px] font-bold text-[#727687] uppercase">Motor</p>
                <p className="text-sm font-black">{car.engine || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <Settings2 className="w-5 h-5 text-[#0050cb]" />
                <p className="text-[10px] font-bold text-[#727687] uppercase">Caja</p>
                <p className="text-sm font-black">{car.transmission}</p>
              </div>
              <div className="space-y-1">
                <Fuel className="w-5 h-5 text-[#0050cb]" />
                <p className="text-[10px] font-bold text-[#727687] uppercase">Combustible</p>
                <p className="text-sm font-black">{car.fuelType}</p>
              </div>
              <div className="space-y-1">
                <Palette className="w-5 h-5 text-[#0050cb]" />
                <p className="text-[10px] font-bold text-[#727687] uppercase">Color</p>
                <p className="text-sm font-black">{car.color || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <DoorOpen className="w-5 h-5 text-[#0050cb]" />
                <p className="text-[10px] font-bold text-[#727687] uppercase">Puertas</p>
                <p className="text-sm font-black">{car.doors || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Financial Solutions */}
          <div className="p-8 bg-[#f0f5ff] rounded-[2rem] space-y-6">
            <h3 className="text-xl font-black tracking-tighter">Soluciones Financieras</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Wallet className="w-6 h-6 text-[#0050cb]" />
                </div>
                <div>
                  <p className="font-bold text-sm">Aceptamos tu usado</p>
                  <p className="text-xs text-[#727687]">Cotización inmediata al mejor precio.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Calendar className="w-6 h-6 text-[#0050cb]" />
                </div>
                <div>
                  <p className="font-bold text-sm">Cuotas fijas</p>
                  <p className="text-xs text-[#727687]">Planes en pesos o dólares sin sorpresas.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Building2 className="w-6 h-6 text-[#0050cb]" />
                </div>
                <div>
                  <p className="font-bold text-sm">Créditos prendarios</p>
                  <p className="text-xs text-[#727687]">Aprobación en 24hs con mínimos requisitos.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-[#727687] uppercase tracking-[0.2em]">Descripción</h3>
            <p className="text-[#424656] leading-relaxed text-sm">{car.description}</p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5eeff] p-4 z-[110]">
        <div className="max-w-4xl mx-auto flex gap-3">
          <button className="flex-grow py-4 bg-[#0050cb] text-white rounded-2xl font-bold text-sm tracking-tight active:scale-[0.98] transition-all">
            Consultar por este auto
          </button>
          <button className="w-14 h-14 bg-[#25d366] text-white rounded-2xl flex items-center justify-center active:scale-[0.98] transition-all">
            <MessageCircle className="w-6 h-6 fill-current" />
          </button>
        </div>
        <div className="max-w-4xl mx-auto mt-3">
          <button className="w-full py-4 bg-[#eff4ff] text-[#0050cb] rounded-2xl font-bold text-sm tracking-tight flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
            <CreditCard className="w-4 h-4" />
            Señar este auto
          </button>
        </div>
      </div>

      {/* Mini Sticky Price Bar (Desktop/Scroll) */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-[#0b1c30] text-white py-4 px-8 z-[120]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{car.brandName} {car.modelName}</p>
            <p className="text-xl font-black">{formatPrice(car.price)}</p>
          </div>
          <button className="px-8 py-3 bg-[#25d366] text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#20bd5a] transition-colors">
            <MessageCircle className="w-5 h-5 fill-current" />
            WhatsApp
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function AdminDashboardView({ onBack }: { onBack: () => void }) {
  const [stats, setStats] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/stats").then(res => res.json()).then(setStats);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-[#0050cb] font-bold hover:underline">
          <ChevronRight className="w-5 h-5 rotate-180" />
          Volver a vista pública
        </button>
        <button 
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-[#0050cb] text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          Agregar Nuevo Vehículo
        </button>
      </div>

      <h2 className="text-4xl font-black tracking-tighter uppercase">Panel de Administración</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-[#e5eeff] shadow-sm">
          <span className="text-[10px] font-bold text-[#727687] uppercase tracking-widest">Stock Total</span>
          <p className="text-4xl font-black mt-2">{stats?.totalStock || 0}</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-[#e5eeff] shadow-sm">
          <span className="text-[10px] font-bold text-[#727687] uppercase tracking-widest">Disponibles</span>
          <p className="text-4xl font-black mt-2 text-[#006646]">{stats?.available || 0}</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-[#e5eeff] shadow-sm">
          <span className="text-[10px] font-bold text-[#727687] uppercase tracking-widest">Reservados</span>
          <p className="text-4xl font-black mt-2 text-orange-600">{stats?.reserved || 0}</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-[#e5eeff] shadow-sm">
          <span className="text-[10px] font-bold text-[#727687] uppercase tracking-widest">Consultas Diarias</span>
          <p className="text-4xl font-black mt-2">{stats?.recentInquiries || 0}</p>
        </div>
      </div>

      {showAddForm && <AddCarForm onClose={() => setShowAddForm(false)} />}
    </motion.div>
  );
}

function AddCarForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    modelId: 1,
    year: 2024,
    price: 0,
    mileage: 0,
    transmission: "Automática",
    fuelType: "Nafta",
    mainImageUrl: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    onClose();
    window.location.reload(); // Refresh to see new car
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-10 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black tracking-tighter uppercase">Agregar Nuevo Vehículo</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#f8f9ff] rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#727687]">Año</label>
              <input 
                type="number" 
                className="w-full p-4 rounded-xl bg-[#f8f9ff] border-none focus:ring-2 focus:ring-[#0050cb]"
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#727687]">Precio (USD)</label>
              <input 
                type="number" 
                className="w-full p-4 rounded-xl bg-[#f8f9ff] border-none focus:ring-2 focus:ring-[#0050cb]"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#727687]">Kilometraje (KM)</label>
              <input 
                type="number" 
                className="w-full p-4 rounded-xl bg-[#f8f9ff] border-none focus:ring-2 focus:ring-[#0050cb]"
                value={formData.mileage}
                onChange={e => setFormData({ ...formData, mileage: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#727687]">Transmisión</label>
              <select 
                className="w-full p-4 rounded-xl bg-[#f8f9ff] border-none focus:ring-2 focus:ring-[#0050cb]"
                value={formData.transmission}
                onChange={e => setFormData({ ...formData, transmission: e.target.value })}
              >
                <option>Automática</option>
                <option>Manual</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#727687]">URL de Imagen</label>
            <input 
              type="text" 
              className="w-full p-4 rounded-xl bg-[#f8f9ff] border-none focus:ring-2 focus:ring-[#0050cb]"
              placeholder="https://..."
              value={formData.mainImageUrl}
              onChange={e => setFormData({ ...formData, mainImageUrl: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#727687]">Descripción</label>
            <textarea 
              className="w-full p-4 rounded-xl bg-[#f8f9ff] border-none focus:ring-2 focus:ring-[#0050cb] h-32"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button type="submit" className="w-full py-5 bg-[#0050cb] text-white rounded-2xl font-bold text-lg tracking-tight shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all">
            Guardar Vehículo
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function AppraisalWizardView({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ year: 2020, mileage: 50000, brand: "Porsche" });
  const [result, setResult] = useState<number | null>(null);

  const handleAppraise = async () => {
    const res = await fetch("/api/appraisal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    setResult(data.estimatedValue);
    setStep(2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto py-10"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-[#0050cb] font-bold mb-8 hover:underline">
        <ChevronRight className="w-5 h-5 rotate-180" />
        Volver al catálogo
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 border border-[#e5eeff]">
        {step === 1 ? (
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#0050cb] uppercase tracking-widest">Cotización Instantánea</span>
              <h2 className="text-4xl font-black tracking-tighter uppercase">¿Cuánto vale tu auto?</h2>
              <p className="text-[#727687]">Obtené un estimado en tiempo real basado en datos del mercado.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#727687]">Marca</label>
                <select 
                  className="w-full p-4 rounded-xl bg-[#f8f9ff] border-none focus:ring-2 focus:ring-[#0050cb]"
                  value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                >
                  <option>Porsche</option>
                  <option>BMW</option>
                  <option>Mercedes-Benz</option>
                  <option>Audi</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#727687]">Año</label>
                  <input 
                    type="number" 
                    className="w-full p-4 rounded-xl bg-[#f8f9ff] border-none focus:ring-2 focus:ring-[#0050cb]"
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#727687]">Kilometraje (KM)</label>
                  <input 
                    type="number" 
                    className="w-full p-4 rounded-xl bg-[#f8f9ff] border-none focus:ring-2 focus:ring-[#0050cb]"
                    value={formData.mileage}
                    onChange={e => setFormData({ ...formData, mileage: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleAppraise}
              className="w-full py-5 bg-[#0050cb] text-white rounded-2xl font-bold text-lg tracking-tight shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
            >
              Obtener Cotización
            </button>
          </div>
        ) : (
          <div className="text-center space-y-8 py-10">
            <div className="w-24 h-24 bg-[#e1ffec] rounded-full flex items-center justify-center mx-auto mb-6">
              <Gauge className="w-10 h-10 text-[#006646]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tighter uppercase">Valor Estimado</h3>
              <p className="text-6xl font-black text-[#006646] tracking-tight">{formatPrice(result || 0)}</p>
            </div>
            <p className="text-[#727687] max-w-sm mx-auto">
              Este es un estimado basado en el mercado. Traé tu auto para una inspección final y obtener una oferta firme.
            </p>
            <button 
              onClick={() => setStep(1)}
              className="text-[#0050cb] font-bold hover:underline"
            >
              Empezar de nuevo
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
