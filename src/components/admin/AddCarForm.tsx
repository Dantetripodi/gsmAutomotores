import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from "react";
import { motion } from "motion/react";
import { X, Upload, Trash2 } from "lucide-react";
import { catalogoServicio, marcasServicio, type CrearAutoPayload } from "../../services";
import { useAuth } from "../../context/AuthContext";
import type { Car, CarCurrency } from "../../types";
import { normalizarUrlImagenDrive, urlsImagenesAuto } from "../../lib/utils";
import {
  comprimirImagenArchivo,
  MAX_DATA_URL_EXTRA,
  MAX_DATA_URL_PORTADA,
} from "../../lib/comprimirImagenDataUrl";

type Props = {
  onClose: () => void;
  onSaved: () => void;
  /** Si viene definido, el formulario edita ese vehículo (PATCH). */
  carToEdit?: Car | null;
};

const CURRENT_YEAR = new Date().getFullYear();

export function AddCarForm({ onClose, onSaved, carToEdit = null }: Props) {
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [brandName, setBrandName] = useState("");
  const [modelName, setModelName] = useState("");
  const [currency, setCurrency] = useState<CarCurrency>("ARS");
  /** Orden: primera = portada, resto = carrusel */
  const [galeria, setGaleria] = useState<string[]>([]);
  const [urlsPegadas, setUrlsPegadas] = useState("");

  const [formData, setFormData] = useState({
    versionName: "",
    year: CURRENT_YEAR,
    price: 0,
    mileage: 0,
    transmission: "Manual",
    fuelType: "Nafta",
    condition: "usado" as "0km" | "usado",
    description: "",
    engine: "",
    color: "",
    doors: "4",
  });

  useEffect(() => {
    marcasServicio.obtenerMarcas().then((brands) => setBrandSuggestions(brands.map((b) => b.name)));
  }, []);

  useEffect(() => {
    if (!carToEdit) return;
    setBrandName(carToEdit.brandName);
    setModelName(carToEdit.modelName);
    setCurrency(carToEdit.currency);
    setGaleria(urlsImagenesAuto(carToEdit));
    setUrlsPegadas("");
    setFormData({
      versionName: carToEdit.versionName ?? "",
      year: carToEdit.year,
      price: carToEdit.price,
      mileage: carToEdit.mileage,
      transmission: carToEdit.transmission,
      fuelType: carToEdit.fuelType,
      condition: carToEdit.condition ?? "usado",
      description: carToEdit.description,
      engine: carToEdit.engine ?? "",
      color: carToEdit.color ?? "",
      doors: carToEdit.doors ?? "4",
    });
  }, [carToEdit?.id]);

  const handleArchivos = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const dataUrls: string[] = [];
    const lista: File[] = Array.from(files as FileList);
    for (const file of lista) {
      if (!file.type.startsWith("image/")) continue;
      const indiceGlobal = galeria.length + dataUrls.length;
      const tope = indiceGlobal === 0 ? MAX_DATA_URL_PORTADA : MAX_DATA_URL_EXTRA;
      try {
        dataUrls.push(await comprimirImagenArchivo(file, tope));
      } catch (err) {
        alert(err instanceof Error ? err.message : "No se pudo procesar una imagen.");
        e.target.value = "";
        return;
      }
    }
    if (dataUrls.length) setGaleria((prev) => [...prev, ...dataUrls]);
    e.target.value = "";
  };

  const urlsHttpsDesdeTexto = (texto: string) =>
    texto
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => /^https?:\/\//i.test(l))
      .map(normalizarUrlImagenDrive);

  const agregarUrlsDesdeTexto = () => {
    const lineas = urlsHttpsDesdeTexto(urlsPegadas);
    if (lineas.length) setGaleria((prev) => [...prev, ...lineas]);
    setUrlsPegadas("");
  };

  const quitarFoto = (indice: number) => {
    setGaleria((prev) => prev.filter((_, i) => i !== indice));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !brandName.trim() || !modelName.trim()) return;

    setSubmitting(true);
    const desdeCuadro = urlsHttpsDesdeTexto(urlsPegadas);
    const vistos = new Set<string>();
    const fotos = [...galeria.filter(Boolean), ...desdeCuadro]
      .map(normalizarUrlImagenDrive)
      .filter((u) => {
        if (vistos.has(u)) return false;
        vistos.add(u);
        return true;
      });
    const payload: CrearAutoPayload = {
      brandName: brandName.trim(),
      modelName: modelName.trim(),
      versionName: formData.versionName.trim() || undefined,
      year: formData.year,
      price: formData.price,
      currency,
      mileage: formData.mileage,
      transmission: formData.transmission,
      fuelType: formData.fuelType,
      condition: formData.condition,
      description: formData.description.trim() || "Sin descripción.",
      engine: formData.engine.trim() || undefined,
      color: formData.color.trim() || undefined,
      doors: formData.doors || undefined,
      mainImageUrl: fotos[0] ?? "",
      imageUrls: fotos.length > 1 ? fotos.slice(1) : [],
    };

    try {
      if (carToEdit) {
        await catalogoServicio.actualizar(carToEdit.id, payload, token);
      } else {
        await catalogoServicio.crear(payload, token);
      }
      onSaved();
    } catch (err) {
      alert(err instanceof Error ? err.message : "No se pudo guardar el vehículo.");
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "w-full p-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-[#b80c0c]/30 focus:outline-none text-sm min-h-[44px]";

  const setForm = (key: keyof typeof formData, value: string | number) =>
    setFormData((f) => ({ ...f, [key]: value }));

  return (
    <div
      role="presentation"
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 overflow-y-auto max-h-[92vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-neutral-900">
            {carToEdit ? "Editar vehículo" : "Agregar vehículo"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Marca - texto libre con sugerencias */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Marca <span className="text-[#b80c0c]">*</span>
              </label>
              <input
                list="brand-suggestions"
                className={field}
                placeholder="Ej. Toyota, Ford…"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
              />
              <datalist id="brand-suggestions">
                {brandSuggestions.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>

            {/* Modelo - texto libre */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Modelo <span className="text-[#b80c0c]">*</span>
              </label>
              <input
                type="text"
                className={field}
                placeholder="Ej. Corolla, Ranger…"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                required
              />
            </div>

            {/* Versión */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Versión (opcional)
              </label>
              <input
                type="text"
                className={field}
                placeholder="Ej. 1.6 XLS AT"
                value={formData.versionName}
                onChange={(e) => setForm("versionName", e.target.value)}
              />
            </div>

            {/* Precio + Moneda */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Precio <span className="text-[#b80c0c]">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  className="shrink-0 p-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-[#b80c0c]/30 focus:outline-none text-sm font-semibold min-h-[44px] bg-neutral-50"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CarCurrency)}
                >
                  <option value="ARS">$ ARS</option>
                  <option value="USD">U$S USD</option>
                </select>
                <input
                  type="number"
                  required
                  min={0}
                  className="flex-1 p-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-[#b80c0c]/30 focus:outline-none text-sm min-h-[44px]"
                  placeholder="0"
                  value={formData.price || ""}
                  onChange={(e) => setForm("price", Number(e.target.value))}
                />
              </div>
            </div>

            {/* Año */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Año</label>
              <input
                type="number"
                required
                min={1950}
                max={CURRENT_YEAR + 1}
                className={field}
                value={formData.year}
                onChange={(e) => setForm("year", Number(e.target.value))}
              />
            </div>

            {/* Estado inicial */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Estado del auto</label>
              <select
                className={field}
                value={formData.condition}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    condition: e.target.value as "0km" | "usado",
                    mileage: e.target.value === "0km" ? 0 : f.mileage,
                  }))
                }
              >
                <option value="usado">Usado</option>
                <option value="0km">0 km</option>
              </select>
            </div>

            {/* Kilometraje */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Kilometraje</label>
              <input
                type="number"
                min={0}
                className={field}
                value={formData.mileage}
                disabled={formData.condition === "0km"}
                onChange={(e) => setForm("mileage", Number(e.target.value))}
              />
            </div>

            {/* Transmisión */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Transmisión</label>
              <select className={field} value={formData.transmission} onChange={(e) => setForm("transmission", e.target.value)}>
                <option>Manual</option>
                <option>Automática</option>
                <option>Automática CVT</option>
              </select>
            </div>

            {/* Combustible */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Combustible</label>
              <select className={field} value={formData.fuelType} onChange={(e) => setForm("fuelType", e.target.value)}>
                <option>Nafta</option>
                <option>Diésel</option>
                <option>Eléctrico</option>
                <option>Híbrido</option>
              </select>
            </div>

            {/* Motor (opcional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Motor (opcional)</label>
              <input
                type="text"
                className={field}
                placeholder="Ej. 2.0 TFSI"
                value={formData.engine}
                onChange={(e) => setForm("engine", e.target.value)}
              />
            </div>

            {/* Color (opcional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Color (opcional)</label>
              <input
                type="text"
                className={field}
                placeholder="Ej. Rojo"
                value={formData.color}
                onChange={(e) => setForm("color", e.target.value)}
              />
            </div>
          </div>

          {/* Galería de fotos */}
          <div className="space-y-3 rounded-xl border border-neutral-200 p-4 bg-neutral-50">
            <p className="text-sm font-semibold text-neutral-900">Fotos del vehículo</p>
            <p className="text-xs text-neutral-600">
              La primera imagen es la portada. Podés subir varias desde la galería o pegar URLs (una por línea); también se guardan al pulsar «Guardar» aunque no hayas pulsado «Añadir URLs a la galería». Si quitás todas las fotos, en el catálogo se verá el bloque vacío (sin imagen).
            </p>
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Con Google Sheets el tamaño por celda es limitado: al subir archivos, la app{" "}
              <span className="font-medium">comprime automáticamente</span> la imagen. Si aun así falla, subí la foto a internet y pegá un enlace{" "}
              <span className="font-medium">https://</span>. En{" "}
              <span className="font-medium">Google Drive</span> podés pegar el enlace de la barra de direcciones (…/file/d/…/view); tiene que estar compartido como «Cualquiera con el enlace».
            </p>
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <label className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#b80c0c] text-white text-sm font-semibold cursor-pointer min-h-[44px] hover:bg-[#9a0a0a] transition-colors">
                <Upload className="w-4 h-4" />
                Subir imágenes
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleArchivos}
                />
              </label>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-500">URLs (una por línea)</label>
              <textarea
                className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:ring-2 focus:ring-[#b80c0c]/30 focus:outline-none text-sm min-h-[72px] font-mono text-xs"
                placeholder={"https://ejemplo.com/foto1.jpg\nhttps://ejemplo.com/foto2.jpg"}
                value={urlsPegadas}
                onChange={(e) => setUrlsPegadas(e.target.value)}
              />
              <button
                type="button"
                onClick={agregarUrlsDesdeTexto}
                className="text-sm font-semibold text-[#b80c0c] hover:underline"
              >
                Añadir URLs a la galería
              </button>
            </div>
            {galeria.length > 0 && (
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {galeria.map((src, idx) => (
                  <li key={`${idx}-${src.slice(0, 24)}`} className="relative group rounded-lg border border-neutral-200 overflow-hidden bg-neutral-100 aspect-[4/3]">
                    <img
                      src={normalizarUrlImagenDrive(src)}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy={
                        src.includes("drive.google.com") ? "strict-origin-when-cross-origin" : "no-referrer"
                      }
                    />
                    <span className="absolute top-1 left-1 text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded">
                      {idx === 0 ? "Portada" : idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => quitarFoto(idx)}
                      className="absolute bottom-1 right-1 p-1.5 rounded-full bg-black/55 text-white hover:bg-black/75"
                      aria-label="Quitar foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Descripción</label>
            <textarea
              className="w-full p-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-[#b80c0c]/30 focus:outline-none text-sm min-h-[100px]"
              value={formData.description}
              onChange={(e) => setForm("description", e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !brandName.trim() || !modelName.trim()}
            className="w-full py-3.5 bg-[#b80c0c] text-white rounded-lg font-semibold text-base min-h-[48px] hover:bg-[#9a0a0a] transition-colors disabled:opacity-50"
          >
            {submitting ? "Guardando…" : carToEdit ? "Guardar cambios" : "Guardar vehículo"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
