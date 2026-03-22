import { Router } from "express";
import type { AutoRepositorio } from "../repositorio/AutoRepositorio";

export function crearDashboardRouter(repositorio: AutoRepositorio): Router {
  const router = Router();

  router.get("/stats", (req, res) => {
    res.json(repositorio.obtenerEstadisticas());
  });

  return router;
}
