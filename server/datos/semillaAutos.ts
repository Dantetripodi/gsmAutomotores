import type { Auto } from "../tipos";

// Datos iniciales cargados la primera vez que corre el servidor.
// Una vez generado data/autos.json, este archivo no se vuelve a usar.
export const SEMILLA_AUTOS: Auto[] = [
  {
    id: 1,
    brandName: "Renault",
    modelName: "Kwid",
    versionName: "1.0 Iconic Bt L25",
    year: 2025,
    price: 18900000,
    currency: "ARS",
    mileage: 0,
    transmission: "Manual",
    fuelType: "Nafta",
    engine: "1.0 SCe",
    color: "Naranja Atacama",
    doors: "5",
    status: "available",
    mainImageUrl:
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1400",
    imageUrls: [
      "https://images.unsplash.com/photo-1494905998402-395d5620a8c8?auto=format&fit=crop&q=80&w=1400",
      "https://images.unsplash.com/photo-1552519507-da88b817c801?auto=format&fit=crop&q=80&w=1400",
    ],
    description:
      "El Renault Kwid te brinda la practicidad de un compacto y el diseño de un SUV llevando tu experiencia de manejo a otro nivel.",
    segment: "Hatchback",
    bodyType: "Hatchback",
    condition: "0km",
    specSummary: {
      Segmento: "Hatchback",
      "Longitud (mm)": "3.680",
      "Cilindrada (CC)": "999",
      "Tipo de transmisión": "Manual",
      Tracción: "Delantera",
    },
    equipment: {
      Llanta: "Aleación",
      "Aire acondicionado": "Sí",
      "Ventanas eléctricas delanteras": "Sí",
    },
    otherFeatures: {
      Puertas: "5",
      "Capacidad de asientos": "5",
      "Compatibilidad con Bluetooth": "Sí",
    },
  }
];
