"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { isPathAllowed } from "@/lib/auth/rbac";

/**
 * Mantiene rol y pantallas al día SIN cerrar sesión.
 *
 * Sondea `/api/me` periódicamente (y al volver el foco). Si el rol o las
 * pantallas cambiaron, refresca el contexto de auth (menú) y la ruta server
 * (el proxy re-gatea: si perdió acceso a la pantalla actual, lo redirige).
 */
export function AccessSync() {
  const { role, screens, refresh } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const sigRef = useRef<string | null>(null);

  // Firma local del acceso vigente en el cliente.
  useEffect(() => {
    sigRef.current = `${role}|${[...screens].sort().join(",")}`;
  }, [role, screens]);

  // Guard de ruta en cliente: si está en una pantalla no permitida, al inicio.
  useEffect(() => {
    if (role && !isPathAllowed({ role, screens }, pathname)) {
      router.replace("/");
    }
  }, [pathname, role, screens, router]);

  useEffect(() => {
    let active = true;

    const check = async () => {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        if (!res.ok) {
          if (res.status === 401) router.refresh(); // sesión perdida → al login
          return;
        }
        const data = await res.json();
        const sig = `${data.role}|${[...(data.screens ?? [])].sort().join(",")}`;
        if (active && sigRef.current !== null && sig !== sigRef.current) {
          sigRef.current = sig;
          refresh(); // actualiza el menú (cliente)
          router.refresh(); // re-ejecuta el server (proxy re-gatea)
        }
      } catch {
        /* red intermitente: se reintenta en el próximo tick */
      }
    };

    const id = setInterval(check, 30000);
    const onFocus = () => {
      if (document.visibilityState !== "hidden") check();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      active = false;
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [router, refresh]);

  return null;
}
