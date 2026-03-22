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
