import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Car, CarCurrency } from "../types";

const RE_DRIVE_FILE_D = /https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
const RE_DRIVE_OPEN_ID = /https?:\/\/drive\.google\.com\/open\?[^#]*\bid=([a-zA-Z0-9_-]+)/;

/**
 * Convierte enlaces de la UI de Drive (página /view) en URL directa para usar en <img>.
 * El archivo debe estar compartido como "Cualquiera con el enlace".
 */
export function normalizarUrlImagenDrive(url: string): string {
  const t = url.trim();
  if (!t) return t;
  const mFile = t.match(RE_DRIVE_FILE_D);
  if (mFile) return `https://drive.google.com/uc?export=view&id=${mFile[1]}`;
  const mOpen = t.match(RE_DRIVE_OPEN_ID);
  if (mOpen) return `https://drive.google.com/uc?export=view&id=${mOpen[1]}`;
  return t;
}

/** Lista ordenada de todas las fotos del vehículo (portada primero). */
export function urlsImagenesAuto(car: Pick<Car, "mainImageUrl" | "imageUrls">): string[] {
  const principal = car.mainImageUrl?.trim();
  const extra = (car.imageUrls ?? []).map((u) => u?.trim()).filter(Boolean) as string[];
  let out: string[];
  if (extra.length === 0) out = principal ? [principal] : [];
  else if (!principal) out = extra;
  else out = [principal, ...extra.filter((u) => u !== principal)];
  return out.map(normalizarUrlImagenDrive);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: CarCurrency = "ARS") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace(/\s/g, " ");
}

export const WHATSAPP_BUSINESS_NUMBER = "5490000000000";

export function buildCarDetailTitle(car: Pick<Car, "brandName" | "modelName" | "versionName">) {
  const version = car.versionName?.trim();
  return [car.brandName, car.modelName, version].filter(Boolean).join(" ");
}

export function buildWhatsAppConsultMessage(car: Car) {
  const title = buildCarDetailTitle(car);
  const kmText = car.condition === "0km" ? "0 km" : `${car.mileage.toLocaleString("es-AR")} km`;
  return `Hola, consulto por ${title}. Año: ${car.year}. Kilometraje: ${kmText}.`;
}

export function whatsappConsultUrl(car: Car) {
  return `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(buildWhatsAppConsultMessage(car))}`;
}
