# Datos persistentes

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
