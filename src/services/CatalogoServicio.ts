import type { Car, CarStatus } from "../types";
import { urlApi, encabezadosAuth } from "./http";

export type ConsultaCatalogo = {
  brand?: string;
  price_max?: number;
};

export type CrearAutoPayload = {
  brandName: string;
  modelName: string;
  versionName?: string;
  year: number;
  price: number;
  currency: "ARS" | "USD";
  mileage: number;
  transmission: string;
  fuelType: string;
  condition: "0km" | "usado";
  description: string;
  mainImageUrl?: string;
  engine?: string;
  color?: string;
  doors?: string;
};

class CatalogoServicio {
  async obtenerCatalogo(params?: ConsultaCatalogo): Promise<Car[]> {
    const qs = new URLSearchParams();
    if (params?.brand) qs.set("brand", params.brand);
    if (params?.price_max != null) qs.set("price_max", String(params.price_max));
    const res = await fetch(urlApi(`/api/catalog?${qs}`));
    if (!res.ok) throw new Error("No se pudo cargar el catálogo");
    return res.json();
  }

  async obtenerPorId(id: number): Promise<Car> {
    const res = await fetch(urlApi(`/api/catalog/${id}`));
    if (!res.ok) throw new Error("Vehículo no encontrado");
    return res.json();
  }

  async obtenerPorMarca(slugMarca: string): Promise<Car[]> {
    const qs = new URLSearchParams({ brand: slugMarca });
    const res = await fetch(urlApi(`/api/catalog?${qs}`));
    if (!res.ok) throw new Error("No se pudo cargar el catálogo");
    return res.json();
  }

  async crear(payload: CrearAutoPayload, token: string): Promise<Car> {
    const res = await fetch(urlApi("/api/catalog"), {
      method: "POST",
      headers: encabezadosAuth(token),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("No se pudo crear el vehículo");
    return res.json();
  }

  async actualizarEstado(id: number, estado: CarStatus, token: string): Promise<Car> {
    const res = await fetch(urlApi(`/api/catalog/${id}/status`), {
      method: "PATCH",
      headers: encabezadosAuth(token),
      body: JSON.stringify({ status: estado }),
    });
    if (!res.ok) throw new Error("No se pudo actualizar el estado");
    return res.json();
  }

  async eliminar(id: number, token: string): Promise<void> {
    const res = await fetch(urlApi(`/api/catalog/${id}`), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("No se pudo eliminar el vehículo");
  }
}

export const catalogoServicio = new CatalogoServicio();
