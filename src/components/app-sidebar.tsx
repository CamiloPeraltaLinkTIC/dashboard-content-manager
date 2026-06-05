"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { ChevronLeft } from "lucide-react";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  Vote,
  ShieldCheck,
  Scale,
  UserRound,
  Newspaper,
  Share2,
  Globe2,
};

const navItems = [
  { path: "/mapa", label: "Mapa Global", icon: "Globe2", badge: "NEW", badgeBg: "hsl(213 60% 18%)", badgeText: "hsl(213 85% 62%)" },
  { path: "/elecciones", label: "Elecciones Presiden...", icon: "Vote", badge: "HOT", badgeBg: "#e05a33", badgeText: "#fff" },
  { path: "/testigos", label: "Testigos Electorales", icon: "ShieldCheck" },
  { path: "/legitimidad", label: "Legitimidad y Transparencia", icon: "Scale" },
  { path: "/quiroz", label: "Cristian Quiroz", icon: "UserRound" },
  { path: "/medios", label: "Conversacion en Medios", icon: "Newspaper" },
  { path: "/social", label: "Conversacion en Re...", icon: "Share2", badge: "LIVE", badgeBg: "#2eb88a", badgeText: "#fff" }
];

export function AppSidebar() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="glass border-r border-border/60">
      <SidebarHeader className="border-b border-border/40 px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 flex-1">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cne-blue shrink-0">
              <Crosshair className="h-3 w-3 text-cne-gold" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold text-foreground">CNE</span>
              <span className="text-[10px] text-muted-foreground">
                Content Manager
              </span>
            </div>
          </Link>
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
          Narrativa
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = icons[item.icon];
            const isActive =
              pathname === item.path ||
              (pathname === "/" && item.path === "/elecciones");
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`sidebar-item flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "active bg-[hsl(213_85%_48%/0.15)] text-[hsl(213_85%_48%)] border-l-2 border-[hsl(213_85%_48%)] pl-[calc(0.75rem-2px)]"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {Icon && (
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[hsl(213_85%_48%)]" : ""}`} />
                )}
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
          <span>CNE Colombia © 2026</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
