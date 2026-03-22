export function AppFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-neutral-200 py-10 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-base font-bold text-neutral-900">GSM Automotores</span>
          <p className="text-xs text-neutral-500 mt-1">© {year} GSM Automotores. Todos los derechos reservados.</p>
        </div>
        <div className="flex gap-6 text-xs font-medium text-neutral-500">
          <a href="#" className="hover:text-[#b80c0c]">
            Términos
          </a>
          <a href="#" className="hover:text-[#b80c0c]">
            Privacidad
          </a>
          <a href="#" className="hover:text-[#b80c0c]">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}
