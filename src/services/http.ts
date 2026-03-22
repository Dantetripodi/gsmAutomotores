import { URL_API_BASE } from "../config/env";

export function urlApi(ruta: string): string {
  return `${URL_API_BASE}${ruta}`;
}

export function encabezadosAuth(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
