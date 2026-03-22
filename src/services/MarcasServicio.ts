import type { Brand } from "../types";
import { urlApi } from "./http";

class MarcasServicio {
  async obtenerMarcas(): Promise<Brand[]> {
    const res = await fetch(urlApi("/api/brands"));
    if (!res.ok) throw new Error("No se pudieron cargar las marcas");
    return res.json();
  }
}

export const marcasServicio = new MarcasServicio();
