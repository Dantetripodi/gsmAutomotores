import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { authServicio } from "../services";
import { useOnInit } from "../hooks/useOnInit";

type AuthContextValue = {
  token: string | null;
  isAdmin: boolean;
  isValidating: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "gsm_admin_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isAdmin, setIsAdmin] = useState(false);
  const [isValidating, setIsValidating] = useState(!!localStorage.getItem(TOKEN_KEY));

  useOnInit(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setIsValidating(false);
      return;
    }
    authServicio
      .validarToken(stored)
      .then((valid) => {
        if (valid) {
          setIsAdmin(true);
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      })
      .finally(() => setIsValidating(false));
  });

  const login = useCallback(async (username: string, password: string) => {
    const { token: newToken } = await authServicio.iniciarSesion({ username, password });
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setIsAdmin(true);
  }, []);

  const logout = useCallback(() => {
    if (token) void authServicio.cerrarSesionEnServidor(token);
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setIsAdmin(false);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, isAdmin, isValidating, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
