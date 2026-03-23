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

export async function crearApp() {
  const app = express();
  app.use(express.json({ limit: "20mb" }));

  const authServicio = new AuthServicio();
  const autoRepositorio = await crearAutoRepositorio();
  const requireAuth = crearMiddlewareAuth(authServicio);

  app.use("/api/auth", crearAuthRouter(authServicio));
  app.use("/api/catalog", crearCatalogoRouter(autoRepositorio, requireAuth));
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
