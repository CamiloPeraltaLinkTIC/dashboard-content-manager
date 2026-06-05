"use client";

import { Suspense, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { TopicTabs } from "@/components/topic-tabs";
import {
  pageHeaders,
  eleccionesTabs,
  participacionHistorica,
  calendarioElectoral,
  topicData,
} from "@/data/mock";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowTrendUp, 
  faCircleCheck, 
  faClock, 
  faCircle 
} from "@fortawesome/free-solid-svg-icons";

function EleccionesOverview() {
  const kpis = [
    { label: "Potencial Electoral", value: "38.8M", delta: "+2.4%", progress: 70 },
    { label: "Mesas Habilitadas", value: "115,432", delta: "+1.1%", progress: 70 },
    { label: "Candidatos Presidenciales", value: "18", delta: "+3", progress: 70 },
    { label: "Días para Elección", value: "247", delta: null, progress: 70 },
  ];

  return (
    <div className="space-y-5 fade-in">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kpi-card p-4 flex flex-col gap-2 rounded-xl border-white/5 shadow-none">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Historical Participation Chart */}
        <div className="kpi-card p-4 rounded-xl border-white/5 shadow-none">
          <h3 className="text-sm font-semibold mb-1">Participación Histórica</h3>
          <p className="text-xs text-muted-foreground mb-4">% del censo electoral — Colombia presidenciales</p>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={participacionHistorica} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(222 30% 18%)" />
                <XAxis 
                  dataKey="año" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 11 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 11 }} 
                  domain={[30, 70]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0e1320', border: '1px solid #20283c', borderRadius: '6px', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="pct" 
                  fill="hsl(213,85%,55%)" 
                  radius={[3, 3, 0, 0]} 
                  barSize={61}
                  onMouseEnter={() => {}} // dummy for cursor
                >
                    {/* Highlight last bar with gold color if needed, but per request it seems all blue or based on year */}
                    {participacionHistorica.map((entry, index) => (
                        <Bar key={`cell-${index}`} fill={index === participacionHistorica.length - 1 ? 'hsl(42,90%,52%)' : 'hsl(213,85%,55%)'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Electoral Calendar Milestones */}
        <div className="kpi-card p-4 rounded-xl border-white/5 shadow-none">
          <h3 className="text-sm font-semibold mb-4">Hitos del Calendario Electoral</h3>
          <div className="space-y-2.5">
            {calendarioElectoral.map((item, i) => {
              const isCompleted = item.estado === "completado";
              const isInProgress = item.estado === "activo";
              
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="shrink-0 w-16 text-xs text-muted-foreground font-medium">{item.fecha}</div>
                  <FontAwesomeIcon 
                    icon={isCompleted ? faCircleCheck : (isInProgress ? faClock : faCircle)} 
                    className={`w-3.5 h-3.5 shrink-0 ${isCompleted ? 'text-green-400' : (isInProgress ? 'text-yellow-500' : 'text-slate-600')}`}
                  />
                  <span className="text-sm flex-1 truncate text-slate-200">{item.evento}</span>
                  <span 
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        isCompleted ? 'bg-green-400/10 text-green-400' : 
                        (isInProgress ? 'text-yellow-500' : 'text-slate-500')
                    }`}
                  >
                    {isCompleted ? 'Completado' : (isInProgress ? 'En curso' : 'Pendiente')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EleccionesPage() {
  const h = pageHeaders.elecciones;
  const d = topicData.elecciones;
  return (
    <div className="p-6 h-screen overflow-y-auto bg-[#03060d] text-white">
      <PageHeader badges={h.badges} title={h.title} description={h.description} />
      <div className="mt-6">
        <TopicTabs
            tabs={eleccionesTabs}
            overviewContent={<EleccionesOverview />}
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
