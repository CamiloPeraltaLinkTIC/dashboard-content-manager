"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { newsCategoryColors, narrativeTypeColors } from "@/data/mock";

interface NarrativaData {
  gancho: string;
  tipoConversacion: string;
  mensajeClave: string;
  arco: { fase: string; mensaje: string; tipo: string }[];
}

interface PilarItem {
  pilar: string;
  descripcion: string;
  icono: string;
  color: string;
}

interface NoticiaItem {
  titulo: string;
  medio: string;
  fecha: string;
  url: string;
  categoria: string;
}

interface ContenidoSet {
  instagram: { formato: string; idea: string; tipo: string }[];
  facebook: { formato: string; idea: string; tipo: string }[];
  x: { formato: string; idea: string; tipo: string }[];
  tiktok: { formato: string; idea: string; tipo: string }[];
}

interface ConversacionPlatform {
  menciones: number;
  sentimiento: number;
  topHashtags: string[];
  volumePeak: string;
}

interface ConversacionSet {
  instagram: ConversacionPlatform;
  facebook: ConversacionPlatform;
  x: ConversacionPlatform;
  tiktok: ConversacionPlatform;
}

interface PautaItem {
  formato: string;
  objetivo: string;
  plataforma: string[];
  cta: string;
  segmento: string;
  presupuesto: string;
}

interface TabData {
  key: string;
  label: string;
}

interface TopicTabsProps {
  tabs: TabData[];
  overviewContent: React.ReactNode;
  narrativa: NarrativaData;
  pilares: PilarItem[];
  noticias: NoticiaItem[];
  contenido: ContenidoSet;
  conversacion: ConversacionSet;
  pauta: PautaItem[];
}

export function TopicTabs({
  tabs,
  overviewContent,
  narrativa,
  pilares,
  noticias,
  contenido,
  conversacion,
  pauta,
}: TopicTabsProps) {
  return (
    <Tabs defaultValue="overview" className="mt-6">
      <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
        {tabs.map((t) => (
          <TabsTrigger key={t.key} value={t.key} className="text-xs">
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview" className="mt-4">
        {overviewContent}
      </TabsContent>

      <TabsContent value="narrativa" className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gancho Narrativo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm italic text-muted-foreground">
              &ldquo;{narrativa.gancho}&rdquo;
            </p>
            <div className="flex flex-wrap gap-2">
              {narrativa.tipoConversacion.split(" + ").map((t) => (
                <Badge key={t} variant="secondary" className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
            <p className="text-sm font-medium">{narrativa.mensajeClave}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Arco Narrativo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {narrativa.arco.map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 border-l-2 pl-3"
                  style={{
                    borderColor:
                      narrativeTypeColors[a.tipo] || "hsl(213 85% 55%)",
                  }}
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Fase {i + 1}: {a.fase}
                    </p>
                    <p className="text-sm mt-0.5">{a.mensaje}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pilares" className="mt-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pilares.map((p) => (
            <Card key={p.pilar}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{p.icono}</span>
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: p.color }}
                  >
                    {p.pilar}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">{p.descripcion}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="noticias" className="mt-4 space-y-3">
        {noticias.map((n, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium">{n.titulo}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {n.medio} &middot; {n.fecha}
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] shrink-0"
                style={{
                  borderColor:
                    newsCategoryColors[n.categoria] || "hsl(213 85% 55%)",
                  color:
                    newsCategoryColors[n.categoria] || "hsl(213 85% 55%)",
                }}
              >
                {n.categoria}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="contenido" className="mt-4">
        <div className="grid md:grid-cols-2 gap-4">
          {(
            ["instagram", "facebook", "x", "tiktok"] as const
          ).map((plat) => (
            <Card key={plat}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm capitalize">{plat === "x" ? "X (Twitter)" : plat}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {contenido[plat].map((c, i) => (
                  <div key={i} className="border-l-2 border-primary/30 pl-3">
                    <p className="text-xs font-semibold text-muted-foreground">
                      {c.formato}
                    </p>
                    <p className="text-xs mt-0.5">{c.idea}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="conversacion" className="mt-4">
        <div className="grid sm:grid-cols-2 gap-4">
          {(
            ["instagram", "facebook", "x", "tiktok"] as const
          ).map((plat) => {
            const d = conversacion[plat];
            return (
              <Card key={plat}>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold capitalize mb-2">
                    {plat === "x" ? "X (Twitter)" : plat}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Menciones</p>
                      <p className="font-semibold">
                        {d.menciones.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sentimiento</p>
                      <div className="flex items-center gap-2">
                        <Progress value={d.sentimiento} className="h-1.5 flex-1" />
                        <span className="font-semibold">{d.sentimiento}%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Pico: {d.volumePeak}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {d.topHashtags.map((h) => (
                      <Badge
                        key={h}
                        variant="secondary"
                        className="text-[10px]"
                      >
                        {h}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="pauta" className="mt-4 space-y-3">
        {pauta.map((p, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{p.formato}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Objetivo: {p.objetivo}
                  </p>
                  <p className="text-xs mt-1">&ldquo;{p.cta}&rdquo;</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex flex-wrap justify-end gap-1">
                    {p.plataforma.map((pl) => (
                      <Badge
                        key={pl}
                        variant="outline"
                        className="text-[10px]"
                      >
                        {pl}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {p.segmento}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
}
