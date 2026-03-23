import fs from "fs";
import path from "path";
import { obtenerDirectorioDatos } from "../rutas";
import { slugMarca } from "../utils/slugMarca";
import { Repositorio } from "./Repositorio";
import { SEMILLA_AUTOS } from "../datos/semillaAutos";
import type { ActualizarAutoDTO, Auto, AutoConSlug, CrearAutoDTO, EstadisticasDashboard, EstadoAuto } from "../tipos";

// Si existe data/cars.json (versión anterior) y aún no existe data/autos.json,
// migra los datos automáticamente para no perder el catálogo cargado.
function obtenerSemillaInicial(): Auto[] {
  const dir = obtenerDirectorioDatos();
  const archivoNuevo = path.join(dir, "autos.json");
  const archivoViejo = path.join(dir, "cars.json");

  if (!fs.existsSync(archivoNuevo) && fs.existsSync(archivoViejo)) {
    try {
      const datos = JSON.parse(fs.readFileSync(archivoViejo, "utf-8")) as Auto[];
      console.log("[AutoRepositorio] Datos migrados desde cars.json → autos.json");
      return datos;
    } catch {
      // Si falla la migración, usa la semilla
    }
  }
  return SEMILLA_AUTOS;
}

export class AutoRepositorio extends Repositorio<Auto> {
  constructor() {
    super("autos.json", obtenerSemillaInicial());
  }

  private enriquecer(auto: Auto): AutoConSlug {
    return { ...auto, brandSlug: slugMarca(auto.brandName) };
  }

  override obtenerTodas(): AutoConSlug[] {
    return this.entidades.map((a) => this.enriquecer(a));
  }

  override obtenerPorId(id: number): AutoConSlug | undefined {
    const auto = this.entidades.find((a) => a.id === id);
    return auto ? this.enriquecer(auto) : undefined;
  }

  filtrar(parametros: { marca?: string; precioMaximo?: number }): AutoConSlug[] {
    return this.entidades
      .filter((auto) => {
        if (parametros.marca) {
          const slug = slugMarca(auto.brandName);
          const nombreMarca = auto.brandName.toLowerCase();
          const filtro = parametros.marca.toLowerCase();
          if (slug !== filtro && nombreMarca !== filtro) return false;
        }
        if (parametros.precioMaximo != null && auto.price > parametros.precioMaximo) {
          return false;
        }
        return true;
      })
      .map((a) => this.enriquecer(a));
  }

  crearAuto(datos: CrearAutoDTO): AutoConSlug {
    const principal =
      datos.mainImageUrl?.trim() ||
      datos.imageUrls?.find((u) => u?.trim())?.trim() ||
      "";
    const extras = (datos.imageUrls ?? [])
      .map((u) => u.trim())
      .filter(Boolean)
      .filter((u) => u !== principal);

    const nuevo = this.crear({
      ...datos,
      mainImageUrl: principal,
      imageUrls: extras.length > 0 ? extras : undefined,
      status: "available",
    });
    return this.enriquecer(nuevo);
  }

  actualizarAuto(id: number, datos: ActualizarAutoDTO): AutoConSlug | undefined {
    if (!this.entidades.some((e) => e.id === id)) return undefined;
    const principal =
      datos.mainImageUrl?.trim() ||
      datos.imageUrls?.find((u) => u?.trim())?.trim() ||
      "";
    const extras = (datos.imageUrls ?? [])
      .map((u) => u.trim())
      .filter(Boolean)
      .filter((u) => u !== principal);
    const actualizado = this.actualizar(id, {
      brandName: datos.brandName,
      modelName: datos.modelName,
      versionName: datos.versionName,
      year: datos.year,
      price: datos.price,
      currency: datos.currency,
      mileage: datos.mileage,
      transmission: datos.transmission,
      fuelType: datos.fuelType,
      engine: datos.engine,
      color: datos.color,
      doors: datos.doors,
      description: datos.description,
      condition: datos.condition,
      mainImageUrl: principal,
      imageUrls: extras.length > 0 ? extras : undefined,
    });
    return actualizado ? this.enriquecer(actualizado) : undefined;
  }

  actualizarEstado(id: number, estado: EstadoAuto): AutoConSlug | undefined {
    const actualizado = this.actualizar(id, { status: estado });
    return actualizado ? this.enriquecer(actualizado) : undefined;
  }

  obtenerMarcas(): Array<{ id: string; name: string; slug: string }> {
    const vistas = new Map<string, { id: string; name: string; slug: string }>();
    for (const auto of this.entidades) {
      const slug = slugMarca(auto.brandName);
      if (!vistas.has(slug)) {
        vistas.set(slug, { id: slug, name: auto.brandName, slug });
      }
    }
    return [...vistas.values()];
  }

  obtenerEstadisticas(): EstadisticasDashboard {
    return {
      totalStock: this.entidades.length,
      available: this.entidades.filter((a) => a.status === "available").length,
      reserved: this.entidades.filter((a) => a.status === "reserved").length,
      sold: this.entidades.filter((a) => a.status === "sold").length,
      recentInquiries: 28, // demo
    };
  }
}
