"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "./auth-provider";
import { LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { signOut } from "@/app/actions/auth";

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
  const { role, logout } = useAuth();
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
        <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold truncate">{meta.title}</h2>
            {role === "admin" ? (
                <Badge className="bg-blue-600/10 text-blue-400 border-blue-500/20 text-[8px] h-4 px-1 font-black">ADMIN</Badge>
            ) : (
                <Badge className="bg-slate-600/10 text-slate-400 border-white/10 text-[8px] h-4 px-1 font-black">VISOR</Badge>
            )}
        </div>
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

      <button 
        onClick={async () => await signOut()}
        className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-white/5 text-slate-500 hover:text-red-400 transition-colors"
        title="Cerrar Sesión"
      >
        <LogOut className="h-4 w-4" />
      </button>

      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cne-blue to-cne-gold flex items-center justify-center text-[11px] font-bold text-white shrink-0">
        {role === "admin" ? "AD" : "VS"}
      </div>
    </header>
  );
}
