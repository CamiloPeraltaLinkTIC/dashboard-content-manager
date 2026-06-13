"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Vote,
  ShieldCheck,
  Scale,
  UserRound,
  Newspaper,
  Share2,
  Globe2,
  Copyright,
  Crosshair,
  Users,
  MapPinned,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { ChevronLeft } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Vote,
  ShieldCheck,
  Scale,
  UserRound,
  Newspaper,
  Share2,
  Globe2,
  MapPinned,
  Users,
};

// Navegación por modo
const cneNavItems = [
  { path: "/mapa", label: "Mapa Global", icon: "Globe2", badge: "NEW", badgeBg: "hsl(213 60% 18%)", badgeText: "hsl(213 85% 62%)" },
  { path: "/elecciones", label: "Elecciones Presiden...", icon: "Vote", badge: "HOT", badgeBg: "#e05a33", badgeText: "#fff" },
  { path: "/testigos", label: "Testigos Electorales", icon: "ShieldCheck" },
  { path: "/legitimidad", label: "Legitimidad y Transparencia", icon: "Scale" },
  { path: "/quiroz", label: "Cristian Quiroz", icon: "UserRound" },
  { path: "/medios", label: "Conversacion en Medios", icon: "Newspaper" },
  { path: "/social", label: "Conversacion en Re...", icon: "Share2", badge: "LIVE", badgeBg: "#2eb88a", badgeText: "#fff" },
];

const actoresNavItems = [
  { path: "/actores-electorales/mapa-colombia", label: "Mapa de Colombia", icon: "MapPinned", badge: "IG", badgeBg: "#2a1020", badgeText: "#E1306C" },
  { path: "/actores-electorales/perfiles", label: "Instagram", icon: "Instagram" },
];

type ModeKey = "cne" | "actores";

const modes: Record<ModeKey, { label: string; sub: string; icon: React.ComponentType<{ className?: string }>; home: string; navItems: typeof cneNavItems; section: string }> = {
  cne: { label: "CNE Colombia", sub: "Panel central", icon: Crosshair, home: "/mapa", navItems: cneNavItems, section: "Narrativa" },
  actores: { label: "Actores Electorales", sub: "Panel central", icon: Users, home: "/actores-electorales/mapa-colombia", navItems: actoresNavItems, section: "Actores Electorales" },
};

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const currentMode: ModeKey = pathname.startsWith("/actores-electorales") ? "actores" : "cne";
  const mode = modes[currentMode];
  const ModeIcon = mode.icon;

  const selectMode = (key: ModeKey) => {
    setSwitcherOpen(false);
    if (key !== currentMode) router.push(modes[key].home);
  };

  return (
    <Sidebar collapsible="icon" className="glass border-r border-border/60">
      <SidebarHeader className="border-b border-border/40 px-4 py-4">
        <div className="flex items-center gap-2">
          {/* Selector de modo: CNE / Actores Electorales */}
          <div className="relative flex-1">
            <button
              onClick={() => setSwitcherOpen((o) => !o)}
              className="flex items-center gap-3 w-full rounded-md hover:bg-accent/60 transition-colors p-1 -m-1"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cne-blue shrink-0">
                <ModeIcon className="h-3 w-3 text-cne-gold" />
              </div>
              <div className="flex flex-col items-start flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold text-foreground truncate max-w-full">{mode.label}</span>
                <span className="text-[10px] text-muted-foreground truncate max-w-full">{mode.sub}</span>
              </div>
              <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 group-data-[collapsible=icon]:hidden" />
            </button>

            {switcherOpen && (
              <>
                {/* overlay para cerrar al hacer clic afuera */}
                <div className="fixed inset-0 z-40" onClick={() => setSwitcherOpen(false)} />
                <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-lg border border-border/60 bg-[#0b101d] shadow-2xl p-1 group-data-[collapsible=icon]:hidden">
                  {(Object.keys(modes) as ModeKey[]).map((key) => {
                    const m = modes[key];
                    const MIcon = m.icon;
                    const isCurrent = key === currentMode;
                    return (
                      <button
                        key={key}
                        onClick={() => selectMode(key)}
                        className={`flex items-center gap-3 w-full rounded-md px-2 py-2 text-left transition-colors ${isCurrent ? "bg-[hsl(213_85%_48%/0.12)]" : "hover:bg-accent/60"}`}
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cne-blue shrink-0">
                          <MIcon className="h-3 w-3 text-cne-gold" />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-sm font-semibold text-foreground truncate">{m.label}</span>
                          <span className="text-[10px] text-muted-foreground truncate">{m.sub}</span>
                        </div>
                        {isCurrent && <Check className="h-3.5 w-3.5 text-[hsl(213_85%_48%)] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors group-data-[collapsible=icon]:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-2 px-2 group-data-[collapsible=icon]:hidden">
          {mode.section}
        </p>
        <nav className="space-y-1">
          {mode.navItems.map((item) => {
            const Icon = icons[item.icon];
            const isActive =
              pathname === item.path ||
              (pathname === "/" && item.path === "/elecciones");
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`sidebar-item flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive && item.icon === "Instagram"
                    ? "active bg-[rgba(225,48,108,0.12)] text-[#E1306C] border-l-2 border-[#E1306C] pl-[calc(0.75rem-2px)]"
                    : isActive
                      ? "active bg-[hsl(213_85%_48%/0.15)] text-[hsl(213_85%_48%)] border-l-2 border-[hsl(213_85%_48%)] pl-[calc(0.75rem-2px)]"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
              >
                {item.icon === "Instagram" ? (
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className={`h-4 w-4 shrink-0 ${isActive ? "text-[#E1306C]" : ""}`}
                  />
                ) : Icon ? (
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[hsl(213_85%_48%)]" : ""}`} />
                ) : null}
                <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full group-data-[collapsible=icon]:hidden"
                    style={{
                      backgroundColor: item.badgeBg,
                      color: item.badgeText,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 px-4 py-3 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Copyright className="h-3 w-3" />
          <span>By LinkTIC © 2026</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
