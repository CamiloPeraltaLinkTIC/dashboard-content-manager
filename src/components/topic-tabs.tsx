"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { newsCategoryColors, narrativeTypeColors, socialUrls } from "@/data/mock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faArrowUpRightFromSquare, faClock, faHashtag, faZap, faBullseye, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook, faTwitter, faTiktok } from "@fortawesome/free-brands-svg-icons";

const platformInfo: Record<string, { icon: any; color: string; label: string }> = {
  instagram: { icon: faInstagram, color: "rgb(225, 48, 108)", label: "Instagram" },
  facebook: { icon: faFacebook, color: "rgb(24, 119, 242)", label: "Facebook" },
  x: { icon: faTwitter, color: "rgb(255, 255, 255)", label: "X (Twitter)" },
  tiktok: { icon: faTiktok, color: "rgb(105, 201, 208)", label: "TikTok" },
};

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

      <TabsContent value="narrativa" className="mt-4 space-y-5 fade-in">
        {/* Gancho Narrativo */}
        <div className="rounded-xl p-5" style={{ background: "linear-gradient(135deg, rgba(18, 112, 226, 0.15), rgba(243, 177, 22, 0.08))", border: "1px solid rgba(18, 112, 226, 0.3)" }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgb(43, 130, 238)" }}>Gancho narrativo</div>
          <p className="text-base font-medium leading-relaxed">{narrativa.gancho}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="kpi-card p-4">
            <div className="text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Tipo de conversación</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {narrativa.tipoConversacion.split(" + ").map((t) => (
                <span key={t} className="px-3 py-1 rounded-full text-xs font-medium bg-white/5" style={{ color: "rgb(43, 130, 238)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="kpi-card p-4">
            <div className="text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Mensaje clave</div>
            <p className="text-sm leading-relaxed italic" style={{ color: "rgb(243, 177, 22)" }}>
                &ldquo;{narrativa.mensajeClave}&rdquo;
            </p>
          </div>
        </div>

        {/* Arco Narrativo */}
        <div className="kpi-card p-4">
          <div className="text-sm font-semibold mb-4">Arco narrativo recomendado</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {narrativa.arco.map((a, i) => (
              <div 
                key={i} 
                className="p-3 rounded-lg relative overflow-hidden bg-[rgb(21,27,40)] border-l-[3px]"
                style={{ borderColor: narrativeTypeColors[a.tipo] || "rgb(43, 130, 238)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ color: narrativeTypeColors[a.tipo] || "rgb(43, 130, 238)" }}>
                        {i + 1}
                    </div>
                    <span className="text-xs font-bold" style={{ color: narrativeTypeColors[a.tipo] || "rgb(43, 130, 238)" }}>
                        {a.fase}
                    </span>
                </div>
                <p className="text-xs text-muted-foreground">{a.mensaje}</p>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="pilares" className="mt-4 space-y-4 fade-in">
        <div className="text-sm text-muted-foreground mb-2">
            Pilares estratégicos que deben guiar toda la producción de contenido para este tema.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pilares.map((p, i) => (
            <div 
                key={p.pilar} 
                className="kpi-card p-5 flex flex-col gap-3 hover:scale-[1.02] transition-transform cursor-default rounded-xl"
            >
                <div className="text-3xl">{p.icono}</div>
                <div>
                    <div className="font-bold text-sm mb-1" style={{ color: p.color }}>
                        {p.pilar}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {p.descripcion}
                    </p>
                </div>
                <div className="w-full h-1 mt-auto rounded-full bg-slate-800/50 overflow-hidden">
                    <div 
                        className="h-full rounded-full transition-all duration-1000" 
                        style={{ 
                            width: `${70 + i * 5}%`, 
                            backgroundColor: p.color 
                        }}
                    />
                </div>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="noticias" className="mt-4 space-y-3 fade-in">
        <div className="text-sm text-muted-foreground mb-2">
            Noticias recientes relevantes para este tema en medios de comunicación colombianos.
        </div>
        {noticias.map((n, i) => (
          <div 
            key={i} 
            className="kpi-card p-4 flex items-start gap-3 hover:bg-white/5 transition-colors cursor-pointer group rounded-xl"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/5">
                <FontAwesomeIcon 
                    icon={faFileLines} 
                    className="w-3.5 h-3.5" 
                    style={{ color: newsCategoryColors[n.categoria] || "rgb(43, 130, 238)" }} 
                />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                        {n.titulo}
                    </h4>
                    <FontAwesomeIcon 
                        icon={faArrowUpRightFromSquare} 
                        className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" 
                    />
                </div>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span 
                        className="text-xs font-semibold" 
                        style={{ color: newsCategoryColors[n.categoria] || "rgb(43, 130, 238)" }}
                    >
                        {n.medio}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} className="w-2.5 h-2.5" />
                        {n.fecha}
                    </span>
                    <span 
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold" 
                        style={{ 
                            color: newsCategoryColors[n.categoria] || "rgb(43, 130, 238)",
                            background: "rgba(255,255,255,0.03)"
                        }}
                    >
                        {n.categoria}
                    </span>
                </div>
            </div>
          </div>
        ))}
      </TabsContent>

      <TabsContent value="contenido" className="mt-4 space-y-8 fade-in">
        <div className="text-sm text-muted-foreground">
            Ideas de contenido orgánico por plataforma para las cuentas del CNE Colombia.
        </div>
        {(["instagram", "facebook", "x", "tiktok"] as const).map((plat) => {
            const info = platformInfo[plat];
            const url = (socialUrls as any)[plat];
            return (
                <div key={plat} className="space-y-4">
                    {/* Platform Header Card */}
                    <div className="kpi-card p-4 rounded-xl flex items-center justify-between border-white/5">
                        <div className="flex items-center gap-2">
                            <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5" 
                                style={{ color: info.color }}
                            >
                                <FontAwesomeIcon icon={info.icon} className="text-base" />
                            </div>
                            <div>
                                <div className="font-semibold text-sm text-slate-200">{info.label}</div>
                                <a 
                                    href={url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-wider font-bold"
                                >
                                    Ver perfil <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-2 h-2" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Content Ideas Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {contenido[plat].map((c, i) => (
                            <div 
                                key={i} 
                                className="p-3 rounded-lg bg-[rgb(21,27,40)] border-l-2"
                                style={{ borderLeftColor: info.color === "rgb(255, 255, 255)" ? "rgba(255,255,255,0.2)" : info.color.replace(")", ", 0.25)") }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span 
                                        className="px-2 py-0.5 rounded text-[10px] font-bold"
                                        style={{ 
                                            background: info.color.replace("rgb", "rgba").replace(")", ", 0.125)"),
                                            color: info.color 
                                        }}
                                    >
                                        {c.formato}
                                    </span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-slate-500">
                                        {c.tipo}
                                    </span>
                                </div>
                                <p className="text-xs leading-relaxed text-slate-300 font-medium">{c.idea}</p>
                            </div>
                        ))}
                    </div>
                </div>
            );
        })}
      </TabsContent>

      <TabsContent value="conversacion" className="mt-4 space-y-4 fade-in">
        <div className="text-sm text-muted-foreground">
            Análisis de la conversación en redes sociales sobre este tema en las últimas 4 semanas.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["instagram", "facebook", "x", "tiktok"] as const).map((plat) => {
            const d = conversacion[plat];
            const info = platformInfo[plat];
            const url = (socialUrls as any)[plat];
            
            return (
              <div key={plat} className="kpi-card p-4 space-y-3 rounded-xl border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={info.icon} style={{ color: info.color }} className="text-lg" />
                    <span className="font-semibold text-sm text-slate-200">{info.label}</span>
                  </div>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg text-center bg-[rgb(21,27,40)]">
                    <div className="text-lg font-bold" style={{ color: info.color }}>
                        {d.menciones.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Menciones</div>
                  </div>
                  <div className="p-2.5 rounded-lg text-center bg-[rgb(21,27,40)]">
                    <div className="text-lg font-bold text-[#f3b116]">
                        {d.sentimiento}%
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Sentimiento +</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">Top Hashtags</div>
                  <div className="flex flex-wrap gap-1">
                    {d.topHashtags.map((h) => (
                      <span 
                        key={h} 
                        className="flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full font-bold"
                        style={{ 
                            background: info.color.replace("rgb", "rgba").replace(")", ", 0.08)"),
                            color: info.color === "rgb(255, 255, 255)" ? "rgba(255,255,255,0.8)" : info.color 
                        }}
                      >
                        <FontAwesomeIcon icon={faHashtag} className="w-2 h-2 opacity-70" />
                        {h.replace("#", "")}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs pt-1 border-t border-white/5">
                  <FontAwesomeIcon icon={faZap} className="text-[#f3b116] w-2.5 h-2.5" />
                  <span className="text-[10px] text-muted-foreground">Pico de volumen:</span>
                  <span className="text-[10px] font-bold text-[#f3b116]">{d.volumePeak}</span>
                </div>
              </div>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="pauta" className="mt-4 space-y-4 fade-in">
        <div className="text-sm text-muted-foreground">
            Ideas de piezas y campañas de pauta pagada recomendadas para amplificar la narrativa del CNE Colombia.
        </div>
        {pauta.map((p, i) => (
          <div key={i} className="kpi-card p-5 rounded-2xl border-white/5 shadow-none">
            <div className="flex items-start gap-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg" 
                style={{ background: "rgba(243, 177, 22, 0.15)", border: "1px solid rgba(243, 177, 22, 0.3)" }}
              >
                🎯
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="font-semibold text-sm" style={{ color: "rgb(243, 177, 22)" }}>{p.formato}</span>
                  <span 
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" 
                    style={{ color: "rgb(43, 130, 238)", background: "rgba(43, 130, 238, 0.1)" }}
                  >
                    {p.presupuesto}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-muted-foreground mb-0.5 flex items-center gap-1">
                      <FontAwesomeIcon icon={faBullseye} className="w-2.5 h-2.5" /> Objetivo
                    </div>
                    <div className="font-medium text-slate-200">{p.objetivo}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-0.5">CTA</div>
                    <div className="font-medium italic" style={{ color: "rgb(46, 184, 138)" }}>&ldquo;{p.cta}&rdquo;</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Plataformas</div>
                    <div className="flex gap-1.5 flex-wrap">
                      {p.plataforma.map((plat) => {
                        const platKey = plat.toLowerCase().split('/')[0];
                        const info = platformInfo[platKey] || { icon: faGlobe, color: "#888" };
                        return (
                          <span key={plat} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[rgb(32,40,60)] text-[rgb(170,170,170)]">
                            <FontAwesomeIcon icon={info.icon} className="w-2.5 h-2.5" />
                            {plat}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-0.5">Segmento</div>
                    <div className="font-medium text-slate-300">{p.segmento}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
}
