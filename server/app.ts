import path from "path";
import express from "express";
import { obtenerDirectorioDatos } from "./rutas";
import { AuthServicio } from "./servicio/AuthServicio";
import { AutoRepositorio } from "./repositorio/AutoRepositorio";
import { crearMiddlewareAuth } from "./middleware/autenticacion";
import { crearAuthRouter } from "./controlador/AuthControlador";
import { crearCatalogoRouter } from "./controlador/CatalogoControlador";
import { crearMarcasRouter } from "./controlador/MarcasControlador";
import { crearDashboardRouter } from "./controlador/DashboardControlador";
import { crearTasacionRouter } from "./controlador/TasacionControlador";

/**
 * Crea y configura la aplicación Express con todas las rutas de la API.
 * Inyecta las dependencias: repositorios y servicios.
 */
export function crearApp() {
  const app = express();
  app.use(express.json({ limit: "20mb" }));

  // Instancias únicas compartidas por todos los controladores
  const authServicio = new AuthServicio();
  const autoRepositorio = new AutoRepositorio();
  const requireAuth = crearMiddlewareAuth(authServicio);

  // Registro de rutas
  app.use("/api/auth", crearAuthRouter(authServicio));
  app.use("/api/catalog", crearCatalogoRouter(autoRepositorio, requireAuth));
  app.use("/api/brands", crearMarcasRouter(autoRepositorio));
  app.use("/api/dashboard", crearDashboardRouter(autoRepositorio));
  app.use("/api/appraisal", crearTasacionRouter());

  const rutaAutos = path.join(obtenerDirectorioDatos(), "autos.json");
  console.log(`[Persistencia] Catálogo guardado en: ${rutaAutos}`);

  return app;
}
