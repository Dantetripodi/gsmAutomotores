/** Margen respecto al límite de 50.000 caracteres por celda en Google Sheets. */
export const MAX_DATA_URL_PORTADA = 45_000;
/** Fotos 2…N comparten una celda; ~7,8k c/u permite hasta ~6 extras bajo el límite de la hoja. */
export const MAX_DATA_URL_EXTRA = 7800;

/**
 * Convierte un archivo de imagen a JPEG en data URL, redimensionando y bajando calidad
 * hasta que el string quepa en `maxChars` (por defecto tope para portada en Sheets).
 */
export async function comprimirImagenArchivo(
  file: File,
  maxChars: number = MAX_DATA_URL_PORTADA
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo no es una imagen.");
  }
  const bmp = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bmp.close();
    throw new Error("No se pudo preparar la imagen.");
  }
  try {
    let maxEdge = 2048;
    while (maxEdge >= 180) {
      const scale = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height));
      const tw = Math.max(1, Math.round(bmp.width * scale));
      const th = Math.max(1, Math.round(bmp.height * scale));
      canvas.width = tw;
      canvas.height = th;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, tw, th);
      ctx.drawImage(bmp, 0, 0, tw, th);
      for (let q = 0.9; q >= 0.22; q -= 0.04) {
        const dataUrl = canvas.toDataURL("image/jpeg", q);
        if (dataUrl.length <= maxChars) return dataUrl;
      }
      maxEdge = Math.floor(maxEdge * 0.82);
    }
  } finally {
    bmp.close();
  }
  throw new Error(
    "La imagen sigue siendo demasiado grande para guardarla en Google Sheets. Subila a Drive, Imgur o similar y pegá el enlace https://."
  );
}
