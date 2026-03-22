import { useState, Fragment } from "react";
import { AnimatePresence } from "motion/react";
import { AppHeader } from "./components/layout/AppHeader";
import { AppFooter } from "./components/layout/AppFooter";
import { FilterDrawer } from "./components/layout/FilterDrawer";
import { CatalogView } from "./components/catalog/CatalogView";
import { CarDetailsView } from "./components/details/CarDetailsView";
import { AdminDashboardView } from "./components/admin/AdminDashboardView";
import { AppraisalWizardView } from "./components/appraisal/AppraisalWizardView";
import LoginView from "./components/auth/LoginView";
import { catalogoServicio, marcasServicio } from "./services";
import { DEFAULT_PRICE_MAX } from "./config/app";
import { useAsync } from "./hooks/useAsync";
import { useAuth } from "./context/AuthContext";
import type { AppView } from "./types";

export default function App() {
  const { isAdmin, isValidating } = useAuth();

  const [view, setView] = useState<AppView>("catalog");
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceMax, setPriceMax] = useState(DEFAULT_PRICE_MAX);

  const { data: brandsData } = useAsync(() => marcasServicio.obtenerMarcas());
  const brands = brandsData ?? [];

  const { data: carsData, loading } = useAsync(
    () => catalogoServicio.obtenerCatalogo({ brand: selectedBrand || undefined, price_max: priceMax }),
    [selectedBrand, priceMax]
  );
  const cars = carsData ?? [];

  const navigateToDetails = (id: number) => {
    setSelectedCarId(id);
    setView("details");
    window.scrollTo(0, 0);
  };

  const handleClearFilters = () => {
    setSelectedBrand("");
    setPriceMax(DEFAULT_PRICE_MAX);
  };

  const renderAdminSection = () => {
    if (isValidating) {
      return (
        <div className="flex items-center justify-center py-24 text-sm text-neutral-500">
          Verificando sesión…
        </div>
      );
    }
    if (isAdmin) return <AdminDashboardView onBack={() => setView("catalog")} />;
    return <LoginView onBack={() => setView("catalog")} />;
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-neutral-900 font-sans antialiased">
      <AppHeader onNavigate={setView} />

      <main className="pt-20 md:pt-24 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {view === "catalog" && (
            <CatalogView
              cars={cars}
              brands={brands}
              loading={loading}
              selectedBrand={selectedBrand}
              onSelectBrand={setSelectedBrand}
              onOpenDetails={navigateToDetails}
              onOpenAppraisal={() => setView("appraisal")}
              onOpenFilters={() => setShowFilters(true)}
              onClearFilters={handleClearFilters}
            />
          )}

          {view === "details" && selectedCarId !== null && (
            <Fragment key={selectedCarId}>
              <CarDetailsView
                id={selectedCarId}
                onBack={() => setView("catalog")}
                onSelectCar={(carId) => {
                  setSelectedCarId(carId);
                  window.scrollTo(0, 0);
                }}
              />
            </Fragment>
          )}

          {view === "admin" && renderAdminSection()}

          {view === "appraisal" && <AppraisalWizardView onBack={() => setView("catalog")} />}
        </AnimatePresence>
      </main>

      <FilterDrawer
        open={showFilters}
        onClose={() => setShowFilters(false)}
        brands={brands}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
        priceMax={priceMax}
        onPriceMaxChange={setPriceMax}
        resultCount={cars.length}
      />

      <AppFooter />
    </div>
  );
}
