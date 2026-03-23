import { Router } from "express";
import { google } from "googleapis";

const RE_DRIVE_FILE_ID =
  /\/d\/([a-zA-Z0-9_-]+)|thumbnail\?[^#]*\bid=([a-zA-Z0-9_-]+)|[?&]id=([a-zA-Z0-9_-]+)/i;

const HOSTS_GENERICO = new Set([
  "images.unsplash.com",
  "lh3.googleusercontent.com",
]);

const MAX_BYTES = 20 * 1024 * 1024;

function extraerDriveFileId(url: string): string | null {
  const m = url.match(RE_DRIVE_FILE_ID);
  const id = m?.[1] ?? m?.[2] ?? m?.[3] ?? null;
  return id;
}

function crearDriveAuth() {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64?.trim();
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  let credentials: object | null = null;
  if (b64) {
    try {
      credentials = JSON.parse(Buffer.from(b64, "base64").toString("utf8")) as object;
    } catch {
      /* ignore */
    }
  } else if (raw) {
    try {
      credentials = JSON.parse(raw) as object;
    } catch {
      /* ignore */
    }
  }
  if (!credentials) return null;
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
}

const driveAuth = crearDriveAuth();

/**
 * Proxy de imágenes: usa la API de Drive (service account) para archivos de Drive
 * y fetch genérico para otros hosts permitidos.
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

      const esDrive =
        u.hostname === "drive.google.com" || u.hostname.endsWith(".googleusercontent.com");

      // ── Ruta 1: Drive con service account (más fiable desde servidores cloud) ──
      if (esDrive && driveAuth) {
        const fileId = extraerDriveFileId(target);
        if (fileId) {
          try {
            const drive = google.drive({ version: "v3", auth: driveAuth });
            const r = await drive.files.get(
              { fileId, alt: "media" },
              { responseType: "stream" }
            );
            const ct = String(
              (r.headers as Record<string, string>)["content-type"] ?? "image/jpeg"
            );
            res.setHeader("Content-Type", ct.startsWith("image/") ? ct : "image/jpeg");
            res.setHeader("Cache-Control", "public, max-age=86400");
            (r.data as NodeJS.ReadableStream).pipe(res);
            return;
          } catch (err) {
            console.error("[image-proxy] Drive API:", err instanceof Error ? err.message : err);
            // Si falla la API, intenta con fetch genérico de todas formas
          }
        }
      }

      // ── Ruta 2: fetch genérico (Unsplash, lh3, Drive sin ID extraíble) ──
      if (!esDrive && !HOSTS_GENERICO.has(u.hostname)) {
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

      const ct = r.headers.get("content-type") ?? "";
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
