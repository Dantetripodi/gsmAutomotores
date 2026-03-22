import type { Request, Response, NextFunction } from "express";
import type { AuthServicio } from "../servicio/AuthServicio";

/**
 * Fábrica del middleware de autenticación.
 * Retorna 401 si el token del encabezado Authorization no es válido.
 */
export function crearMiddlewareAuth(authServicio: AuthServicio) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = authServicio.extraerToken(req.headers.authorization);
    if (token && authServicio.esValido(token)) {
      return next();
    }
    res.status(401).json({ mensaje: "No autorizado" });
  };
}
