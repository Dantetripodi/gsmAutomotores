import { Menu, Phone, ShieldCheck, Shield } from "lucide-react";
import type { AppView } from "../../types";
import { useAuth } from "../../context/AuthContext";

type Props = {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
};

export function AppHeader({ currentView, onNavigate }: Props) {
  const { isAdmin } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="h-14 md:h-16 flex items-center justify-between px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <Menu className="w-5 h-5 text-neutral-600 cursor-pointer md:hidden" onClick={() => onNavigate("catalog")} />
          <h1
            className="text-lg md:text-xl font-bold tracking-tight cursor-pointer text-neutral-900"
            onClick={() => onNavigate("catalog")}
          >
            GSM Automotores
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <button
            type="button"
            onClick={() => onNavigate("catalog")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === "catalog" || currentView === "details"
                ? "text-[#b80c0c] bg-[#b80c0c]/5"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            Catálogo
          </button>
          <button
            type="button"
            onClick={() => onNavigate("appraisal")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === "appraisal"
                ? "text-[#b80c0c] bg-[#b80c0c]/5"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            Tasaciones
          </button>
          <button
            type="button"
            onClick={() => onNavigate("seguros")}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === "seguros"
                ? "text-[#b80c0c] bg-[#b80c0c]/5"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Seguros
          </button>
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => onNavigate("admin")}
            className={
              isAdmin
                ? "inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5 shrink-0"
                : "text-xs font-semibold text-neutral-500 hover:text-[#b80c0c] px-1.5 py-1 shrink-0"
            }
          >
            {isAdmin && <ShieldCheck className="w-3.5 h-3.5" />}
            {isAdmin ? "Panel" : "Admin"}
          </button>

          <a href="tel:08001234567" className="flex items-center gap-1.5 text-sm font-semibold text-[#b80c0c]">
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">0810 · consultá</span>
          </a>
        </div>
      </div>
    </header>
  );
}
