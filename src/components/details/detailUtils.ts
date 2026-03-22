import type { Car } from "../../types";

export function buildMetaLine(car: Car) {
  const parts: string[] = [];
  if (car.bodyType || car.segment) parts.push(car.bodyType || car.segment || "");
  if (car.condition === "0km") parts.push("0 km");
  else parts.push(`${car.year} · ${car.mileage.toLocaleString("es-AR")} km`);
  parts.push(car.fuelType);
  return parts.filter(Boolean).join(" | ");
}

export function mergeSpecSummary(car: Car): Record<string, string> {
  const summaryExtra: Record<string, string> = {
    ...(car.specSummary || {}),
  };
  const hasMotorKey = Object.keys(summaryExtra).some((k) => /motor|cilindrada/i.test(k));
  if (car.engine && !hasMotorKey) {
    summaryExtra["Motor"] = car.engine;
  }
  const hasTransKey = Object.keys(summaryExtra).some((k) => /transmis/i.test(k));
  if (car.transmission && !hasTransKey) {
    summaryExtra["Transmisión"] = car.transmission;
  }
  if (car.color && !summaryExtra["Color"]) {
    summaryExtra["Color"] = car.color;
  }
  if (car.doors && !summaryExtra["Puertas"]) {
    summaryExtra["Puertas"] = car.doors;
  }
  return summaryExtra;
}
