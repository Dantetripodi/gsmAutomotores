import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Raíz del proyecto (carpeta donde está package.json y server.ts).
 * No usar solo process.cwd(): al ejecutar desde otra carpeta el JSON
 * se guardaba en otro lado y parecía "perderse" al reiniciar.
 */
export const RAIZ_PROYECTO = path.resolve(__dirname, "..");

/**
 * Carpeta de persistencia. Override con DATA_DIR (ruta absoluta recomendada).
 */
export function obtenerDirectorioDatos(): string {
  if (process.env.DATA_DIR?.trim()) {
    return path.resolve(process.env.DATA_DIR.trim());
  }
  return path.join(RAIZ_PROYECTO, "data");
}
