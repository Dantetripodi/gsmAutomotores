import type { AutoConSlug } from "../tipos";

const BASE_PUBLIC =
  process.env.RENDER_EXTERNAL_URL?.trim().replace(/\/$/, "") ||
  process.env.PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
  "";

const RE_DRIVE_FILE_D = /https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i;
const RE_DRIVE_OPEN_ID = /https?:\/\/drive\.google\.com\/open\?[^#]*\bid=([a-zA-Z0-9_-]+)/i;

function driveIdAWsrv(fileId: string): string {
  const thumb = `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
  return `https://wsrv.nl/?url=${encodeURIComponent(thumb)}&output=jpg&n=-1`;
}

export function normalizarUrlImagenDrive(url: string): string {
  const t = url.trim();
  if (!t || t.includes("wsrv.nl")) return t;
  const mFile = t.match(RE_DRIVE_FILE_D);
  if (mFile) return driveIdAWsrv(mFile[1]);
  const mOpen = t.match(RE_DRIVE_OPEN_ID);
  if (mOpen) return driveIdAWsrv(mOpen[1]);
  if (t.includes("drive.google.com")) {
    const id = t.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (id) return driveIdAWsrv(id[1]);
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
    // wsrv.nl y URLs directas no necesitan proxy
    const usarProxy = u.hostname.endsWith(".googleusercontent.com");
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
