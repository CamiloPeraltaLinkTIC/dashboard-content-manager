"use client";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { TopicTabs } from "@/components/topic-tabs";
import {
  pageHeaders,
  legitimidadTabs,
  legitimidadData,
  topicData,
} from "@/data/mock";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faAward, 
  faCircleCheck, 
  faShieldHalved, 
  faClock 
} from "@fortawesome/free-solid-svg-icons";

const GaugeCircle = ({ value, color, label }: { value: number, color: string, label: string }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(222 30% 18%)" strokeWidth="8"></circle>
        <circle 
          cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="8" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round" 
          transform="rotate(-90 50 50)" 
          style={{ transition: 'stroke-dashoffset 1s' }}
        ></circle>
        <text x="50" y="46" textAnchor="middle" style={{ fontSize: '20px', fontWeight: 700, fill: color, fontVariantNumeric: 'tabular-nums' }}>{value}</text>
        <text x="50" y="60" textAnchor="middle" style={{ fontSize: '9px', fill: 'rgb(136, 136, 136)' }}>/ 100</text>
      </svg>
      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground text-center max-w-[80px]">{label}</span>
    </div>
  );
};

function LegitimidadOverview() {
  const d = legitimidadData;
  return (
    <div className="space-y-5 fade-in">
      {/* Institutional Indices */}
      <div className="kpi-card p-6 rounded-2xl">
        <h3 className="text-sm font-semibold mb-6">Índices Institucionales CNE — Junio 2026</h3>
        <div className="flex flex-wrap justify-around gap-6">
          <GaugeCircle value={d.indiceConfianza} color="rgb(43, 130, 238)" label="Confianza Ciudadana" />
          <GaugeCircle value={d.indiceTransparencia} color="rgb(243, 177, 22)" label="Transparencia Institucional" />
          <GaugeCircle value={68} color="rgb(46, 184, 138)" label="Eficiencia de Procesos" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Evolution Chart */}
        <div className="kpi-card p-4 rounded-2xl">
          <h3 className="text-sm font-semibold mb-1">Evolución de Índices</h3>
          <p className="text-xs text-muted-foreground mb-4">Agosto 2025 – Enero 2026</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={d.encuestas} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(222 30% 18%)" />
                <XAxis 
                  dataKey="mes" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 11 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 11 }} 
                  domain={[55, 90]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0e1320', border: '1px solid #20283c', borderRadius: '6px', fontSize: '12px' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center" 
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="confianza" 
                  name="Confianza" 
                  stroke="rgb(43, 130, 238)" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: '#fff', stroke: 'rgb(43, 130, 238)', strokeWidth: 2 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="transparencia" 
                  name="Transparencia" 
                  stroke="rgb(243, 177, 22)" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: '#fff', stroke: 'rgb(243, 177, 22)', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Certifications Card */}
        <div className="kpi-card p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <FontAwesomeIcon icon={faAward} className="text-[#f3b116]" />
            <h3 className="text-sm font-semibold">Certificaciones Vigentes</h3>
          </div>
          <div className="space-y-2.5">
            {d.certificaciones.map((c) => (
              <div key={c.nombre} className="flex items-center justify-between p-3 rounded-lg bg-[rgb(25,31,46)]">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-[#2eb88a] text-sm" />
                  <span className="text-sm text-slate-200">{c.nombre}</span>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-[#2eb88a] uppercase tracking-wider">VIGENTE</div>
                  <div className="text-[10px] text-muted-foreground">Exp. {c.exp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions Card */}
      <div className="kpi-card p-4 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <FontAwesomeIcon icon={faShieldHalved} className="text-blue-500" />
          <h3 className="text-sm font-semibold">Acciones de Transparencia</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {d.acciones.map((a) => (
            <div key={a.accion} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon 
                    icon={a.avance === 100 ? faCircleCheck : faClock} 
                    className={a.avance === 100 ? "text-[#2eb88a] text-xs" : "text-[#f3b116] text-xs"} 
                  />
                  <span className="text-xs font-medium text-slate-300">{a.accion}</span>
                </div>
                <span className="font-bold text-xs" style={{ color: a.avance === 100 ? "rgb(46, 184, 138)" : "rgb(243, 177, 22)" }}>{a.avance}%</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000" 
                  style={{ 
                    width: `${a.avance}%`,
                    background: a.avance === 100 ? 'rgb(46, 184, 138)' : 'linear-gradient(90deg, rgb(43, 130, 238), rgb(243, 177, 22))'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LegitimidadPage() {
  const h = pageHeaders.legitimidad;
  const d = topicData.legitimidad;
  return (
    <div className="p-6 h-screen overflow-y-auto bg-[#03060d] text-white">
      <PageHeader badges={h.badges} title={h.title} description={h.description} />
      <div className="mt-6">
        <TopicTabs
          tabs={legitimidadTabs}
          overviewContent={<LegitimidadOverview />}
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
