import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Car, CarCurrency } from "../types";

/** Lista ordenada de todas las fotos del vehículo (portada primero). */
export function urlsImagenesAuto(car: Pick<Car, "mainImageUrl" | "imageUrls">): string[] {
  const principal = car.mainImageUrl?.trim();
  const extra = (car.imageUrls ?? []).map((u) => u?.trim()).filter(Boolean) as string[];
  let out: string[];
  if (extra.length === 0) out = principal ? [principal] : [];
  else if (!principal) out = extra;
  else out = [principal, ...extra.filter((u) => u !== principal)];
  return out;
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
