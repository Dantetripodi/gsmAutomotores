import { Router } from "express";
import type { IAutoRepositorio } from "../repositorio/IAutoRepositorio";

export function crearDashboardRouter(repositorio: IAutoRepositorio): Router {
  const router = Router();

  router.get("/stats", async (req, res, next) => {
    try {
      const stats = await repositorio.obtenerEstadisticas();
      res.json(stats);
    } catch (e) {
      next(e);
    }
  });

  return router;
}
