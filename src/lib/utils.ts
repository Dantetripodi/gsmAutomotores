import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { URL_API_BASE } from "../config/env";
import type { Car, CarCurrency } from "../types";

const RE_DRIVE_FILE_D = /https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i;
const RE_DRIVE_OPEN_ID = /https?:\/\/drive\.google\.com\/open\?[^#]*\bid=([a-zA-Z0-9_-]+)/i;

function driveIdAWsrv(fileId: string): string {
  const thumb = `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
  return `https://wsrv.nl/?url=${encodeURIComponent(thumb)}&output=jpg&n=-1`;
}

/**
 * Convierte enlaces de Google Drive en URLs de wsrv.nl (CDN proxy público).
 * wsrv.nl accede a Drive desde el browser sin los bloqueos de IPs cloud.
 * El archivo debe estar compartido: "Cualquiera con el enlace" (lector).
 */
export function normalizarUrlImagenDrive(url: string): string {
  const t = url.trim();
  if (!t || t.includes("wsrv.nl")) return t;
  const mFile = t.match(RE_DRIVE_FILE_D);
  if (mFile) return driveIdAWsrv(mFile[1]);
  const mOpen = t.match(RE_DRIVE_OPEN_ID);
  if (mOpen) return driveIdAWsrv(mOpen[1]);
  if (t.includes("drive.google.com")) {
    const id = t.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (id) return driveIdAWsrv(id[1]);
  }
  return t;
}

/**
 * Usa el proxy del mismo servidor para URLs que suelen fallar en <img> (Drive, etc.).
 */
export function urlParaMostrarImagen(url: string): string {
  const t = url.trim();
  if (!t) return t;
  if (t.startsWith("data:") || t.startsWith("blob:")) return t;
  if (t.includes("/api/image-proxy")) return t;
  const n = normalizarUrlImagenDrive(t);
  try {
    const u = new URL(n);
    const host = u.hostname;
    // wsrv.nl y otras URLs directas no necesitan proxy
    const usarProxy = host.endsWith(".googleusercontent.com");
    if (!usarProxy) return n;
    const path = `/api/image-proxy?url=${encodeURIComponent(n)}`;
    if (URL_API_BASE) return `${URL_API_BASE.replace(/\/$/, "")}${path}`;
    return path;
  } catch {
    return n;
  }
}

/** Lista ordenada de todas las fotos del vehículo (portada primero). */
export function urlsImagenesAuto(car: Pick<Car, "mainImageUrl" | "imageUrls">): string[] {
  const principal = car.mainImageUrl?.trim();
  const extra = (car.imageUrls ?? []).map((u) => u?.trim()).filter(Boolean) as string[];
  let out: string[];
  if (extra.length === 0) out = principal ? [principal] : [];
  else if (!principal) out = extra;
  else out = [principal, ...extra.filter((u) => u !== principal)];
  return out.map(urlParaMostrarImagen);
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
