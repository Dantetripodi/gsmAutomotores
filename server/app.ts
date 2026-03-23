import path from "path";
import express from "express";
import { obtenerDirectorioDatos } from "./rutas";
import { AuthServicio } from "./servicio/AuthServicio";
import { crearAutoRepositorio } from "./repositorio/crearAutoRepositorio";
import { crearMiddlewareAuth } from "./middleware/autenticacion";
import { crearAuthRouter } from "./controlador/AuthControlador";
import { crearCatalogoRouter } from "./controlador/CatalogoControlador";
import { crearMarcasRouter } from "./controlador/MarcasControlador";
import { crearDashboardRouter } from "./controlador/DashboardControlador";
import { crearTasacionRouter } from "./controlador/TasacionControlador";
import { crearUploadRouter } from "./controlador/UploadControlador";

export async function crearApp() {
  const app = express();
  const corsOrigen = process.env.CORS_ORIGIN?.trim();
  if (corsOrigen) {
    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", corsOrigen);
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
      }
      next();
    });
  }
  app.use(express.json({ limit: "20mb" }));

  // Evita que el navegador cachee las respuestas del API (causa 304 con datos viejos)
  app.use("/api", (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
  });

  const authServicio = new AuthServicio();
  const autoRepositorio = await crearAutoRepositorio();
  const requireAuth = crearMiddlewareAuth(authServicio);

  app.use("/api/auth", crearAuthRouter(authServicio));
  app.use("/api/catalog", crearCatalogoRouter(autoRepositorio, requireAuth));
  app.use("/api/uploads", crearUploadRouter(requireAuth));
  app.use("/api/brands", crearMarcasRouter(autoRepositorio));
  app.use("/api/dashboard", crearDashboardRouter(autoRepositorio));
  app.use("/api/appraisal", crearTasacionRouter());

  const rutaAutos = path.join(obtenerDirectorioDatos(), "autos.json");
  const modo = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim()
    ? `Google Sheets (${process.env.GOOGLE_SHEETS_SPREADSHEET_ID})`
    : `archivo JSON: ${rutaAutos}`;
  console.log(`[Persistencia] Catálogo: ${modo}`);

  return app;
}
