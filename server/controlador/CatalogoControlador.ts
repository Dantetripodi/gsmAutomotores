import { Router, type RequestHandler } from "express";
import type { IAutoRepositorio } from "../repositorio/IAutoRepositorio";
import type { CrearAutoDTO, EstadoAuto } from "../tipos";
import { validarCrearAutoParaSheets } from "../utils/limiteCeldaGoogleSheets";

const ESTADOS_VALIDOS: EstadoAuto[] = ["available", "reserved", "sold"];

export function crearCatalogoRouter(
  repositorio: IAutoRepositorio,
  requireAuth: RequestHandler
): Router {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      const { brand, price_max } = req.query;
      const autos = await repositorio.filtrar({
        marca: brand as string | undefined,
        precioMaximo: price_max ? Number(price_max) : undefined,
      });
      res.json(autos);
    } catch (e) {
      next(e);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const auto = await repositorio.obtenerPorId(Number(req.params.id));
      if (!auto) return res.status(404).json({ mensaje: "Vehículo no encontrado" });
      res.json(auto);
    } catch (e) {
      next(e);
    }
  });

  router.post("/", requireAuth, async (req, res, next) => {
    try {
      const datos = req.body as CrearAutoDTO;
      if (!datos.brandName?.trim() || !datos.modelName?.trim()) {
        return res.status(400).json({ mensaje: "Marca y modelo son obligatorios" });
      }
      if (process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim()) {
        const errSheets = validarCrearAutoParaSheets(datos);
        if (errSheets) return res.status(400).json({ mensaje: errSheets });
      }
      const nuevo = await repositorio.crearAuto(datos);
      res.status(201).json(nuevo);
    } catch (e) {
      next(e);
    }
  });

  router.patch("/:id/status", requireAuth, async (req, res, next) => {
    try {
      const { status } = req.body as { status?: EstadoAuto };
      if (!status || !ESTADOS_VALIDOS.includes(status)) {
        return res.status(400).json({ mensaje: `Estado inválido. Valores posibles: ${ESTADOS_VALIDOS.join(", ")}` });
      }
      const actualizado = await repositorio.actualizarEstado(Number(req.params.id), status);
      if (!actualizado) return res.status(404).json({ mensaje: "Vehículo no encontrado" });
      res.json(actualizado);
    } catch (e) {
      next(e);
    }
  });

  router.delete("/:id", requireAuth, async (req, res, next) => {
    try {
      const eliminado = await repositorio.eliminar(Number(req.params.id));
      if (!eliminado) return res.status(404).json({ mensaje: "Vehículo no encontrado" });
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  });

  return router;
}
