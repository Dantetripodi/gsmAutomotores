export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface Car {
  id: number;
  modelId: number;
  modelName: string;
  brandName: string;
  brandSlug: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  engine?: string;
  color?: string;
  doors?: string;
  status: "available" | "reserved" | "sold";
  mainImageUrl: string;
  description: string;
}
