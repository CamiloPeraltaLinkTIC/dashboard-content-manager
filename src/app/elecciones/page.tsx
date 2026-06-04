"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { KpiCards } from "@/components/kpi-cards";
import { TopicTabs } from "@/components/topic-tabs";
import {
  pageHeaders,
  eleccionesKpis,
  eleccionesTabs,
  participacionHistorica,
  calendarioElectoral,
  estadoLabels,
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

function EleccionesOverview() {
  return (
    <div className="space-y-4">
      <KpiCards items={eleccionesKpis} />

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Participacion Historica</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={participacionHistorica}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                <XAxis
                  dataKey="año"
                  tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }}
                />
                <YAxis
                  tick={{ fill: "hsl(215 15% 55%)", fontSize: 11 }}
                  domain={[40, 65]}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222 40% 9%)",
                    border: "1px solid hsl(222 30% 18%)",
                    borderRadius: 8,
                    color: "#fff",
                  }}
                />
                <Bar dataKey="pct" fill="hsl(213 85% 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Calendario Electoral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {calendarioElectoral.map((e, i) => {
                const estado = estadoLabels[e.estado];
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: estado.color }}
                    />
                    <div className="flex-1">
                      <p className="text-xs font-medium">{e.evento}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {e.fecha}
                      </p>
                    </div>
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: estado.color }}
                    >
                      {estado.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function EleccionesPage() {
  const h = pageHeaders.elecciones;
  const d = topicData.elecciones;
  return (
    <div className="p-6">
      <PageHeader badges={h.badges} title={h.title} description={h.description} />
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
  );
}
