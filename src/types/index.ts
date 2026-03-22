export type AppView = "catalog" | "details" | "admin" | "appraisal";

export type CarStatus = "available" | "reserved" | "sold";
export type CarCurrency = "ARS" | "USD";

export interface DashboardStats {
  totalStock: number;
  available: number;
  reserved: number;
  sold: number;
  recentInquiries: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface Car {
  id: number;
  brandName: string;
  modelName: string;
  brandSlug: string;
  versionName?: string;
  year: number;
  price: number;
  currency: CarCurrency;
  mileage: number;
  transmission: string;
  fuelType: string;
  engine?: string;
  color?: string;
  doors?: string;
  status: CarStatus;
  mainImageUrl: string;
  description: string;
  segment?: string;
  bodyType?: string;
  condition?: "0km" | "usado";
  specSummary?: Record<string, string>;
  equipment?: Record<string, string>;
  otherFeatures?: Record<string, string>;
}
