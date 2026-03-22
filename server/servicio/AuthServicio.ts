import crypto from "crypto";

const USUARIO_ADMIN = process.env.ADMIN_USER ?? "admin";
const CONTRASENA_ADMIN = process.env.ADMIN_PASS ?? "admin123";

/**
 * Maneja la autenticación del administrador.
 * Los tokens se almacenan en memoria (se invalidan al reiniciar el servidor).
 */
export class AuthServicio {
  private readonly tokensValidos = new Set<string>();

  login(usuario: string, contrasena: string): string | null {
    if (usuario !== USUARIO_ADMIN || contrasena !== CONTRASENA_ADMIN) {
      return null;
    }
    const token = crypto.randomUUID();
    this.tokensValidos.add(token);
    return token;
  }

  esValido(token: string): boolean {
    return this.tokensValidos.has(token);
  }

  invalidar(token: string): void {
    this.tokensValidos.delete(token);
  }

  extraerToken(encabezado: string | undefined): string | undefined {
    return encabezado?.replace("Bearer ", "");
  }
}
