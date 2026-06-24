"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { KpiCards } from "@/components/kpi-cards";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";
import { AdminPopup } from "@/components/admin-popup";
import { NacionalMapEditor } from "@/components/nacional-map-editor";
import { COLOMBIA_DEPARTAMENTOS } from "@/data/colombia-departamentos";
import { useRealtimeRefresh } from "@/hooks/use-realtime-refresh";
import { LiveTicker } from "@/components/live-ticker";
import { SentimentDonut } from "@/components/sentiment-donut";
import { faInstagram, faFacebook, faXTwitter, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faRotate, faArrowTrendUp, faArrowTrendDown, faLocationDot, faMapLocationDot, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Globe = dynamic(() => import("@/components/globe").then((m) => m.GlobeComponent), {
  ssr: false,
  loading: () => (
    <div className="h-full rounded-lg flex items-center justify-center" style={{ background: "radial-gradient(ellipse at 40% 40%, #091428 0%, #030810 100%)" }}>
      <p className="text-muted-foreground text-sm">Cargando mapa...</p>
    </div>
  ),
});

const sentimentColors: Record<string, string> = {
  positivo: "rgb(46, 184, 138)",
  negativo: "rgb(223, 58, 58)",
  neutral: "rgb(243, 177, 22)",
  mixto: "hsl(42 90% 52%)",
};

const platformColors: Record<string, string> = {
  X: "rgb(255, 255, 255)",
  Facebook: "rgb(24, 119, 242)",
  Instagram: "rgb(225, 48, 108)",
  TikTok: "rgb(105, 201, 208)",
};

const platformConfig: Record<string, { icon: any }> = {
  TikTok: { icon: faTiktok },
  X: { icon: faXTwitter },
  Instagram: { icon: faInstagram },
  Facebook: { icon: faFacebook },
};

// Cámara inicial centrada y con zoom cerrado sobre Colombia
const COLOMBIA_POV = { lat: 4.6, lng: -73.8, altitude: 0.6 };

const DepartmentDetail = ({ dep, selectedPlatform }: { dep: any; selectedPlatform: string | null }) => {
  if (!dep) return null;
  const pct = dep.sentimientoPct || { positivo: 0, neutral: 0, negativo: 0 };
  const platformEntries = Object.entries(dep.plataformas || {}) as [string, number][];
  const trueTotal = platformEntries.reduce((acc, [, v]) => acc + (v || 0), 0);
  return (
    <div className="p-5 space-y-4 bg-[#0b101d] border border-white/10 rounded-2xl text-white">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <span className="font-mono text-2xl font-bold text-slate-400">{dep.id}</span>
          <div>
            <h3 className="text-xl font-bold leading-tight">{dep.label ?? dep.pais}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3" /> {dep.capital} · {dep.updateTime}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>
          NACIONAL
        </span>
      </div>

      <div className="bg-[#161d2b] p-4 rounded-xl">
        <p className="text-xs text-slate-400 mb-1">Tema principal</p>
        <p className="text-sm font-semibold text-blue-400">{dep.tema}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#161d2b] p-4 rounded-xl">
          <p className="text-2xl font-bold text-yellow-500">{Number(dep.volumen).toLocaleString()}</p>
          <p className="text-xs text-slate-400">menciones</p>
          <p className={`text-xs flex items-center mt-1 ${dep.pctCambio >= 0 ? "text-green-500" : "text-red-500"}`}>
            <FontAwesomeIcon icon={faArrowTrendUp} className="w-3 h-3 mr-1" /> {dep.pctCambio}%
          </p>
        </div>
        <div className="bg-[#161d2b] p-4 rounded-xl">
          <p className="text-lg font-bold capitalize" style={{ color: sentimentColors[dep.sentimiento] || "#94a3b8" }}>{dep.sentimiento}</p>
          <p className="text-xs text-slate-400">Sentimiento</p>
        </div>
      </div>

      <div className="space-y-2 bg-[#0e1526] p-4 rounded-xl border border-white/5">
        <p className="text-xs text-slate-400">Distribución de sentimiento</p>
        <SentimentDonut
          positivo={pct.positivo || 0}
          neutral={pct.neutral || 0}
          negativo={pct.negativo || 0}
          colors={{ positivo: sentimentColors.positivo, neutral: sentimentColors.neutral, negativo: sentimentColors.negativo }}
        />
      </div>

      {platformEntries.length > 0 && (
        <div>
          <p className="text-xs text-slate-400 mb-2">Volumen por plataforma</p>
          <div className="space-y-2">
            {platformEntries
              .sort((a, b) => (b[1] || 0) - (a[1] || 0))
              .map(([plat, vol]) => (
                <div key={plat} className="flex items-center gap-3">
                  <div style={{ color: platformColors[plat] }}>
                    {platformConfig[plat] ? <FontAwesomeIcon icon={platformConfig[plat].icon} className="w-5 h-5" /> : null}
                  </div>
                  <div className={`flex-1 h-1.5 rounded-full bg-[#161d2b] ${selectedPlatform && selectedPlatform !== plat ? "opacity-40" : ""}`}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${trueTotal > 0 ? ((vol || 0) / trueTotal) * 100 : 0}%`, background: platformColors[plat] }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono w-16 text-right">{(vol || 0).toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {dep.topHashtags?.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-400">Top hashtags</p>
          <div className="flex flex-wrap gap-1">
            {dep.topHashtags.map((h: string) => (
              <span key={h} className="px-2 py-1 rounded bg-[#161d2b] text-[10px] text-yellow-500">{h}</span>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl bg-[#161d2b] border border-blue-500/20 text-xs text-slate-300 leading-relaxed">
        <p className="text-slate-400 mb-1">Resumen</p>
        {dep.resumen}
      </div>
    </div>
  );
};

export default function NacionalPage() {
  const { firstName } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);

  // `silent`: refresco en vivo (Realtime) sin mostrar la pantalla de carga.
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    const { data: rows } = await supabase.from("content_manager_nacional_departamentos").select("*");
    const byId: Record<string, any> = {};
    (rows || []).forEach((r: any) => { byId[r.id] = r; });

    // La lista canónica garantiza los 33 departamentos (identidad + geometría);
    // las métricas multiplataforma se superponen desde la BD cuando existen.
    const merged = COLOMBIA_DEPARTAMENTOS.map((dep) => {
      const r = byId[dep.id];
      const plataformas = r?.plataformas ?? { TikTok: 0, X: 0, Instagram: 0, Facebook: 0 };
      const volumen = r?.volumen ?? Object.values(plataformas).reduce((a: number, b: any) => a + (Number(b) || 0), 0);
      return {
        id: dep.id,
        nombre: dep.nombre,
        label: dep.displayNombre ?? dep.nombre,
        pais: dep.nombre, // El globo usa "pais" como nombre de la región a pintar
        capital: r?.capital ?? dep.capital,
        lat: dep.lat,
        lng: dep.lng,
        tema: r?.tema ?? "",
        keywords: r?.keywords ?? [],
        sentimiento: r?.sentimiento ?? "neutral",
        sentimientoPct: r?.sentimiento_pct ?? { positivo: 0, neutral: 0, negativo: 0 },
        volumen,
        plataformaDominante: r?.plataforma_dominante ?? "TikTok",
        plataformas,
        resumen: r?.resumen ?? "",
        tendencia: r?.tendencia ?? "estable",
        pctCambio: r?.pct_cambio ?? 0,
        topHashtags: r?.top_hashtags ?? [],
        updateTime: r?.update_time ?? "",
      };
    });
    setData(merged);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualización automática en vivo: se refresca apenas entran datos nuevos
  // (desde el editor, un import de Excel o cualquier otro dispositivo).
  useRealtimeRefresh(["content_manager_nacional_departamentos"], () => fetchData(true), { paused: editorOpen });

  // Volumen según la plataforma seleccionada (o total si no hay filtro).
  const volOf = (d: any) => (selectedPlatform ? Number(d.plataformas?.[selectedPlatform]) || 0 : d.volumen || 0);

  const selectedDep = useMemo(() => data.find((d) => d.id === selected), [data, selected]);

  const sortedDeps = useMemo(
    () => [...data].sort((a, b) => volOf(b) - volOf(a)),
    [data, selectedPlatform]
  );

  const maxVolume = useMemo(() => Math.max(...data.map((d) => volOf(d)), 1), [data, selectedPlatform]);

  const kpis = useMemo(() => {
    if (data.length === 0) {
      return [
        { label: "Menciones nacionales", value: "0", delta: null, trend: "neutral" as const },
        { label: "Departamentos activos", value: "0", delta: null, trend: "neutral" as const },
        { label: "Sentimiento positivo", value: "0%", delta: null, trend: "neutral" as const },
        { label: "Departamento líder", value: "---", delta: null, trend: "neutral" as const },
      ];
    }
    const total = data.reduce((acc, d) => acc + volOf(d), 0);
    const activos = data.filter((d) => volOf(d) > 0).length;
    let wPos = 0, wVol = 0;
    data.forEach((d) => {
      const v = volOf(d);
      if (v > 0 && d.sentimientoPct) { wPos += (d.sentimientoPct.positivo || 0) * v; wVol += v; }
    });
    const avgPos = wVol > 0 ? Math.round(wPos / wVol) : 0;
    const top = sortedDeps[0];
    const fmt = (v: number) => (v >= 1000000 ? (v / 1000000).toFixed(1) + "M" : v >= 1000 ? (v / 1000).toFixed(1) + "K" : String(v));
    return [
      { label: "Menciones nacionales", value: fmt(total), delta: null, trend: "up" as const },
      { label: "Departamentos activos", value: `${activos}/${data.length}`, delta: null, trend: "neutral" as const },
      { label: "Sentimiento positivo", value: `${avgPos}%`, delta: null, trend: avgPos > 50 ? ("up" as const) : ("down" as const) },
      { label: "Departamento líder", value: top ? (top.label ?? top.pais) : "---", delta: fmt(top ? volOf(top) : 0), trend: "up" as const },
    ];
  }, [data, sortedDeps, selectedPlatform]);

  if (loading) return <div className="h-screen page-bg text-white flex justify-center items-center">Cargando conversación nacional...</div>;

  return (
    <div className="flex flex-col p-6 gap-6 page-bg text-white">
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <span className="bg-[#1e293b] text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/20">🇨🇴 MAPA NACIONAL</span>
          <span className="inline-flex items-center gap-2 bg-[#0f291e] text-green-400 text-xs px-2.5 py-1 rounded-full border border-green-500/20"><span className="live-dot" style={{ background: "#34d399", boxShadow: "0 0 8px #34d399" }} /> EN TIEMPO REAL</span>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight gradient-text text-glow-blue break-words">Conversación Nacional — CNE Colombia</h1>
          <p className="text-slate-400 mt-2">Hola {firstName}, bienvenido. Conoce la narrativa y las tendencias del proceso electoral por departamento. Haz clic en un departamento para ver el detalle.</p>
        </div>

        {sortedDeps.length > 0 && (
          <LiveTicker
            liveLabel="En vivo"
            items={sortedDeps.slice(0, 14).map((d) => ({
              code: d.id,
              label: d.label ?? d.pais,
              value: volOf(d),
              pct: d.pctCambio || 0,
              color: "#3b82f6",
            }))}
          />
        )}

        <KpiCards items={kpis} />

        <div className="flex flex-wrap gap-2 items-center mt-2">
          <Button variant="outline" size="sm" className={`bg-[#0b101d] border-white/10 ${!selectedPlatform ? "bg-primary/20 border-primary" : "text-white"}`} onClick={() => setSelectedPlatform(null)}>Todas</Button>
          {Object.keys(platformConfig).map((plat) => (
            <Button key={plat} variant="outline" size="sm" className={`bg-[#0b101d] border-white/10 ${selectedPlatform === plat ? "bg-primary/20 border-primary" : "text-white"}`} onClick={() => setSelectedPlatform(plat)}>
              <FontAwesomeIcon icon={platformConfig[plat].icon} className="mr-2" /> {plat}
            </Button>
          ))}
          <Button variant="outline" size="sm" className="bg-[#0b101d] border-white/10 text-white" onClick={() => fetchData()}>
            <FontAwesomeIcon icon={faRotate} className="h-4 w-4 mr-2" /> Actualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[600px]">
        <Card className="lg:col-span-2 overflow-hidden bg-[#05080f] border border-white/5 shadow-none h-[380px] sm:h-[460px] lg:h-full neon-frame rounded-xl">
          <Suspense fallback={<div className="h-full flex items-center justify-center">Cargando...</div>}>
            <Globe
              className="h-full"
              onSelect={(id: string) => setSelected(id || null)}
              selectedCountryId={selected}
              selectedPlatform={selectedPlatform}
              countriesData={data}
              globeMarkers={[]}
              sentimentColors={sentimentColors}
              platformColors={platformColors}
              title="Conversación Nacional — CNE Colombia"
              // Configuración geográfica: Colombia por departamentos
              geoUrl="/colombia-departamentos.geojson"
              regionNameProp="NOMBRE_DPT"
              initialPov={COLOMBIA_POV}
              tourAltitude={0.6}
              showFlag={false}
              unitLabel="menciones"
              initialTourActive={true}
              plainGlobe
            />
          </Suspense>
        </Card>

        <div className="flex flex-col gap-4 lg:h-full lg:min-h-0">
          <div className="shrink-0 lg:max-h-[58%] overflow-y-auto pr-1">
            {selectedDep ? (
              <DepartmentDetail dep={selectedDep} selectedPlatform={selectedPlatform} />
            ) : (
              <Card className="p-6 h-40 flex flex-col items-center justify-center text-center bg-[#0b101d]/50 border border-white/5 text-white">
                <FontAwesomeIcon icon={faMapLocationDot} className="w-8 h-8 text-blue-500 mb-2" />
                <h3 className="font-bold">Selecciona un departamento</h3>
                <p className="text-xs text-slate-400 mt-1">Haz clic en el mapa o en el ranking para ver el detalle de la conversación.</p>
              </Card>
            )}
          </div>

          <Card className="bg-[#0b101d] border border-white/10 p-4 text-white flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <FontAwesomeIcon icon={faLayerGroup} className="w-4 h-4 text-blue-400" /> Ranking por menciones
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-400">TOP 10</span>
            </div>
            <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-1">
              {sortedDeps.slice(0, 10).map((d, i) => {
                const rankColor = i === 0 ? "#f3b116" : i === 1 ? "#cbd5e1" : i === 2 ? "#d08b5b" : "#64748b";
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelected(d.id)}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${selected === d.id ? "bg-primary/20 border border-primary/40" : "hover:bg-white/5 border border-transparent"}`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="flex items-center gap-2 truncate">
                        <span className="font-mono font-bold w-5 text-center" style={{ color: rankColor }}>{i + 1}</span>
                        <span className="truncate">{d.label ?? d.pais}</span>
                      </span>
                      <span className="font-mono text-slate-300 shrink-0">{Number(volOf(d)).toLocaleString()}</span>
                    </div>
                    <div className="mt-1 h-1 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(volOf(d) / maxVolume) * 100}%`, background: "#3b82f6" }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Grilla de todos los departamentos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FontAwesomeIcon icon={faLayerGroup} className="w-4 h-4 text-blue-400" /> Todos los departamentos
          </h2>
          <span className="text-xs text-slate-400">{sortedDeps.length} departamentos · orden por menciones</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {sortedDeps.map((d, i) => {
            const isSel = selected === d.id;
            const up = (d.pctCambio || 0) >= 0;
            return (
              <button
                key={d.id}
                onClick={() => setSelected(d.id)}
                className={`text-left p-3 rounded-xl border transition-all ${isSel ? "bg-primary/15 border-primary/50 ring-1 ring-primary/40" : "bg-[#0b101d] border-white/10 hover:border-blue-500/40 hover:bg-white/[0.03]"}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] text-slate-500">#{i + 1} · {d.id}</span>
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: sentimentColors[d.sentimiento] || "#64748b" }}
                    title={d.sentimiento}
                  />
                </div>

                <h3 className="text-sm font-semibold text-white leading-tight truncate" title={d.label ?? d.pais}>{d.label ?? d.pais}</h3>
                <p className="text-[10px] text-slate-500 truncate mb-2">{d.capital}</p>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold" style={{ color: "#3b82f6" }}>{Number(volOf(d)).toLocaleString()}</span>
                  <span className={`text-[10px] flex items-center gap-0.5 ${up ? "text-green-500" : "text-red-500"}`}>
                    <FontAwesomeIcon icon={up ? faArrowTrendUp : faArrowTrendDown} className="w-2.5 h-2.5" />
                    {Math.abs(d.pctCambio || 0)}%
                  </span>
                </div>
                <p className="text-[9px] uppercase tracking-wider text-slate-500">menciones</p>

                <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(volOf(d) / maxVolume) * 100}%`, background: "#3b82f6" }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor (solo admin): ingresar/editar datos multiplataforma por departamento */}
      <AdminPopup title="Editor · Conversación Nacional (multiplataforma)" open={editorOpen} onOpenChange={setEditorOpen}>
        <NacionalMapEditor data={data} onSaved={() => fetchData()} />
      </AdminPopup>
    </div>
  );
}
