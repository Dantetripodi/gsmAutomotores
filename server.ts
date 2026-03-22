import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mock Database
  const brands = [
    { id: 1, name: "Porsche", slug: "porsche" },
    { id: 2, name: "BMW", slug: "bmw" },
    { id: 3, name: "Mercedes-Benz", slug: "mercedes-benz" },
    { id: 4, name: "Audi", slug: "audi" },
  ];

  const models = [
    { id: 1, brandId: 1, name: "911 GT3", slug: "911-gt3" },
    { id: 2, brandId: 1, name: "Taycan Turbo S", slug: "taycan-turbo-s" },
    { id: 3, brandId: 2, name: "M5 Competition", slug: "m5-competition" },
    { id: 4, brandId: 3, name: "GLE 450", slug: "gle-450" },
  ];

  const cars = [
    {
      id: 1,
      modelId: 1,
      year: 2023,
      price: 245900,
      mileage: 1200,
      transmission: "Manual",
      fuelType: "Nafta",
      engine: "4.0L F6",
      color: "GT Silver",
      doors: "2-Puertas",
      status: "available",
      mainImageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200",
      description: "Este Porsche 911 GT3 Touring se encuentra en estado inmaculado. Equipado con el deseado Touring Package que elimina el alerón trasero fijo para un perfil más sobrio y elegante. Motor atmosférico de 510 CV y caja manual de 6 velocidades para una experiencia de conducción pura."
    },
    {
      id: 2,
      modelId: 2,
      year: 2023,
      price: 185900,
      mileage: 500,
      transmission: "Automática",
      fuelType: "Eléctrico",
      engine: "Dual Motor",
      color: "Blanco Carrara",
      doors: "4-Puertas",
      status: "available",
      mainImageUrl: "https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&q=80&w=1200",
      description: "Rendimiento eléctrico total. Frenos cerámicos, interior de lujo y aceleración de 0 a 100 en 2.8 segundos. El futuro de la deportividad."
    },
    {
      id: 3,
      modelId: 3,
      year: 2021,
      price: 98500,
      mileage: 34000,
      transmission: "Automática",
      fuelType: "Nafta",
      engine: "4.4L V8",
      color: "Zafiro Negro",
      doors: "4-Puertas",
      status: "reserved",
      mainImageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200",
      description: "Paquete ejecutivo, sonido Bowers & Wilkins, asientos ventilados. Un sedán de lujo con alma de superdeportivo."
    }
  ];

  // API Routes
  app.get("/api/catalog", (req, res) => {
    const { brand, price_max } = req.query;
    
    let filteredCars = cars.map(car => {
      const model = models.find(m => m.id === car.modelId);
      const brandObj = brands.find(b => b.id === model?.brandId);
      return { ...car, modelName: model?.name, brandName: brandObj?.name, brandSlug: brandObj?.slug };
    });

    if (brand) {
      filteredCars = filteredCars.filter(c => c.brandSlug === brand);
    }

    if (price_max) {
      filteredCars = filteredCars.filter(c => c.price <= Number(price_max));
    }

    res.json(filteredCars);
  });

  app.get("/api/catalog/:id", (req, res) => {
    const car = cars.find(c => c.id === Number(req.params.id));
    if (!car) return res.status(404).json({ message: "Car not found" });
    
    const model = models.find(m => m.id === car.modelId);
    const brandObj = brands.find(b => b.id === model?.brandId);
    res.json({ ...car, modelName: model?.name, brandName: brandObj?.name, brandSlug: brandObj?.slug });
  });

  app.post("/api/catalog", express.json(), (req, res) => {
    const newCar = {
      id: cars.length + 1,
      ...req.body,
      status: "available"
    };
    cars.push(newCar);
    res.status(201).json(newCar);
  });

  app.get("/api/brands", (req, res) => {
    res.json(brands);
  });

  app.get("/api/dashboard/stats", (req, res) => {
    res.json({
      totalStock: cars.length,
      available: cars.filter(c => c.status === "available").length,
      reserved: cars.filter(c => c.status === "reserved").length,
      recentInquiries: 28,
      pendingReservations: 12
    });
  });

  app.post("/api/appraisal", express.json(), (req, res) => {
    const { year, mileage, brandId } = req.body;
    // Simple mock logic for appraisal
    const basePrice = 50000;
    const yearFactor = (year - 2010) * 2000;
    const mileageFactor = (mileage / 1000) * 100;
    const estimatedValue = Math.max(5000, basePrice + yearFactor - mileageFactor);
    
    res.json({ estimatedValue });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
