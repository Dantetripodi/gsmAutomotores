import { Router } from "express";
import type { AuthServicio } from "../servicio/AuthServicio";

export function crearAuthRouter(authServicio: AuthServicio): Router {
  const router = Router();

  router.post("/login", (req, res) => {
    const { username, password } = req.body as { username?: string; password?: string };
    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ mensaje: "Usuario y contraseña son requeridos" });
    }
    const token = authServicio.login(username.trim(), password);
    if (!token) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }
    res.json({ token });
  });

  router.get("/validate", (req, res) => {
    const token = authServicio.extraerToken(req.headers.authorization);
    res.json({ valid: !!(token && authServicio.esValido(token)) });
  });

  router.post("/logout", (req, res) => {
    const token = authServicio.extraerToken(req.headers.authorization);
    if (token) authServicio.invalidar(token);
    res.json({ ok: true });
  });

  return router;
}
