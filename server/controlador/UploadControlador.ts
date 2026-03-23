import { Router, type RequestHandler } from "express";
import { CloudinaryServicio } from "../servicio/CloudinaryServicio";

export function crearUploadRouter(requireAuth: RequestHandler): Router {
  const router = Router();
  const cloudinaryServicio = new CloudinaryServicio();

  router.post("/image", requireAuth, async (req, res, next) => {
    try {
      const { dataUrl } = req.body as { dataUrl?: string };
      if (!dataUrl?.startsWith("data:image/")) {
        return res.status(400).json({ mensaje: "Imagen inválida." });
      }
      const subida = await cloudinaryServicio.subirImagenDataUrl(dataUrl);
      res.json({ url: subida.secureUrl });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
