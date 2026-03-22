import { Router } from "express";
import type { AutoRepositorio } from "../repositorio/AutoRepositorio";

// Las marcas se derivan dinámicamente del catálogo,
// por eso no tienen repositorio propio.
export function crearMarcasRouter(repositorio: AutoRepositorio): Router {
  const router = Router();

  router.get("/", (req, res) => {
    res.json(repositorio.obtenerMarcas());
  });

  return router;
}
