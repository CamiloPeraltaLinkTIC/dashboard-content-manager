"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { TopicTabs } from "@/components/topic-tabs";
import { GaugeRing } from "@/components/gauge-ring";
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

function LegitimidadOverview() {
  const d = legitimidadData;
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Indices Institucionales CNE — Junio 2026
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-around items-center py-4">
            <GaugeRing
              value={d.indiceConfianza}
              color="hsl(213 85% 48%)"
              label="Confianza Ciudadana"
            />
            <GaugeRing
              value={d.indiceTransparencia}
              color="hsl(160 60% 45%)"
              label="Transparencia Institucional"
            />
            <GaugeRing
              value={d.indiceProcesos}
              color="hsl(42 90% 52%)"
              label="Eficiencia de Procesos"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Evolucion de Indices</CardTitle>
            <p className="text-[10px] text-muted-foreground">
              Agosto 2025 — Enero 2026
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={d.encuestas}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                <XAxis
                  dataKey="mes"
                  tick={{ fill: "hsl(213 15% 55%)", fontSize: 11 }}
                />
                <YAxis
                  tick={{ fill: "hsl(213 15% 55%)", fontSize: 11 }}
                  domain={[60, 85]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222 40% 9%)",
                    border: "1px solid hsl(222 30% 18%)",
                    borderRadius: 8,
                    color: "#fff",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: "hsl(213 15% 55%)" }}
                />
                <Line
                  type="monotone"
                  dataKey="confianza"
                  name="Confianza"
                  stroke="hsl(213 85% 48%)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(213 85% 48%)" }}
                />
                <Line
                  type="monotone"
                  dataKey="transparencia"
                  name="Transparencia"
                  stroke="hsl(42 90% 52%)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(42 90% 52%)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Certificaciones Vigentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {d.certificaciones.map((c) => (
              <div
                key={c.nombre}
                className="flex items-center justify-between text-xs border-b border-border/40 pb-2 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">●</span>
                  <span>{c.nombre}</span>
                </div>
                <div className="text-right">
                  <span className="text-cne-green font-semibold uppercase text-[10px]">
                    Vigente
                  </span>
                  <span className="text-muted-foreground text-[10px] ml-2">
                    Exp. {c.exp}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Acciones de Transparencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {d.acciones.map((a) => (
              <div key={a.accion} className="flex items-center gap-3">
                <span className="text-cne-green text-xs">●</span>
                <span className="text-xs flex-1">{a.accion}</span>
                <span className="text-xs font-semibold w-10 text-right">
                  {a.avance}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LegitimidadPage() {
  const h = pageHeaders.legitimidad;
  const d = topicData.legitimidad;
  return (
    <div className="p-6">
      <PageHeader badges={h.badges} title={h.title} description={h.description} />
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
  );
}
