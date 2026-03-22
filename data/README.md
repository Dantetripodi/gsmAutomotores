# Datos persistentes

## Cómo funciona la **semilla** (`server/datos/semillaAutos.ts`)

Ese archivo **no se ejecuta en cada arranque**. Solo se usa cuando **no existe** `data/autos.json`:

1. Primera vez que corrés el servidor → se crea `autos.json` copiando la semilla.
2. Después, **todo lo que guardás** (altas, bajas, fotos nuevas) vive solo en `autos.json`.
3. Si borrás `autos.json` y reiniciás, volvés a tener la semilla (como “reset de fábrica”).

La semilla **no** se “sube sola” a producción: en el deploy subís el código; el catálogo real lo define `autos.json` en el servidor o una base de datos. Ver `docs/DEPLOY.md`.

## `autos.json`

El catálogo de vehículos se guarda **automáticamente** en este archivo cuando:

- agregás un auto desde el panel admin;
- eliminás o cambiás el estado de un auto;
- el servidor arranca por primera vez (se crea a partir de la semilla en `server/datos/semillaAutos.ts`).

**Ruta completa:** `gsmAutomotores/data/autos.json` (junto a `package.json`).

Si antes usabas `cars.json`, al arrancar el servidor se migra una sola vez a `autos.json`.

## No aparece en el código fuente

El archivo **no está en Git** hasta que lo agregues. Si no lo ves en el explorador, ejecutá `npm run dev` y agregá un auto: al guardarse, se crea la carpeta `data/` y el JSON. En la consola del servidor verás algo como:

`[Persistencia] Catálogo guardado en: /ruta/.../data/autos.json`

## Si “se pierden” los datos al reiniciar

1. Usá siempre **`npm run dev`** (levanta Express + Vite). No uses solo `vite` sin el servidor: el front no guarda en disco.
2. No borres la carpeta `data/` ni el archivo `autos.json` si querés conservar el catálogo.
3. Si ejecutás el servidor desde otra carpeta, antes podía fallar la ruta; ahora se usa la raíz del proyecto fija. Opcional: variable `DATA_DIR` en `.env` con ruta absoluta.
