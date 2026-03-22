import { Router, type RequestHandler } from "express";
import type { AutoRepositorio } from "../repositorio/AutoRepositorio";
import type { CrearAutoDTO, EstadoAuto } from "../tipos";

const ESTADOS_VALIDOS: EstadoAuto[] = ["available", "reserved", "sold"];

export function crearCatalogoRouter(
  repositorio: AutoRepositorio,
  requireAuth: RequestHandler
): Router {
  const router = Router();

  router.get("/", (req, res) => {
    const { brand, price_max } = req.query;
    const autos = repositorio.filtrar({
      marca: brand as string | undefined,
      precioMaximo: price_max ? Number(price_max) : undefined,
    });
    res.json(autos);
  });

  router.get("/:id", (req, res) => {
    const auto = repositorio.obtenerPorId(Number(req.params.id));
    if (!auto) return res.status(404).json({ mensaje: "Vehículo no encontrado" });
    res.json(auto);
  });

  router.post("/", requireAuth, (req, res) => {
    const datos = req.body as CrearAutoDTO;
    if (!datos.brandName?.trim() || !datos.modelName?.trim()) {
      return res.status(400).json({ mensaje: "Marca y modelo son obligatorios" });
    }
    const nuevo = repositorio.crearAuto(datos);
    res.status(201).json(nuevo);
  });

  router.patch("/:id/status", requireAuth, (req, res) => {
    const { status } = req.body as { status?: EstadoAuto };
    if (!status || !ESTADOS_VALIDOS.includes(status)) {
      return res.status(400).json({ mensaje: `Estado inválido. Valores posibles: ${ESTADOS_VALIDOS.join(", ")}` });
    }
    const actualizado = repositorio.actualizarEstado(Number(req.params.id), status);
    if (!actualizado) return res.status(404).json({ mensaje: "Vehículo no encontrado" });
    res.json(actualizado);
  });

  router.delete("/:id", requireAuth, (req, res) => {
    const eliminado = repositorio.eliminar(Number(req.params.id));
    if (!eliminado) return res.status(404).json({ mensaje: "Vehículo no encontrado" });
    res.status(204).end();
  });

  return router;
}
