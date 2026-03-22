import { urlApi } from "./http";

export type PayloadTasacion = {
  year: number;
  mileage: number;
  brand: string;
};

class TasacionServicio {
  async calcular(payload: PayloadTasacion): Promise<{ estimatedValue: number }> {
    const res = await fetch(urlApi("/api/appraisal"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("No se pudo calcular la tasación");
    return res.json();
  }
}

export const tasacionServicio = new TasacionServicio();
