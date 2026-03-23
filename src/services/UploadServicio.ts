import { encabezadosAuth, urlApi } from "./http";

class UploadServicio {
  async subirImagen(dataUrl: string, token: string): Promise<string> {
    const res = await fetch(urlApi("/api/uploads/image"), {
      method: "POST",
      headers: encabezadosAuth(token),
      body: JSON.stringify({ dataUrl }),
    });
    if (!res.ok) {
      let mensaje = "No se pudo subir la imagen.";
      try {
        const j = (await res.json()) as { mensaje?: string };
        if (j.mensaje) mensaje = j.mensaje;
      } catch {
        /* ignore */
      }
      throw new Error(mensaje);
    }
    const j = (await res.json()) as { url: string };
    return j.url;
  }
}

export const uploadServicio = new UploadServicio();
