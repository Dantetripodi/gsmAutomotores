import { AdaptadorRepositorioAutoSync } from "./AdaptadorRepositorioAutoSync";
import { AutoRepositorio } from "./AutoRepositorio";
import { AutoRepositorioGoogleSheets } from "./AutoRepositorioGoogleSheets";
import type { IAutoRepositorio } from "./IAutoRepositorio";

export async function crearAutoRepositorio(): Promise<IAutoRepositorio> {
  if (process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim()) {
    return AutoRepositorioGoogleSheets.crear();
  }
  return new AdaptadorRepositorioAutoSync(new AutoRepositorio());
}
