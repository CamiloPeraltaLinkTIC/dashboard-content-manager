"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { TopicTabs } from "@/components/topic-tabs";
import { UserRound } from "lucide-react";
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

function QuirozOverview() {
  const q = quirozData;
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Profile card */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-accent/30 border-2 border-cne-gold flex items-center justify-center mb-3">
              <UserRound className="h-10 w-10 text-cne-gold" />
            </div>
            <h2 className="text-lg font-bold">{q.nombre}</h2>
            <p className="text-xs text-muted-foreground">{q.cargo}</p>
            <p className="text-[10px] text-muted-foreground">
              Desde {q.desde} — {q.partido}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4 w-full">
              {q.kpis.map((k) => (
                <div key={k.label}>
                  <p className="text-xl font-bold text-cne-blue">{k.value}</p>
                  <p className="text-[10px] text-muted-foreground">{k.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sentiment card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sentimiento de Menciones</CardTitle>
            <p className="text-[10px] text-muted-foreground">
              Total: {q.menciones.total.toLocaleString()} menciones
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Positivo", pct: q.menciones.positivo, color: "#2eb88a" },
              { label: "Neutral", pct: q.menciones.neutral, color: "#e8a817" },
              { label: "Negativo", pct: q.menciones.negativo, color: "#dc2828" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-xs w-16">{s.label}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                  />
                </div>
                <span className="text-xs font-semibold w-10 text-right" style={{ color: s.color }}>
                  {s.pct}%
                </span>
              </div>
            ))}
            <div className="mt-4 p-3 rounded-lg bg-accent/20 text-center">
              <p className="text-3xl font-bold text-cne-gold">
                {q.menciones.total.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground">
                menciones totales 2026
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Weekly chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Menciones por Dia</CardTitle>
            <p className="text-[10px] text-muted-foreground">Ultima semana</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={q.semanalMenciones}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                <XAxis
                  dataKey="dia"
                  tick={{ fill: "hsl(213 15% 55%)", fontSize: 11 }}
                />
                <YAxis tick={{ fill: "hsl(213 15% 55%)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222 40% 9%)",
                    border: "1px solid hsl(222 30% 18%)",
                    borderRadius: 8,
                    color: "#fff",
                  }}
                />
                <Bar dataKey="n" fill="hsl(42 90% 52%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Media appearances table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Apariciones Recientes en Medios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground">
                  <th className="text-left py-2 font-medium">Medio</th>
                  <th className="text-left py-2 font-medium">Fecha</th>
                  <th className="text-left py-2 font-medium">Tema</th>
                  <th className="text-right py-2 font-medium">Sentimiento</th>
                </tr>
              </thead>
              <tbody>
                {q.apariciones.map((a, i) => (
                  <tr key={i} className="border-b border-border/30">
                    <td className="py-2.5 font-medium flex items-center gap-2">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            a.sentimiento === "positivo"
                              ? "#2eb88a"
                              : a.sentimiento === "negativo"
                                ? "#dc2828"
                                : "#e8a817",
                        }}
                      />
                      {a.medio}
                    </td>
                    <td className="py-2.5 text-muted-foreground">{a.fecha}</td>
                    <td className="py-2.5">{a.tema}</td>
                    <td className="py-2.5 text-right">
                      <span
                        className="font-semibold uppercase text-[10px]"
                        style={{
                          color:
                            a.sentimiento === "positivo"
                              ? "#2eb88a"
                              : a.sentimiento === "negativo"
                                ? "#dc2828"
                                : "#e8a817",
                        }}
                      >
                        {a.sentimiento}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function QuirozPage() {
  const h = pageHeaders.quiroz;
  const d = topicData.quiroz;
  return (
    <div className="p-6">
      <PageHeader badges={h.badges} title={h.title} description={h.description} />
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
  );
}
