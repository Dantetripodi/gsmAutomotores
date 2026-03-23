import type { AutoConSlug, CrearAutoDTO, EstadisticasDashboard, EstadoAuto } from "../tipos";

export interface IAutoRepositorio {
  obtenerTodas(): Promise<AutoConSlug[]>;
  obtenerPorId(id: number): Promise<AutoConSlug | undefined>;
  filtrar(parametros: { marca?: string; precioMaximo?: number }): Promise<AutoConSlug[]>;
  crearAuto(datos: CrearAutoDTO): Promise<AutoConSlug>;
  actualizarEstado(id: number, estado: EstadoAuto): Promise<AutoConSlug | undefined>;
  eliminar(id: number): Promise<boolean>;
  obtenerMarcas(): Promise<Array<{ id: string; name: string; slug: string }>>;
  obtenerEstadisticas(): Promise<EstadisticasDashboard>;
}
