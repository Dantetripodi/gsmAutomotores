import { google } from "googleapis";
import { SEMILLA_AUTOS } from "../datos/semillaAutos";
import { MAX_CARACTERES_CELDA_GOOGLE_SHEETS } from "../utils/limiteCeldaGoogleSheets";
import { slugMarca } from "../utils/slugMarca";
import type { IAutoRepositorio } from "./IAutoRepositorio";
import type { Auto, AutoConSlug, CrearAutoDTO, EstadisticasDashboard, EstadoAuto } from "../tipos";

const IMAGEN_PLACEHOLDER =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200";

const HEADERS = [
  "id",
  "brandName",
  "modelName",
  "versionName",
  "year",
  "price",
  "currency",
  "mileage",
  "transmission",
  "fuelType",
  "engine",
  "color",
  "doors",
  "status",
  "mainImageUrl",
  "imageUrls",
  "description",
  "segment",
  "bodyType",
  "condition",
  "specSummary",
  "equipment",
  "otherFeatures",
] as const;

const COLS = HEADERS.length;

function padFila(row: string[]): string[] {
  const out = [...row];
  while (out.length < COLS) out.push("");
  return out.slice(0, COLS);
}

function parseJsonObj(s: string): Record<string, string> | undefined {
  const t = s?.trim();
  if (!t) return undefined;
  try {
    const o = JSON.parse(t) as unknown;
    if (o && typeof o === "object" && !Array.isArray(o)) return o as Record<string, string>;
  } catch {
    return undefined;
  }
  return undefined;
}

function filaAAuto(row: string[]): Auto | null {
  const r = padFila(row);
  const id = Number(r[0]);
  if (!r[0]?.trim() || Number.isNaN(id) || id < 1) return null;

  const imageUrlsRaw = r[15]?.trim();
  const imageUrls = imageUrlsRaw
    ? imageUrlsRaw
        .split("|")
        .map((u) => u.trim())
        .filter(Boolean)
    : undefined;

  const cond = r[19]?.trim();
  const condition: "0km" | "usado" | undefined =
    cond === "0km" || cond === "usado" ? cond : undefined;

  return {
    id,
    brandName: r[1] ?? "",
    modelName: r[2] ?? "",
    versionName: r[3]?.trim() || undefined,
    year: Number(r[4]) || 0,
    price: Number(r[5]) || 0,
    currency: r[6] === "USD" ? "USD" : "ARS",
    mileage: Number(r[7]) || 0,
    transmission: r[8] ?? "",
    fuelType: r[9] ?? "",
    engine: r[10]?.trim() || undefined,
    color: r[11]?.trim() || undefined,
    doors: r[12]?.trim() || undefined,
    status: (["available", "reserved", "sold"].includes(r[13])
      ? r[13]
      : "available") as EstadoAuto,
    mainImageUrl: r[14]?.trim() || IMAGEN_PLACEHOLDER,
    imageUrls: imageUrls && imageUrls.length > 0 ? imageUrls : undefined,
    description: r[16] ?? "",
    segment: r[17]?.trim() || undefined,
    bodyType: r[18]?.trim() || undefined,
    condition,
    specSummary: parseJsonObj(r[20]),
    equipment: parseJsonObj(r[21]),
    otherFeatures: parseJsonObj(r[22]),
  };
}

function celdaTextoSeguro(s: string): string {
  const max = MAX_CARACTERES_CELDA_GOOGLE_SHEETS;
  if (s.length <= max) return s;
  if (s.startsWith("data:")) return IMAGEN_PLACEHOLDER;
  return s.slice(0, max - 3) + "...";
}

function joinImageUrlsSeguro(urls: string[]): string {
  const max = MAX_CARACTERES_CELDA_GOOGLE_SHEETS;
  const partes: string[] = [];
  for (const u of urls) {
    const seg = celdaTextoSeguro(u);
    const candidato = partes.length === 0 ? seg : partes.join("|") + "|" + seg;
    if (candidato.length > max) break;
    partes.push(seg);
  }
  return partes.join("|");
}

function autoAFila(a: Auto): string[] {
  const principal = celdaTextoSeguro((a.mainImageUrl || "").trim() || IMAGEN_PLACEHOLDER);
  const imageUrls = joinImageUrlsSeguro(a.imageUrls ?? []);
  return [
    String(a.id),
    celdaTextoSeguro(a.brandName),
    celdaTextoSeguro(a.modelName),
    celdaTextoSeguro(a.versionName ?? ""),
    String(a.year),
    String(a.price),
    a.currency,
    String(a.mileage),
    celdaTextoSeguro(a.transmission),
    celdaTextoSeguro(a.fuelType),
    celdaTextoSeguro(a.engine ?? ""),
    celdaTextoSeguro(a.color ?? ""),
    celdaTextoSeguro(a.doors ?? ""),
    a.status,
    principal,
    imageUrls,
    celdaTextoSeguro(a.description),
    celdaTextoSeguro(a.segment ?? ""),
    celdaTextoSeguro(a.bodyType ?? ""),
    celdaTextoSeguro(a.condition ?? ""),
    celdaTextoSeguro(a.specSummary ? JSON.stringify(a.specSummary) : ""),
    celdaTextoSeguro(a.equipment ? JSON.stringify(a.equipment) : ""),
    celdaTextoSeguro(a.otherFeatures ? JSON.stringify(a.otherFeatures) : ""),
  ];
}

function enriquecer(auto: Auto): AutoConSlug {
  return { ...auto, brandSlug: slugMarca(auto.brandName) };
}

function credencialesDesdeEnv(): object {
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64?.trim();
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (b64) {
    return JSON.parse(Buffer.from(b64, "base64").toString("utf8")) as object;
  }
  if (raw) {
    return JSON.parse(raw) as object;
  }
  throw new Error(
    "Configurá GOOGLE_SERVICE_ACCOUNT_BASE64 o GOOGLE_SERVICE_ACCOUNT_JSON para usar Google Sheets."
  );
}

export class AutoRepositorioGoogleSheets implements IAutoRepositorio {
  private constructor(
    private readonly sheets: ReturnType<typeof google.sheets>,
    private readonly spreadsheetId: string,
    private readonly tabName: string
  ) {}

  private get rangoTab(): string {
    const esc = `'${this.tabName.replace(/'/g, "''")}'`;
    return esc;
  }

  static async crear(): Promise<AutoRepositorioGoogleSheets> {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
    if (!spreadsheetId) {
      throw new Error("Falta GOOGLE_SHEETS_SPREADSHEET_ID.");
    }
    const tabName = process.env.GOOGLE_SHEETS_TAB_NAME?.trim() || "Catalogo";

    const auth = new google.auth.GoogleAuth({
      credentials: credencialesDesdeEnv(),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const repo = new AutoRepositorioGoogleSheets(sheets, spreadsheetId, tabName);
    await repo.asegurarPestaña();
    await repo.asegurarDatosIniciales();
    return repo;
  }

  private async asegurarPestaña(): Promise<void> {
    const meta = await this.sheets.spreadsheets.get({ spreadsheetId: this.spreadsheetId });
    const existe = meta.data.sheets?.some((s) => s.properties?.title === this.tabName);
    if (existe) return;
    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: this.tabName } } }],
      },
    });
  }

  private async asegurarDatosIniciales(): Promise<void> {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${this.rangoTab}!A1:W`,
    });
    const rows = res.data.values ?? [];
    if (rows.length === 0 || !rows[0]?.[0]) {
      await this.persistirTodos(SEMILLA_AUTOS);
      return;
    }
    const datos = rows.slice(1).flatMap((row) => {
      const a = filaAAuto(padFila(row as string[]));
      return a ? [a] : [];
    });
    if (datos.length === 0) {
      await this.persistirTodos(SEMILLA_AUTOS);
    }
  }

  private async leerAutos(): Promise<Auto[]> {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${this.rangoTab}!A2:W`,
    });
    const rows = res.data.values ?? [];
    const autos: Auto[] = [];
    for (const row of rows) {
      const a = filaAAuto(padFila(row as string[]));
      if (a) autos.push(a);
    }
    return autos;
  }

  private async persistirTodos(autos: Auto[]): Promise<void> {
    const ordenados = [...autos].sort((x, y) => x.id - y.id);
    const values: string[][] = [[...HEADERS], ...ordenados.map(autoAFila)];
    await this.sheets.spreadsheets.values.clear({
      spreadsheetId: this.spreadsheetId,
      range: `${this.rangoTab}!A1:W2000`,
    });
    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${this.rangoTab}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });
  }

  async obtenerTodas(): Promise<AutoConSlug[]> {
    const autos = await this.leerAutos();
    return autos.map(enriquecer);
  }

  async obtenerPorId(id: number): Promise<AutoConSlug | undefined> {
    const autos = await this.leerAutos();
    const auto = autos.find((a) => a.id === id);
    return auto ? enriquecer(auto) : undefined;
  }

  async filtrar(parametros: { marca?: string; precioMaximo?: number }): Promise<AutoConSlug[]> {
    const autos = await this.leerAutos();
    return autos
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
      .map(enriquecer);
  }

  async crearAuto(datos: CrearAutoDTO): Promise<AutoConSlug> {
    const autos = await this.leerAutos();
    const principal =
      datos.mainImageUrl?.trim() ||
      datos.imageUrls?.find((u) => u?.trim())?.trim() ||
      IMAGEN_PLACEHOLDER;
    const extras = (datos.imageUrls ?? [])
      .map((u) => u.trim())
      .filter(Boolean)
      .filter((u) => u !== principal);
    const nuevoId = autos.length ? Math.max(...autos.map((e) => e.id)) + 1 : 1;
    const nuevo: Auto = {
      id: nuevoId,
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
      status: "available",
      mainImageUrl: principal,
      imageUrls: extras.length > 0 ? extras : undefined,
      description: datos.description,
      condition: datos.condition,
    };
    autos.push(nuevo);
    await this.persistirTodos(autos);
    return enriquecer(nuevo);
  }

  async actualizarEstado(id: number, estado: EstadoAuto): Promise<AutoConSlug | undefined> {
    const autos = await this.leerAutos();
    const idx = autos.findIndex((a) => a.id === id);
    if (idx === -1) return undefined;
    autos[idx] = { ...autos[idx], status: estado };
    await this.persistirTodos(autos);
    return enriquecer(autos[idx]);
  }

  async eliminar(id: number): Promise<boolean> {
    const autos = await this.leerAutos();
    const filtrados = autos.filter((a) => a.id !== id);
    if (filtrados.length === autos.length) return false;
    await this.persistirTodos(filtrados);
    return true;
  }

  async obtenerMarcas(): Promise<Array<{ id: string; name: string; slug: string }>> {
    const autos = await this.leerAutos();
    const vistas = new Map<string, { id: string; name: string; slug: string }>();
    for (const auto of autos) {
      const slug = slugMarca(auto.brandName);
      if (!vistas.has(slug)) {
        vistas.set(slug, { id: slug, name: auto.brandName, slug });
      }
    }
    return [...vistas.values()];
  }

  async obtenerEstadisticas(): Promise<EstadisticasDashboard> {
    const autos = await this.leerAutos();
    return {
      totalStock: autos.length,
      available: autos.filter((a) => a.status === "available").length,
      reserved: autos.filter((a) => a.status === "reserved").length,
      sold: autos.filter((a) => a.status === "sold").length,
      recentInquiries: 28,
    };
  }
}
