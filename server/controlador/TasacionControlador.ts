import { Router } from "express";

export function crearTasacionRouter(): Router {
  const router = Router();

  router.post("/", (req, res) => {
    const { year, mileage } = req.body as { year?: number; mileage?: number };
    const anio = Number(year) || 2015;
    const kilometraje = Number(mileage) || 0;

    const base = 50_000;
    const factorAnio = (anio - 2010) * 2_000;
    const factorKm = (kilometraje / 1_000) * 100;
    const valorEstimado = Math.max(5_000, base + factorAnio - factorKm);

    res.json({ estimatedValue: valorEstimado });
  });

  return router;
}
