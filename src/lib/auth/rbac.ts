/**
 * RBAC puro (sin dependencias de servidor): tipos, normalización de rol,
 * catálogo de pantallas y reglas de acceso. Seguro de importar tanto en
 * componentes cliente como en el proxy (Edge/Node) y en route handlers.
 *
 * Comparte base de datos con "dashboard-unificado": para no chocar en la tabla
 * user_screen_access, las pantallas de ESTE tablero usan el prefijo "cne-tab:".
 */

export const SCREEN_PREFIX = "cne-tab:";

export type AppRole = "superadmin" | "admin" | "viewer";

export interface UserAccess {
  userId: string;
  email: string;
  /** Nombre visible (full_name / username), si existe. */
  name: string;
  role: AppRole;
  /** screen_keys "cne-tab:*" permitidos. Vacío = sin acceso a módulos. */
  screens: string[];
}

/** Una "pantalla" gateable: clave estable + ruta navegable. */
export interface ScreenDef {
  key: string; // p.ej. "cne-tab:mapa"
  path: string; // p.ej. "/mapa"
  title: string;
  group: string; // sección visible en la UI
}

/** Catálogo de todas las pantallas gateables de este tablero. */
const SCREENS: ScreenDef[] = [
  { key: "cne-tab:mapa", path: "/mapa", title: "Mapa Global", group: "Narrativa" },
  { key: "cne-tab:nacional", path: "/nacional", title: "Conversación Nacional", group: "Narrativa" },
  { key: "cne-tab:elecciones", path: "/elecciones", title: "Elecciones Presidenciales", group: "Narrativa" },
  { key: "cne-tab:testigos", path: "/testigos", title: "Testigos Electorales", group: "Narrativa" },
  { key: "cne-tab:legitimidad", path: "/legitimidad", title: "Legitimidad y Transparencia", group: "Narrativa" },
  { key: "cne-tab:quiroz", path: "/quiroz", title: "Cristian Quiroz", group: "Narrativa" },
  { key: "cne-tab:medios", path: "/medios", title: "Conversación en Medios", group: "Narrativa" },
  { key: "cne-tab:social", path: "/social", title: "Conversación en Redes", group: "Narrativa" },
  { key: "cne-tab:actores-mapa", path: "/actores-electorales/mapa-colombia", title: "Mapa de Colombia", group: "Actores Electorales" },
  { key: "cne-tab:actores-perfiles", path: "/actores-electorales/perfiles", title: "Instagram", group: "Actores Electorales" },
];

export function allScreens(): ScreenDef[] {
  return SCREENS;
}

/** Normaliza profiles.user_role al rol de la app. Legados → 'viewer'. */
export function normalizeRole(dbRole: string | null | undefined): AppRole {
  if (dbRole === "superadmin") return "superadmin";
  if (dbRole === "admin") return "admin";
  return "viewer";
}

/** Puede editar/escribir (admin o superadmin). */
export function canEdit(role: AppRole | null | undefined): boolean {
  return role === "admin" || role === "superadmin";
}

export function isSuperadmin(role: AppRole | null | undefined): boolean {
  return role === "superadmin";
}

/** Clave de pantalla que cubre `path` (match de prefijo más largo), o null si
 *  el path no corresponde a una pantalla gateable (/, /login, /admin, etc.). */
export function screenKeyForPath(path: string): string | null {
  let best: ScreenDef | null = null;
  for (const s of SCREENS) {
    if (path === s.path || path.startsWith(s.path + "/")) {
      if (!best || s.path.length > best.path.length) best = s;
    }
  }
  return best?.key ?? null;
}

/** Ruta de una pantalla dada su clave. */
export function pathForScreenKey(key: string): string | null {
  return SCREENS.find((s) => s.key === key)?.path ?? null;
}

/**
 * ¿El usuario puede acceder a `path`?
 * - superadmin: todo.
 * - /admin/usuarios/**: solo superadmin (gestión de usuarios).
 * - /admin/** (editor de KPIs, etc.): editores (admin o superadmin).
 * - paths que no son pantalla gateable: permitido a autenticados.
 * - pantallas de módulo: solo si su clave está en `access.screens`.
 */
export function isPathAllowed(access: Pick<UserAccess, "role" | "screens">, path: string): boolean {
  if (access.role === "superadmin") return true;
  if (path === "/admin/usuarios" || path.startsWith("/admin/usuarios/")) return false;
  if (path === "/admin" || path.startsWith("/admin/")) return canEdit(access.role);
  const key = screenKeyForPath(path);
  if (!key) return true;
  return access.screens.includes(key);
}

/** ¿Tiene acceso a ESTE tablero? superadmin o al menos una pantalla cne-tab. */
export function hasAppAccess(access: Pick<UserAccess, "role" | "screens">): boolean {
  if (access.role === "superadmin") return true;
  return access.screens.some((s) => s.startsWith(SCREEN_PREFIX));
}

/** Ruta de aterrizaje tras el login: primera pantalla permitida.
 *  superadmin → /mapa. Sin pantallas (y no superadmin) → null (sin acceso). */
export function firstAllowedPath(access: Pick<UserAccess, "role" | "screens">): string | null {
  if (access.role === "superadmin") return "/mapa";
  for (const s of SCREENS) {
    if (access.screens.includes(s.key)) return s.path;
  }
  return null;
}
