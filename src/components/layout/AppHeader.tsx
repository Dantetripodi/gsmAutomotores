import { Menu, Phone, ShieldCheck, Shield, X } from "lucide-react";
import { useState } from "react";
import type { AppView } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { SiteLogo } from "../brand/SiteLogo";

type Props = {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
};

export function AppHeader({ currentView, onNavigate }: Props) {
  const { isAdmin } = useAuth();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  const goTo = (view: AppView) => {
    onNavigate(view);
    setOpenMobileMenu(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="h-14 md:h-16 flex items-center justify-between px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex md:hidden items-center justify-center w-9 h-9 rounded-lg text-neutral-600 hover:bg-neutral-100"
            onClick={() => setOpenMobileMenu((v) => !v)}
            aria-label="Abrir menú"
          >
            {openMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => goTo("catalog")}
            className="flex items-center gap-2.5 min-w-0 text-left rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b80c0c] focus-visible:ring-offset-2"
          >
            <SiteLogo />
            <span className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 truncate">
              GSM Automotores
            </span>
          </button>
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
      {openMobileMenu && (
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpenMobileMenu(false)}
            className="md:hidden fixed inset-0 top-14 bg-black/30"
          />
          <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-3 relative z-10">
          <nav className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => goTo("catalog")}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === "catalog" || currentView === "details"
                  ? "text-[#b80c0c] bg-[#b80c0c]/5"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              Catálogo
            </button>
            <button
              type="button"
              onClick={() => goTo("appraisal")}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === "appraisal"
                  ? "text-[#b80c0c] bg-[#b80c0c]/5"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              Tasaciones
            </button>
            <button
              type="button"
              onClick={() => goTo("seguros")}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === "seguros"
                  ? "text-[#b80c0c] bg-[#b80c0c]/5"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              Seguros
            </button>
            <button
              type="button"
              onClick={() => goTo("admin")}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentView === "admin"
                  ? "text-[#b80c0c] bg-[#b80c0c]/5"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {isAdmin ? "Panel admin" : "Admin"}
            </button>
          </nav>
          </div>
        </>
      )}
    </header>
  );
}
