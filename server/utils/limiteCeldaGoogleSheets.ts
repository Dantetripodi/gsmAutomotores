import type { CrearAutoDTO } from "../tipos";

/** Límite real de Google Sheets: 50.000; dejamos margen. */
export const MAX_CARACTERES_CELDA_GOOGLE_SHEETS = 48_000;

const MSG_LIMITE =
  "Google Sheets admite como máximo 50.000 caracteres por celda. " +
  "Las fotos subidas desde tu PC se guardan como texto muy largo (base64). " +
  "Usá enlaces https:// a las imágenes (por ejemplo subidas a Drive, Imgur, etc.) " +
  "o fotos más livianas.";

export function validarCrearAutoParaSheets(datos: CrearAutoDTO): string | null {
  const max = MAX_CARACTERES_CELDA_GOOGLE_SHEETS;
  if (datos.mainImageUrl && datos.mainImageUrl.length > max) return MSG_LIMITE;
  const extras = datos.imageUrls ?? [];
  for (const u of extras) {
    if (u.length > max) return MSG_LIMITE;
  }
  const celdaExtras = extras.join("|");
  if (celdaExtras.length > max) {
    return (
      MSG_LIMITE +
      " Además, la suma de todas las URLs extra no puede superar el límite en una sola celda: usá menos fotos o enlaces más cortos."
    );
  }
  return null;
}
