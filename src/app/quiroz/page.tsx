"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { TopicTabs } from "@/components/topic-tabs";
import {
  pageHeaders,
  quirozTabs,
  quirozData,
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
  faUser, 
  faMicrophone, 
  faTv, 
  faRadio, 
  faNewspaper, 
  faGlobe, 
  faArrowTrendUp 
} from "@fortawesome/free-solid-svg-icons";

function QuirozOverview() {
  const q = quirozData;

  const getMediaIcon = (medio: string) => {
    const name = medio.toLowerCase();
    if (name.includes("tiempo") || name.includes("semana")) return faNewspaper;
    if (name.includes("radio") || name.includes("la fm") || name.includes("blu")) return faRadio;
    if (name.includes("noticias") || name.includes("tv")) return faTv;
    return faGlobe;
  };

  return (
    <div className="space-y-5 fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="kpi-card p-5 flex flex-col items-center gap-3 text-center rounded-2xl">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center" 
            style={{ 
              background: "linear-gradient(135deg, rgb(11, 65, 132), rgb(155, 111, 8))", 
              border: "3px solid rgb(243, 177, 22)" 
            }}
          >
            <FontAwesomeIcon icon={faUser} className="text-2xl" style={{ color: "rgb(243, 177, 22)" }} />
          </div>
          <div>
            <div className="font-bold text-lg">{q.nombre}</div>
            <div className="text-sm text-muted-foreground mt-0.5">{q.cargo}</div>
            <div className="text-xs text-muted-foreground mt-1">Desde {q.desde} · {q.partido}</div>
          </div>
          <div className="w-full h-px bg-white/5 my-2"></div>
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="text-center">
              <div className="text-xl font-bold" style={{ color: "rgb(43, 130, 238)" }}>134</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">Declaraciones públicas</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold" style={{ color: "rgb(243, 177, 22)" }}>89</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">Apariciones en medios</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold" style={{ color: "rgb(43, 130, 238)" }}>12</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">Cuentas verificadas</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold" style={{ color: "rgb(243, 177, 22)" }}>47</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">Entrevistas en TV</div>
            </div>
          </div>
        </div>

        {/* Sentiment Card */}
        <div className="kpi-card p-4 flex flex-col rounded-2xl">
          <h3 className="text-sm font-semibold mb-1">Sentimiento de Menciones</h3>
          <p className="text-xs text-muted-foreground mb-3">Total: 8.421 menciones</p>
          <div className="flex-1 flex flex-col justify-center space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground text-xs">Positivo</span>
                <span className="font-bold" style={{ color: "rgb(46, 184, 138)" }}>52%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#2eb88a]" style={{ width: "52%" }}></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground text-xs">Neutral</span>
                <span className="font-bold" style={{ color: "rgb(243, 177, 22)" }}>31%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#f3b116]" style={{ width: "31%" }}></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground text-xs">Negativo</span>
                <span className="font-bold" style={{ color: "rgb(223, 58, 58)" }}>17%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#df3a3a]" style={{ width: "17%" }}></div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg text-center" style={{ background: "rgb(25, 31, 46)" }}>
            <div className="text-2xl font-bold" style={{ color: "rgb(43, 130, 238)" }}>8.421</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">menciones totales 2026</div>
          </div>
        </div>

        {/* Mentions by Day Chart */}
        <div className="kpi-card p-4 rounded-2xl">
          <h3 className="text-sm font-semibold mb-1">Menciones por Día</h3>
          <p className="text-xs text-muted-foreground mb-4">Última semana</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={q.semanalMenciones}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="dia" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 11 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 11 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0e1320', border: '1px solid #20283c', borderRadius: '6px' }}
                />
                <Bar dataKey="n" fill="hsl(213,85%,55%)" radius={[3, 3, 0, 0]} barSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Media Appearances Card */}
      <div className="kpi-card p-4 rounded-2xl">
        <div className="flex items-center gap-2 mb-3">
          <FontAwesomeIcon icon={faMicrophone} className="text-blue-500" />
          <h3 className="text-sm font-semibold">Apariciones Recientes en Medios</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs text-muted-foreground font-medium py-2 pr-4">Medio</th>
                <th className="text-left text-xs text-muted-foreground font-medium py-2 pr-4">Fecha</th>
                <th className="text-left text-xs text-muted-foreground font-medium py-2 pr-4">Tema</th>
                <th className="text-left text-xs text-muted-foreground font-medium py-2 pr-4">Sentimiento</th>
              </tr>
            </thead>
            <tbody>
              {q.apariciones.map((a, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: "rgb(43, 130, 238)" }}>
                        <FontAwesomeIcon icon={getMediaIcon(a.medio)} className="w-3 h-3" />
                      </span>
                      <span className="font-medium">{a.medio}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4 text-muted-foreground text-xs">{a.fecha}</td>
                  <td className="py-2.5 pr-4 text-slate-300">{a.tema}</td>
                  <td className="py-2.5">
                    <span 
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold" 
                        style={{ 
                            color: a.sentimiento === "positivo" ? "rgb(46, 184, 138)" : a.sentimiento === "negativo" ? "rgb(223, 58, 58)" : "rgb(243, 177, 22)",
                            background: "rgba(255,255,255,0.03)"
                        }}
                    >
                        {a.sentimiento.charAt(0).toUpperCase() + a.sentimiento.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function QuirozPage() {
  const h = pageHeaders.quiroz;
  const d = topicData.quiroz;
  return (
    <div className="p-6 h-screen overflow-y-auto bg-[#03060d] text-white">
      <PageHeader badges={h.badges} title={h.title} description={h.description} />
      <div className="mt-6">
        <TopicTabs
            tabs={quirozTabs}
            overviewContent={<QuirozOverview />}
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
