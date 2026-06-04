"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { KpiCards } from "@/components/kpi-cards";
import { TopicTabs } from "@/components/topic-tabs";

const Globe = dynamic(() => import("@/components/globe").then((m) => m.Globe), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] rounded-lg flex items-center justify-center" style={{ background: "radial-gradient(ellipse at 40% 40%, #091428 0%, #030810 100%)" }}>
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const testigosKpis = [
  { label: "Testigos Acreditados", value: "98,430", delta: "+4,200", trend: "up" as const },
  { label: "Departamentos Cubiertos", value: "32/32", delta: "100%", trend: "up" as const },
  { label: "Observadores Internacionales", value: "12 paises", delta: null, trend: "neutral" as const },
  { label: "Meta de Cobertura", value: "142,800", delta: "68.9%", trend: "up" as const },
];

const globeData = globeMarkers.map((m) => ({
  lat: m.lat,
  lng: m.lng,
  label: m.pais,
  count: m.count,
}));

function TestigosOverview() {
  const [selected, setSelected] = useState<string | null>(null);
  const marker = globeMarkers.find((m) => m.pais === selected);

  return (
    <div className="space-y-4">
      <KpiCards items={testigosKpis} />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Globo Terraqueo — Narrativa por Pais
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Misiones internacionales de observacion acreditadas ante el CNE.
            Arrastra para rotar, haz click para ver el detalle.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3">
              <Suspense
                fallback={
                  <div className="h-[400px] rounded-lg flex items-center justify-center" style={{ background: "radial-gradient(ellipse at 40% 40%, #091428 0%, #030810 100%)" }}>
                    <p className="text-muted-foreground text-sm">Cargando globo...</p>
                  </div>
                }
              >
                <Globe
                  className="h-[400px]"
                  markers={globeData}
                  selectedMarker={selected}
                  onSelectMarker={setSelected}
                />
              </Suspense>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                Arrastra para rotar &middot; Click en un marcador
              </p>
            </div>

            <div className="lg:col-span-2 space-y-2 max-h-[440px] overflow-y-auto">
              {marker && (
                <Card className="border-primary/30 mb-3">
                  <CardContent className="p-4 space-y-2">
                    <h3 className="text-base font-semibold">{marker.pais}</h3>
                    <p className="text-xs text-muted-foreground">{marker.ciudad}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Tipo</p>
                        <p className="font-medium">{marker.tipo}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Observadores</p>
                        <p className="font-medium">{marker.count}</p>
                      </div>
                    </div>
                    <p className="text-sm">{marker.narrativa}</p>
                    <Badge variant="outline" className="text-[10px] text-cne-green border-cne-green">
                      {marker.tendencia}
                    </Badge>
                  </CardContent>
                </Card>
              )}
              {globeMarkers.map((m) => (
                <button
                  key={m.pais}
                  onClick={() => setSelected(m.pais)}
                  className={`w-full text-left border rounded-lg p-2.5 transition-colors text-xs ${
                    selected === m.pais
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{m.pais}</p>
                      <p className="text-[10px] text-muted-foreground">{m.ciudad}</p>
                    </div>
                    <Badge variant="outline" className="text-[9px]">
                      {m.tipo}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Testigos por Departamento</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={testigosPorDepartamento} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
              <XAxis type="number" tick={{ fill: "hsl(213 15% 55%)", fontSize: 11 }} />
              <YAxis dataKey="depto" type="category" width={100} tick={{ fill: "hsl(213 15% 55%)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 40% 9%)",
                  border: "1px solid hsl(222 30% 18%)",
                  borderRadius: 8,
                  color: "#fff",
                }}
                formatter={(v) => (typeof v === "number" ? v.toLocaleString() : v)}
              />
              <Bar dataKey="count" fill="hsl(160 60% 45%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TestigosPage() {
  const h = pageHeaders.testigos;
  const d = topicData.testigos;
  return (
    <div className="p-6">
      <PageHeader badges={h.badges} title={h.title} description={h.description} />
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
  );
}
