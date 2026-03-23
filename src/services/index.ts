export { URL_API_BASE } from "../config/env";
export { urlApi, encabezadosAuth } from "./http";
export { authServicio, type CredencialesLogin } from "./AuthServicio";
export {
  catalogoServicio,
  type ConsultaCatalogo,
  type CrearAutoPayload,
} from "./CatalogoServicio";
export { marcasServicio } from "./MarcasServicio";
export { dashboardServicio } from "./DashboardServicio";
export { tasacionServicio, type PayloadTasacion } from "./TasacionServicio";
export { uploadServicio } from "./UploadServicio";
