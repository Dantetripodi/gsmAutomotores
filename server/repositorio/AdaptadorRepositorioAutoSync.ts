import type { AutoRepositorio } from "./AutoRepositorio";
import type { IAutoRepositorio } from "./IAutoRepositorio";
import type { CrearAutoDTO, EstadoAuto } from "../tipos";

export class AdaptadorRepositorioAutoSync implements IAutoRepositorio {
  constructor(private readonly repo: AutoRepositorio) {}

  obtenerTodas() {
    return Promise.resolve(this.repo.obtenerTodas());
  }

  obtenerPorId(id: number) {
    return Promise.resolve(this.repo.obtenerPorId(id));
  }

  filtrar(parametros: { marca?: string; precioMaximo?: number }) {
    return Promise.resolve(this.repo.filtrar(parametros));
  }

  crearAuto(datos: CrearAutoDTO) {
    return Promise.resolve(this.repo.crearAuto(datos));
  }

  actualizarEstado(id: number, estado: EstadoAuto) {
    return Promise.resolve(this.repo.actualizarEstado(id, estado));
  }

  eliminar(id: number) {
    return Promise.resolve(this.repo.eliminar(id));
  }

  obtenerMarcas() {
    return Promise.resolve(this.repo.obtenerMarcas());
  }

  obtenerEstadisticas() {
    return Promise.resolve(this.repo.obtenerEstadisticas());
  }
}
