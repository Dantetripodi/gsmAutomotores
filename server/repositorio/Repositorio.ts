import fs from "fs";
import path from "path";
import { obtenerDirectorioDatos } from "../rutas";

/**
 * Repositorio genérico con persistencia en archivo JSON.
 * Todas las entidades deben tener un campo `id: number`.
 *
 * Inspirado en el patrón Repositorio del proyecto algo-que-pedir-backend.
 */
export abstract class Repositorio<T extends { id: number }> {
  protected entidades: T[];
  private readonly rutaArchivo: string;

  constructor(nombreArchivo: string, semilla: T[]) {
    this.rutaArchivo = path.join(obtenerDirectorioDatos(), nombreArchivo);
    this.entidades = this.cargarDesdeArchivo(semilla);
  }

  private cargarDesdeArchivo(semilla: T[]): T[] {
    try {
      if (fs.existsSync(this.rutaArchivo)) {
        const contenido = fs.readFileSync(this.rutaArchivo, "utf-8");
        return JSON.parse(contenido) as T[];
      }
    } catch {
      console.warn(`[Repositorio] No se pudo leer "${this.rutaArchivo}". Usando datos iniciales.`);
    }
    this.persistir(semilla);
    return [...semilla];
  }

  protected persistir(entidades: T[] = this.entidades): void {
    fs.mkdirSync(obtenerDirectorioDatos(), { recursive: true });
    fs.writeFileSync(this.rutaArchivo, JSON.stringify(entidades, null, 2));
  }

  obtenerTodas(): T[] {
    return [...this.entidades];
  }

  obtenerPorId(id: number): T | undefined {
    return this.entidades.find((e) => e.id === id);
  }

  crear(datos: Omit<T, "id">): T {
    const nuevoId = this.entidades.length
      ? Math.max(...this.entidades.map((e) => e.id)) + 1
      : 1;
    const nueva = { id: nuevoId, ...datos } as T;
    this.entidades.push(nueva);
    this.persistir();
    return nueva;
  }

  actualizar(id: number, cambios: Partial<Omit<T, "id">>): T | undefined {
    const indice = this.entidades.findIndex((e) => e.id === id);
    if (indice === -1) return undefined;
    this.entidades[indice] = { ...this.entidades[indice], ...cambios };
    this.persistir();
    return this.entidades[indice];
  }

  eliminar(id: number): boolean {
    const indice = this.entidades.findIndex((e) => e.id === id);
    if (indice === -1) return false;
    this.entidades.splice(indice, 1);
    this.persistir();
    return true;
  }
}
