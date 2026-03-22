# Despliegue (Vercel, Netlify, etc.)

## Cómo está armado hoy

- **Frontend:** React + Vite.
- **Backend:** Express en `server.ts` que sirve el front en desarrollo y persiste el catálogo en **`data/autos.json`** en el disco del proceso.

## Por qué Vercel “solo” no alcanza para este backend tal cual

Vercel está pensado para **funciones serverless** y **archivos estáticos**. Tu API actual:

- Escribe un **archivo JSON** en el sistema de archivos.
- En serverless **no hay disco persistente** entre invocaciones: lo que guardás en un archivo puede **desaparecer** o no ser el mismo entre requests.

Por eso, para producción seria conviene uno de estos caminos:

### Opción A — Front en Vercel + API en otro lado (recomendado)

1. **Vercel / Netlify / Cloudflare Pages:** solo el build de Vite (`npm run build`), con `VITE_API_BASE_URL=https://tu-api.railway.app` (o el dominio que uses).
2. **API en un servicio con disco o base de datos:** [Railway](https://railway.app), [Render](https://render.com), [Fly.io](https://fly.io), un **VPS** (DigitalOcean, etc.), o **Docker** con volumen persistente para `data/`.
3. **Base de datos:** migrar de JSON a **PostgreSQL** (Supabase, Neon, Railway Postgres, etc.) para datos confiables y backups.

### Opción B — Todo en un VPS o contenedor

Un solo servidor Node que corre `node dist/server.js` (o `tsx server.ts`) con volumen persistente montado en `./data`.

### Opción C — Solo estático en Vercel (sin tu Express actual)

Tendrías que reescribir la API como **Vercel Serverless Functions** o **Route Handlers** y usar una base de datos externa; el JSON en disco no es viable ahí.

---

## Variable de entorno del front

En el hosting del front:

```env
VITE_API_BASE_URL=https://tu-backend.com
```

Build: `npm run build` y subís la carpeta `dist/`.

---

## Resumen

| Dónde | Qué subís |
|-------|-----------|
| Vercel | Solo el **frontend** (`dist`) + `VITE_API_BASE_URL` apuntando al API |
| Railway / Render / VPS | El **proyecto completo** o solo el servidor, con persistencia (`data/` o base de datos) |

El seed (`server/datos/semillaAutos.ts`) **no se “sube” como datos de producción**: solo se usa la primera vez que no existe `data/autos.json`. Ver `data/README.md`.
