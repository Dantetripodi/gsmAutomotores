import type { DashboardStats } from "../types";
import { urlApi } from "./http";

class DashboardServicio {
  async obtenerEstadisticas(): Promise<DashboardStats> {
    const res = await fetch(urlApi("/api/dashboard/stats"));
    if (!res.ok) throw new Error("No se pudieron cargar las estadísticas");
    return res.json();
  }
}

export const dashboardServicio = new DashboardServicio();
