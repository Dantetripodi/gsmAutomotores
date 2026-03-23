import { Router } from "express";
import type { IAutoRepositorio } from "../repositorio/IAutoRepositorio";

export function crearMarcasRouter(repositorio: IAutoRepositorio): Router {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      const marcas = await repositorio.obtenerMarcas();
      res.json(marcas);
    } catch (e) {
      next(e);
    }
  });

  return router;
}
