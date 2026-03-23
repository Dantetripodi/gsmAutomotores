import { Router } from "express";

const HOSTS_PERMITIDOS = new Set([
  "drive.google.com",
  "images.unsplash.com",
  "lh3.googleusercontent.com",
]);

const MAX_BYTES = 16 * 1024 * 1024;

function hostPermitido(hostname: string): boolean {
  if (HOSTS_PERMITIDOS.has(hostname)) return true;
  return hostname.endsWith(".googleusercontent.com");
}

/**
 * Sirve imágenes externas (Drive, etc.) desde el mismo origen para evitar bloqueos en el navegador.
 */
export function crearImageProxyRouter(): Router {
  const router = Router();

  router.get("/image-proxy", async (req, res, next) => {
    try {
      const raw = typeof req.query.url === "string" ? req.query.url : "";
      if (!raw.trim()) {
        res.status(400).end();
        return;
      }
      let target: string;
      try {
        target = decodeURIComponent(raw);
      } catch {
        res.status(400).end();
        return;
      }
      let u: URL;
      try {
        u = new URL(target);
      } catch {
        res.status(400).end();
        return;
      }
      if (u.protocol !== "https:") {
        res.status(403).end();
        return;
      }
      if (!hostPermitido(u.hostname)) {
        res.status(403).end();
        return;
      }

      const r = await fetch(target, {
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        },
      });
      if (!r.ok) {
        res.status(502).end();
        return;
      }
      const ct = r.headers.get("content-type") || "";
      if (!ct.startsWith("image/")) {
        res.status(400).end();
        return;
      }
      const ab = await r.arrayBuffer();
      if (ab.byteLength > MAX_BYTES) {
        res.status(413).end();
        return;
      }
      res.setHeader("Content-Type", ct);
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(Buffer.from(ab));
    } catch (e) {
      next(e);
    }
  });

  return router;
}
