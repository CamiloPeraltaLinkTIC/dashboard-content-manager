"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { mediosData } from "@/data/mock";
import { 
  faNewspaper, 
  faRadio, 
  faTv, 
  faGlobe, 
  faArrowTrendUp, 
  faRotate 
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from "recharts";
import { Button } from "@/components/ui/button";

// Helper to get media icon based on name/type
const getMediaIcon = (medio: string) => {
  const name = medio.toLowerCase();
  if (name.includes("tiempo") || name.includes("semana") || name.includes("pulzo") || name.includes("infobae")) return faNewspaper;
  if (name.includes("radio") || name.includes("blu") || name.includes("la w")) return faRadio;
  if (name.includes("televisión") || name.includes("rcn")) return faTv;
  return faGlobe;
};

const sentimentColors = {
  positivas: "#2eb88a",
  neutral: "#64748b",
  negativas: "#df3a3a"
};

export default function MediosPage() {
  const d = mediosData;

  const stackedData = useMemo(() => {
    return d.tendenciaSemanal.map((item) => ({
      ...item,
      neutral: item.notas - item.positivas - item.negativas
    }));
  }, [d.tendenciaSemanal]);

  return (
    <div className="min-h-screen bg-[#03060d] text-white p-6 overflow-y-auto">
      {/* Header Section */}
      <div className="space-y-4 mb-8">
        <div className="flex gap-2">
            <span className="bg-[#1e293b] text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20">MEDIOS</span>
            <span className="bg-[#0f291e] text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-500/20">COBERTURA</span>
        </div>
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">Conversación en Medios</h1>
                <p className="text-slate-400 mt-2">Monitoreo de cobertura en prensa, radio, televisión y medios digitales.</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
                <span className="text-green-400 flex items-center gap-1">● EN VIVO</span>
                <span className="text-slate-500">02:58 p. m. Jueves, 4 De Junio</span>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-0 h-auto">
                    <FontAwesomeIcon icon={faRotate} className="mr-1"/> Actualizar
                </Button>
            </div>
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {d.kpis.map((kpi, i) => (
                <Card key={kpi.label} className="bg-[#0b101d] border-white/5 p-5 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-[10px] font-bold text-slate-500 tracking-wider">{kpi.label.toUpperCase()}</p>
                        <span className="text-green-500 text-[10px] font-bold">↗ {kpi.delta}</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-500">{kpi.value}</p>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
                        <div 
                            className="h-full" 
                            style={{ 
                                width: '40%', 
                                background: i === 0 ? '#3b82f6' : i === 1 ? '#e8a817' : i === 2 ? '#2eb88a' : '#3b82f6' 
                            }} 
                        />
                    </div>
                </Card>
            ))}
        </div>
      </div>

      {/* Weekly Chart */}
      <Card className="bg-[#0b101d] border border-white/5 p-6 rounded-2xl mb-8">
        <div className="mb-8">
            <h3 className="font-bold text-lg text-slate-200">Notas Publicadas esta Semana</h3>
            <p className="text-xs text-slate-500">Distribución por sentimiento — últimos 7 días</p>
        </div>
        <div className="h-72 px-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                    data={stackedData} 
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    barCategoryGap="10%"
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis 
                        dataKey="dia" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 11 }} 
                    />
                    <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        contentStyle={{ backgroundColor: '#0b101d', border: '1px solid #1e293b', borderRadius: '12px' }}
                    />
                    {/* Much wider bars as requested */}
                    <Bar dataKey="positivas" stackId="a" fill={sentimentColors.positivas} barSize={90} />
                    <Bar dataKey="neutral" stackId="a" fill={sentimentColors.neutral} />
                    <Bar dataKey="negativas" stackId="a" fill={sentimentColors.negativas} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-12 mt-8 text-[11px] font-bold text-slate-400">
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#2eb88a]"></span> Positivas</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#64748b]"></span> Neutral</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#df3a3a]"></span> Negativas</div>
        </div>
      </Card>

      {/* Bottom Sections */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Top Media */}
        <Card className="bg-[#0b101d] border border-white/5 p-4 rounded-2xl shadow-none">
            <h3 className="text-sm font-semibold mb-4 text-slate-200">Top Medios por Número de Notas</h3>
            <div className="space-y-2.5">
                {d.topMedios.map((m, i) => (
                    <div key={m.medio} className="flex items-center gap-3">
                        {/* Rank Circle */}
                        <div 
                            className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs font-bold" 
                            style={i < 3 ? { color: 'rgb(243, 177, 22)' } : { background: 'rgb(32, 40, 60)', color: 'rgb(136, 136, 136)' }}
                        >
                            {i + 1}
                        </div>
                        
                        {/* Media Info (Icon + Name) */}
                        <div className="flex items-center gap-1.5 w-36 shrink-0">
                            <span style={{ color: 'rgb(43, 130, 238)' }}>
                                <FontAwesomeIcon icon={getMediaIcon(m.medio)} className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-sm font-medium truncate text-slate-100">{m.medio}</span>
                        </div>

                        {/* Progress Section */}
                        <div className="flex-1 space-y-0.5">
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">{m.notas} notas</span>
                                <span className="font-medium" style={{ color: 'rgb(46, 184, 138)' }}>{m.sentimiento}%</span>
                            </div>
                            <div className="h-1 w-full bg-slate-800 rounded-[4px] overflow-hidden">
                                <div 
                                    className="h-full transition-all duration-700 ease-in-out" 
                                    style={{ 
                                        width: `${(m.notas / d.topMedios[0].notas) * 100}%`,
                                        borderRadius: '4px',
                                        background: 'linear-gradient(90deg, var(--primary), var(--secondary))'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>

        {/* Trending Topics */}
        <Card className="bg-[#0b101d] border-white/5 p-6 rounded-2xl">
            <h3 className="font-bold text-lg mb-6">Temas en Tendencia</h3>
            <div className="space-y-3">
                {d.temasTendencia.map((t, i) => (
                    <div key={t.tema} className="bg-[#05080f] p-4 rounded-xl flex items-center gap-4 group hover:bg-[#080c14] transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">
                            #{i + 1}
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm text-slate-200">{t.tema}</p>
                            <p className="text-[10px] text-slate-500">{t.count.toLocaleString()} menciones</p>
                        </div>
                        <div className="text-[10px] text-green-500 font-bold flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <FontAwesomeIcon icon={faArrowTrendUp} className="w-2.5 h-2.5"/> trending
                        </div>
                    </div>
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
}
