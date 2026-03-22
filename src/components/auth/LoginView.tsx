import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type Props = {
  onBack: () => void;
};

export default function LoginView({ onBack }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setError(null);
    setLoading(true);
    try {
      await login(username.trim(), password);
    } catch {
      setError("Usuario o contraseña incorrectos. Volvé a intentarlo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.3 }}
      className="min-h-[80vh] flex items-center justify-center px-4"
    >
      <div className="w-full max-w-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-800 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Volver al catálogo
        </button>

        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-900 mx-auto mb-6">
            <Lock size={20} className="text-white" />
          </div>

          <h1 className="text-xl font-semibold text-center text-neutral-900 mb-1">
            Acceso Administrativo
          </h1>
          <p className="text-sm text-neutral-500 text-center mb-8">
            Solo para personal autorizado de GSM Automotores.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Usuario
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg bg-white
                  placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900
                  disabled:opacity-50 disabled:cursor-not-allowed transition"
                placeholder="Ingresá tu usuario"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-3.5 py-2.5 pr-10 text-sm border border-neutral-300 rounded-lg bg-white
                    placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900
                    disabled:opacity-50 disabled:cursor-not-allowed transition"
                  placeholder="Ingresá tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-700 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !username.trim() || !password.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-900 text-white
                text-sm font-medium rounded-lg hover:bg-neutral-800 active:bg-neutral-950 transition
                disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verificando…
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
