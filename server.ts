import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import { createServer as crearServidorVite } from "vite";
import { crearApp } from "./server/app";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const PUERTO = 3000;

async function iniciar() {
  const app = await crearApp();

  if (process.env.NODE_ENV !== "production") {
    // En desarrollo: Vite sirve el frontend con HMR
    const vite = await crearServidorVite({
      server: { middlewareMode: true, hmr: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // En producción: sirve el build estático
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PUERTO, "0.0.0.0", () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
  });
}

iniciar();
