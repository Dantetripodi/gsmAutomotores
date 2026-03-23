import { v2 as cloudinary } from "cloudinary";

type ResultadoSubida = {
  secureUrl: string;
};

let configurado = false;

function asegurarConfig() {
  if (configurado) return;
  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (cloudinaryUrl) {
    cloudinary.config({
      cloudinary_url: cloudinaryUrl,
      secure: true,
    });
    configurado = true;
    return;
  }
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Faltan variables de Cloudinary (CLOUDINARY_URL o CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET).");
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  configurado = true;
}

export class CloudinaryServicio {
  async subirImagenDataUrl(dataUrl: string): Promise<ResultadoSubida> {
    asegurarConfig();
    const carpeta = process.env.CLOUDINARY_FOLDER?.trim() || "gsm-autos";
    const subida = await cloudinary.uploader.upload(dataUrl, {
      folder: carpeta,
      resource_type: "image",
    });
    const secureUrl = subida.secure_url?.trim();
    if (!secureUrl) throw new Error("Cloudinary no devolvió URL.");
    return { secureUrl };
  }
}
