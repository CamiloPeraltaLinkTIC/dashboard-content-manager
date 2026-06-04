"use client";

import { Suspense, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { TopicTabs } from "@/components/topic-tabs";

const Globe = dynamic(() => import("@/components/globe").then((m) => m.GlobeComponent), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] rounded-lg flex items-center justify-center bg-[#05080f]">
      <p className="text-muted-foreground text-sm">Cargando globo...</p>
    </div>
  ),
});

import {
  pageHeaders,
  testigosTabs,
  testigosPorDepartamento,
  globeMarkers,
  topicData,
} from "@/data/mock";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faGlobe, 
    faMapPin, 
    faEye, 
    faArrowTrendUp,
    faXmark
} from "@fortawesome/free-solid-svg-icons";

function TestigosOverview() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  
  const marker = useMemo(() => 
    globeMarkers.find((m) => m.pais === selected), 
  [selected]);

  const hoveredMarker = useMemo(() => 
    globeMarkers.find((m) => m.pais === hovered), 
  [hovered]);

  const kpis = [
    { label: "Total Asignados", value: "142.800", progress: 70 },
    { label: "Acreditados", value: "98.430", delta: "+69%", progress: 70 },
    { label: "Misiones Internacionales", value: "12", progress: 70 },
    { label: "Dpto. Cubiertos", value: "32", progress: 70 },
  ];

  return (
    <div className="space-y-5 fade-in">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={kpi.label} className="kpi-card p-4 flex flex-col gap-2 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{kpi.label}</span>
              {kpi.delta && (
                <span className="flex items-center gap-0.5 text-[10px] font-bold text-green-400">
                  <FontAwesomeIcon icon={faArrowTrendUp} className="w-2.5 h-2.5" />
                  {kpi.delta}
                </span>
              )}
            </div>
            <div className="font-bold text-2xl text-[#1270e2]">{kpi.value}</div>
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-[#1270e2] rounded-full" style={{ width: `${kpi.progress}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Globe Card */}
      <div className="kpi-card p-4 rounded-xl relative">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <FontAwesomeIcon icon={faGlobe} className="text-blue-500" />
            Globo Terráqueo — Narrativa por País
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mb-4">
          Misiones internacionales de observación acreditadas ante el CNE. Arrastra para rotar, haz click para ver el detalle.
        </p>
        
        <div className="relative w-full h-[420px] bg-[#05080f] rounded-xl overflow-hidden border border-white/5">
          <Suspense fallback={<div className="h-full flex items-center justify-center">Cargando...</div>}>
            <Globe 
                className="h-full" 
                onSelect={(id) => {
                    const found = globeMarkers.find(m => m.pais.toLowerCase().includes(id.toLowerCase()));
                    if (found) setSelected(found.pais);
                }} 
                selectedCountryId={null} 
                selectedPlatform={null} 
                hideIntensity={true}
            />
          </Suspense>
          
          <div className="absolute bottom-3 left-3 flex items-center gap-4 text-[10px] pointer-events-none bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37]"></div>
              <span className="text-muted-foreground font-medium">Colombia</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1d6fe8]"></div>
              <span className="text-muted-foreground font-medium">Misión internacional</span>
            </div>
          </div>
          
          <div className="absolute top-3 right-3 text-[10px] text-muted-foreground pointer-events-none bg-[#0e1320]/90 px-3 py-1.5 rounded-lg border border-white/5 font-medium">
            Arrastra para rotar · Click en un marcador
          </div>

          {/* Overlay Detail Panel */}
          {marker && (
            <div className="absolute right-3 top-10 rounded-xl p-4 text-sm bg-[#0e1320]/95 border border-[#1270e2]/40 min-w-[220px] z-20 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-yellow-500">{marker.pais}</span>
                    <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
                    </button>
                </div>
                <div className="text-[10px] text-muted-foreground mb-1">{marker.ciudad}</div>
                <div className="text-[11px] font-bold text-[#1270e2]">{marker.tipo}</div>
                <div className="h-px bg-white/10 my-2"></div>
                <div className="text-[10px] mb-1">
                    <span className="text-muted-foreground">Observadores: </span>
                    <span className="font-bold text-slate-200">{marker.count}</span>
                </div>
                <div className="text-[10px] mb-1">
                    <span className="text-muted-foreground">Narrativa: </span>
                    <span className="text-slate-300">{marker.narrativa}</span>
                </div>
                <div className="text-[10px]">
                    <span className="text-muted-foreground">Tendencia: </span>
                    <span className="font-bold text-green-400">{marker.tendencia} ↔</span>
                </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Department Progress */}
        <div className="kpi-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faMapPin} className="text-blue-500 w-3.5 h-3.5" />
            <h3 className="text-sm font-semibold text-slate-100">Testigos por Departamento</h3>
          </div>
          <div className="space-y-4">
            {testigosPorDepartamento.slice(0, 6).map((d) => (
              <div key={d.depto} className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium">
                  <span className="text-muted-foreground">{d.depto}</span>
                  <span className="text-slate-200">{d.count.toLocaleString()} · {Math.round((d.count/142800)*100)}%</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#1270e2] rounded-full" 
                    style={{ width: `${(d.count / testigosPorDepartamento[0].count) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missions List */}
        <div className="kpi-card p-4 rounded-xl flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faEye} className="text-yellow-500 w-3.5 h-3.5" />
            <h3 className="text-sm font-semibold text-slate-100">Misiones por País</h3>
          </div>
          <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar max-h-[280px]">
            {globeMarkers.map((m) => (
              <div 
                key={m.pais} 
                onClick={() => setSelected(m.pais)}
                onMouseEnter={() => setHovered(m.pais)}
                onMouseLeave={() => setHovered(null)}
                className={`flex items-center justify-between py-1.5 px-2 border-b border-white/5 last:border-0 cursor-pointer transition-colors rounded-lg ${selected === m.pais ? 'bg-blue-500/10' : 'hover:bg-white/5'}`}
              >
                <div>
                  <div className="text-sm font-bold text-slate-200">{m.pais}</div>
                  <div className="text-[10px] text-muted-foreground">{m.ciudad}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold text-[#1270e2]">{m.tipo}</div>
                  <div className="text-[10px] text-muted-foreground font-bold tracking-tight">{m.count} obs.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestigosPage() {
  const h = pageHeaders.testigos;
  const d = topicData.testigos;
  return (
    <div className="p-6 h-screen overflow-y-auto bg-[#03060d] text-white">
      <PageHeader badges={h.badges} title={h.title} description={h.description} />
      <div className="mt-6">
        <TopicTabs
            tabs={testigosTabs}
            overviewContent={<TestigosOverview />}
            narrativa={d.narrativa}
            pilares={d.pilares}
            noticias={d.noticias}
            contenido={d.contenido}
            conversacion={d.conversacion}
            pauta={d.pauta}
        />
      </div>
    </div>
  );
}
