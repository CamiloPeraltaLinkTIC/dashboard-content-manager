"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/elecciones": {
    title: "Elecciones Presidenciales Colombia 2026",
    subtitle: "Panorama general del proceso electoral presidencial",
  },
  "/testigos": {
    title: "Testigos Electorales",
    subtitle: "Red nacional e internacional de observadores",
  },
  "/legitimidad": {
    title: "Legitimidad y Transparencia",
    subtitle: "Indices, certificaciones y acciones en curso",
  },
  "/quiroz": {
    title: "Cristian Quiroz",
    subtitle: "Presidente del CNE Colombia — Monitoreo de narrativa",
  },
  "/medios": {
    title: "Conversacion en Medios",
    subtitle: "Cobertura en prensa, radio, TV y digital",
  },
  "/social": {
    title: "Conversacion en Redes",
    subtitle: "Instagram, Facebook, X, TikTok en tiempo real",
  },
  "/mapa": {
    title: "Mapa Global",
    subtitle: "Narrativa y tendencias del CNE Colombia en el mundo",
  },
};

export function AppHeader() {
  const pathname = usePathname();
  const meta = pageMeta[pathname] || pageMeta["/elecciones"];
  const { state, isMobile } = useSidebar();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setDate(
        now.toLocaleDateString("es-CO", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      );
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="glass border-b border-border/60 flex items-center gap-4 px-4 md:px-6"
      style={{ height: 60, position: "sticky", top: 0, zIndex: 10 }}
    >
      {(state === "collapsed" || isMobile) && <SidebarTrigger />}

      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-semibold truncate">{meta.title}</h2>
        <p className="text-[11px] text-muted-foreground truncate hidden sm:block">
          {meta.subtitle}
        </p>
      </div>

      <div className="hidden lg:flex flex-col items-end text-xs">
        <span className="font-semibold tabular-nums">{time}</span>
        <span className="text-[10px] text-muted-foreground capitalize">
          {date}
        </span>
      </div>

      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cne-blue to-cne-gold flex items-center justify-center text-[11px] font-bold text-white shrink-0">
        CP
      </div>
    </header>
  );
}
