import type { AutoConSlug } from "../tipos";

const BASE_PUBLIC =
  process.env.RENDER_EXTERNAL_URL?.trim().replace(/\/$/, "") ||
  process.env.PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
  "";

const RE_DRIVE_FILE_D = /https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i;
const RE_DRIVE_OPEN_ID = /https?:\/\/drive\.google\.com\/open\?[^#]*\bid=([a-zA-Z0-9_-]+)/i;

export function normalizarUrlImagenDrive(url: string): string {
  const t = url.trim();
  if (!t) return t;
  const mFile = t.match(RE_DRIVE_FILE_D);
  if (mFile) return `https://drive.google.com/thumbnail?id=${mFile[1]}&sz=w2000`;
  const mOpen = t.match(RE_DRIVE_OPEN_ID);
  if (mOpen) return `https://drive.google.com/thumbnail?id=${mOpen[1]}&sz=w2000`;
  if (t.includes("drive.google.com/uc?") && t.includes("id=")) {
    const id = t.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (id) return `https://drive.google.com/thumbnail?id=${id[1]}&sz=w2000`;
  }
  return t;
}

function urlParaProxificar(url: string): string {
  const t = url.trim();
  if (!t || t.startsWith("data:")) return t;
  if (t.includes("/api/image-proxy")) return t;
  const n = normalizarUrlImagenDrive(t);
  try {
    const u = new URL(n);
    const usarProxy =
      u.hostname === "drive.google.com" ||
      u.hostname.endsWith(".googleusercontent.com") ||
      u.hostname === "images.unsplash.com";
    if (!usarProxy) return n;
    const path = `/api/image-proxy?url=${encodeURIComponent(n)}`;
    return BASE_PUBLIC ? `${BASE_PUBLIC}${path}` : path;
  } catch {
    return n;
  }
}

export function mapAutoUrlsParaFrontend(auto: AutoConSlug): AutoConSlug {
  return {
    ...auto,
    mainImageUrl: urlParaProxificar(auto.mainImageUrl),
    imageUrls: auto.imageUrls?.map(urlParaProxificar),
  };
}
