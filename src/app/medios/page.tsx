"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { KpiCards } from "@/components/kpi-cards";
import { pageHeaders, mediosData } from "@/data/mock";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const stackedData = mediosData.tendenciaSemanal.map((d) => ({
  ...d,
  neutrales: d.notas - d.positivas - d.negativas,
}));

export default function MediosPage() {
  const h = pageHeaders.medios;
  const d = mediosData;

  return (
    <div className="p-6">
      <PageHeader badges={h.badges} title={h.title} description={h.description} />

      <div className="space-y-4 mt-4">
        <KpiCards items={d.kpis} />

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Notas Publicadas esta Semana</CardTitle>
            <p className="text-[10px] text-muted-foreground">
              Distribucion por sentimiento — ultimos 7 dias
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stackedData}>
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
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar
                  dataKey="positivas"
                  name="Positivas"
                  stackId="a"
                  fill="#2eb88a"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="neutrales"
                  name="Neutral"
                  stackId="a"
                  fill="#e8a817"
                />
                <Bar
                  dataKey="negativas"
                  name="Negativas"
                  stackId="a"
                  fill="#dc2828"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Top Medios por Numero de Notas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {d.topMedios.map((m, i) => (
                <div key={m.medio} className="flex items-center gap-3">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold text-white shrink-0"
                    style={{
                      backgroundColor:
                        i < 3 ? "hsl(213 85% 48%)" : "hsl(222 30% 18%)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-medium flex items-center gap-1.5">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              m.sentimiento >= 65 ? "#2eb88a" : "#e8a817",
                          }}
                        />
                        {m.medio}
                      </span>
                      <span className="text-muted-foreground">
                        {m.notas} notas
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(m.notas / d.topMedios[0].notas) * 100}%`,
                          backgroundColor: "hsl(213 85% 48%)",
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {m.sentimiento}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Temas en Tendencia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {d.temasTendencia.map((t, i) => (
                <div key={t.tema} className="flex items-start gap-3">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white shrink-0"
                    style={{
                      backgroundColor:
                        i === 0
                          ? "hsl(213 85% 48%)"
                          : i === 1
                            ? "hsl(42 90% 52%)"
                            : i === 2
                              ? "hsl(160 60% 45%)"
                              : "hsl(222 30% 18%)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t.tema}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {t.count.toLocaleString()} menciones
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    ↗ trending
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
