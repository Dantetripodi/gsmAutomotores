export type EstadoAuto = "available" | "reserved" | "sold";
export type Moneda = "ARS" | "USD";

// Campos compatibles con el frontend (Car interface del cliente)
export interface Auto {
  id: number;
  brandName: string;
  modelName: string;
  versionName?: string;
  year: number;
  price: number;
  currency: Moneda;
  mileage: number;
  transmission: string;
  fuelType: string;
  engine?: string;
  color?: string;
  doors?: string;
  status: EstadoAuto;
  mainImageUrl: string;
  /** Fotos adicionales (la portada es siempre `mainImageUrl`). */
  imageUrls?: string[];
  description: string;
  segment?: string;
  bodyType?: string;
  condition?: "0km" | "usado";
  specSummary?: Record<string, string>;
  equipment?: Record<string, string>;
  otherFeatures?: Record<string, string>;
}

// Versión enriquecida con el slug de marca calculado (nunca se persiste)
export type AutoConSlug = Auto & { brandSlug: string };

/** Mismos campos editables que al crear; el servidor conserva `id` y `status` salvo lógica aparte. */
export type ActualizarAutoDTO = CrearAutoDTO;

// DTO para crear un auto nuevo
export interface CrearAutoDTO {
  brandName: string;
  modelName: string;
  versionName?: string;
  year: number;
  price: number;
  currency: Moneda;
  mileage: number;
  transmission: string;
  fuelType: string;
  condition: "0km" | "usado";
  description: string;
  mainImageUrl?: string;
  /** URLs extra (sin incluir la principal; la principal va en `mainImageUrl`). */
  imageUrls?: string[];
  engine?: string;
  color?: string;
  doors?: string;
}

export interface EstadisticasDashboard {
  totalStock: number;
  available: number;
  reserved: number;
  sold: number;
  recentInquiries: number;
}
