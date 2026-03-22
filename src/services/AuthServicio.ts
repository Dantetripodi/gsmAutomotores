import { urlApi } from "./http";

export type CredencialesLogin = {
  username: string;
  password: string;
};

/**
 * Servicio de autenticación del administrador (llamadas al backend).
 * Patrón singleton como en algo-que-pedir-react.
 */
class AuthServicio {
  async iniciarSesion(credenciales: CredencialesLogin): Promise<{ token: string }> {
    const res = await fetch(urlApi("/api/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credenciales),
    });
    if (!res.ok) throw new Error("Credenciales incorrectas");
    return res.json();
  }

  /** El backend responde 200 con { valid: boolean }; hay que leer el cuerpo. */
  async validarToken(token: string): Promise<boolean> {
    const res = await fetch(urlApi("/api/auth/validate"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { valid?: boolean };
    return data.valid === true;
  }

  async cerrarSesionEnServidor(token: string): Promise<void> {
    await fetch(urlApi("/api/auth/logout"), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export const authServicio = new AuthServicio();
