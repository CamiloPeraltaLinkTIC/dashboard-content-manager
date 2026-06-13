"use client";

import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsersRectangle } from "@fortawesome/free-solid-svg-icons";

export default function PerfilesActoresPage() {
  return (
    <div className="flex flex-col p-6 gap-6 bg-[#03060d] text-white min-h-screen">
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <span className="bg-[#1e293b] text-slate-400 text-xs px-2 py-1 rounded-full border border-slate-500/20 uppercase">Próximamente</span>
          <span className="bg-[#0f291e] text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/20">● ACTORES ELECTORALES</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Perfiles de Actores</h1>
          <p className="text-slate-400 mt-2">Esta sección está en construcción. Define aquí el contenido de la segunda página de Actores Electorales.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col items-center justify-center text-center bg-[#0b101d]/50 border border-white/5 text-white py-24">
        <FontAwesomeIcon icon={faUsersRectangle} className="w-12 h-12 text-blue-500 mb-4" />
        <h3 className="text-lg font-bold">Página en construcción</h3>
        <p className="text-sm text-slate-400 mt-2 max-w-md">
          Lista para conectar datos y componentes. Indícame qué debe mostrar (ranking de candidatos/partidos,
          feed de conversación, comparativas, etc.) y la desarrollo.
        </p>
      </Card>
    </div>
  );
}
