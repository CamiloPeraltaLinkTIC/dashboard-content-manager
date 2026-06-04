"use client";

import { Suspense, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { KpiCards } from "@/components/kpi-cards";
import { countriesData } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { faInstagram, faFacebook, faTwitter, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faMagnifyingGlass, faRotate, faGlobe, faArrowTrendUp, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Globe = dynamic(() => import("@/components/globe").then((m) => m.GlobeComponent), {
  ssr: false,
  loading: () => (
    <div className="h-full rounded-lg flex items-center justify-center" style={{ background: "radial-gradient(ellipse at 40% 40%, #091428 0%, #030810 100%)" }}>
      <p className="text-muted-foreground text-sm">Cargando globo...</p>
    </div>
  ),
});

const platformConfig: Record<string, { color: string; icon: any; name: string }> = {
  Instagram: { color: "#E1306C", icon: faInstagram, name: "Instagram" },
  Facebook: { color: "#1877f2", icon: faFacebook, name: "Facebook" },
  X: { color: "#ffffff", icon: faTwitter, name: "X" },
  TikTok: { color: "#69C9D0", icon: faTiktok, name: "TikTok" },
};

const BrandIcon = ({ name, className = "w-4 h-4" }: { name: string, className?: string }) => {
  const normalizedName = name.toLowerCase();
  const key = Object.keys(platformConfig).find(k => k.toLowerCase() === normalizedName);
  const p = key ? platformConfig[key] : null;
  if (!p) return null;
  return <FontAwesomeIcon icon={p.icon} className={className} />;
};

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

const mapaKpis = [
  { label: "Menciones globales", value: "498.2K", delta: "+12.4%", trend: "up" as const },
  { label: "Paises activos", value: "27", delta: "+3", trend: "up" as const },
  { label: "Sentimiento global", value: "58%", delta: "+4pp", trend: "up" as const },
  { label: "Pais mas activo", value: "Colombia", delta: "187.4K", trend: "up" as const },
];

export default function MapaPage() {
  const [selected, setSelected] = useState<string | null>("CO");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const country = useMemo(() => {
      const c = countriesData.find((c) => c.id === selected);
      if (!c) return null;
      if (!selectedPlatform) return { ...c };
      const platformVol = (c.plataformas as any)[selectedPlatform] || 0;
      return { ...c, volumen: platformVol };
  }, [selected, selectedPlatform]);

  const sortedCountries = useMemo(() => {
    let data = [...countriesData];
    if (selectedPlatform) {
        data = data.filter(c => (c.plataformas as any)[selectedPlatform] > 0);
    }
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        data = data.filter(c => c.pais.toLowerCase().includes(q) || c.tema.toLowerCase().includes(q));
    }
    return data.sort((a, b) => b.volumen - a.volumen);
  }, [selectedPlatform, searchQuery]);

  return (
    <div className="h-screen flex flex-col p-6 gap-6 overflow-y-auto bg-[#03060d] text-white">
      <div className="space-y-4">
        <div className="flex gap-2">
            <span className="bg-[#1e293b] text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/20">🌐 MAPA GLOBAL</span>
            <span className="bg-[#0f291e] text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/20">● EN TIEMPO REAL</span>
            <span className="bg-[#1e293b] text-slate-400 text-xs px-2 py-1 rounded-full border border-slate-500/20">ACTUALIZADO HACE 3 MIN</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Conversación Global — CNE Colombia</h1>
          <p className="text-slate-400 mt-2">Narrativa y tendencias del proceso electoral colombiano en 27 países. Selecciona un marcador para ver el detalle.</p>
        </div>
        
        <KpiCards items={mapaKpis} />

        <div className="flex gap-4 items-center mt-4">
            <div className="relative flex-1 max-w-sm">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input 
                    type="text" 
                    placeholder="Buscar país o tema..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0b101d] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary"
                />
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" className={`bg-[#0b101d] border-white/10 ${!selectedPlatform ? 'bg-primary/20 border-primary' : 'text-white'}`} onClick={() => setSelectedPlatform(null)}>Todas</Button>
                {Object.keys(platformConfig).map(plat => (
                    <Button key={plat} variant="outline" size="sm" className={`bg-[#0b101d] border-white/10 ${selectedPlatform === plat ? 'bg-primary/20 border-primary' : 'text-white'}`} onClick={() => setSelectedPlatform(plat)}><BrandIcon name={plat} className="mr-2"/> {plat}</Button>
                ))}
                <Button variant="outline" size="sm" className="bg-[#0b101d] border-white/10 text-white"><FontAwesomeIcon icon={faRotate} className="h-4 w-4 mr-2"/> Actualizar</Button>
            </div>
        </div>
      </div>

      <div className="h-[600px] grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden bg-[#05080f] border border-white/5 shadow-none h-full">
          <Suspense fallback={<div className="h-full flex items-center justify-center">Cargando...</div>}>
            <Globe className="h-full" onSelect={setSelected} selectedCountryId={selected} selectedPlatform={selectedPlatform} />
          </Suspense>
        </Card>

        <div className="flex flex-col gap-6 h-full overflow-y-auto">
          {country ? (
            <div className="p-5 space-y-4 bg-[#0b101d] border border-white/10 rounded-2xl text-white">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-2xl font-bold text-slate-400">{country.id}</span>
                        <div>
                            <h3 className="text-xl font-bold">{country.pais}</h3>
                            <p className="text-xs text-slate-400">{country.updateTime}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#161d2b] p-4 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">Tema principal</p>
                    <p className="text-sm font-semibold text-blue-400">{country.tema}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#161d2b] p-4 rounded-xl">
                        <p className="text-2xl font-bold text-yellow-500">{country.volumen.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">menciones hoy</p>
                        <p className="text-xs text-green-500 flex items-center mt-1"><FontAwesomeIcon icon={faArrowTrendUp} className="w-3 h-3 mr-1"/> {country.pctCambio}%</p>
                    </div>
                    <div className="bg-[#161d2b] p-4 rounded-xl">
                        <p className="text-lg font-bold text-green-500 flex items-center">↑ Positivo <FontAwesomeIcon icon={faStar} className="w-3 h-3 ml-1 fill-green-500"/></p>
                        <p className="text-xs text-slate-400">Sentimiento</p>
                        <p className="text-xs text-blue-400 mt-1 flex items-center">{selectedPlatform || 'TikTok'} <FontAwesomeIcon icon={faStar} className="w-3 h-3 ml-1"/></p>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-xs text-slate-400">Distribución de sentimiento</p>
                    <div className="flex rounded-full overflow-hidden h-2.5">
                        <div style={{ width: `${country.sentimientoPct.positivo}%`, background: sentimentColors.positivo }}></div>
                        <div style={{ width: `${country.sentimientoPct.neutral}%`, background: sentimentColors.neutral }}></div>
                        <div style={{ width: `${country.sentimientoPct.negativo}%`, background: sentimentColors.negativo }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                        <span>{country.sentimientoPct.positivo}% pos</span>
                        <span>{country.sentimientoPct.neutral}% neu</span>
                        <span>{country.sentimientoPct.negativo}% neg</span>
                    </div>
                </div>

                <div>
                    <p className="text-xs text-slate-400 mb-2">Volumen por plataforma</p>
                    <div className="space-y-2">
                        {(Object.entries(country.plataformas) as [string, number][]).map(([plat, vol]) => (
                            <div key={plat} className="flex items-center gap-3">
                                <div style={{ color: platformColors[plat] }}>
                                    <BrandIcon name={plat} className="w-5 h-5"/>
                                </div>
                                <div className="flex-1 h-1.5 rounded-full bg-[#161d2b]">
                                    <div className="h-full rounded-full" style={{ width: `${(vol / country.volumen) * 100}%`, background: platformColors[plat] }}></div>
                                </div>
                                <span className="text-xs font-mono w-16 text-right">{vol.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-xs text-slate-400">Palabras clave</p>
                    <div className="flex flex-wrap gap-1">
                        {country.keywords.map((k) => <span key={k} className="px-2 py-1 rounded bg-[#161d2b] text-[10px]">{k}</span>)}
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-xs text-slate-400">Top hashtags</p>
                    <div className="flex flex-wrap gap-1">
                        {country.topHashtags.map((h) => <span key={h} className="px-2 py-1 rounded bg-[#161d2b] text-[10px] text-yellow-500">{h}</span>)}
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-[#161d2b] border border-blue-500/20 text-xs text-slate-300 leading-relaxed">
                    <p className="text-slate-400 mb-1">Resumen</p>
                    {country.resumen}
                </div>
            </div>
          ) : (
            <Card className="p-6 h-40 flex flex-col items-center justify-center text-center bg-[#0b101d]/50 border border-white/5 text-white">
                <FontAwesomeIcon icon={faGlobe} className="w-8 h-8 text-blue-500 mb-2"/>
                <h3 className="font-bold">Selecciona un país</h3>
                <p className="text-xs text-slate-400">Haz click en un marcador del globo para ver la conversación detallada del territorio</p>
            </Card>
          )}

          <Card className="flex-none shadow-md border-none bg-[#0b101d] text-white">
            <div className="p-4 font-bold text-lg flex justify-between">
                Ranking de Países <span className="text-sm font-normal text-slate-400">por menciones</span>
            </div>
            <div className="space-y-1 p-2">
                {sortedCountries.slice(0, 8).map((c, i) => (
                  <button key={c.id} onClick={() => setSelected(c.id)} className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded transition-colors">
                    <span className="font-bold text-slate-500 w-6">{i + 1}</span>
                    <span className="font-mono text-xs text-slate-300 w-6">{c.id}</span>
                    <span className="flex-1 text-sm text-left">{c.pais}</span>
                    <span className="text-sm font-semibold text-yellow-500">{(selectedPlatform ? (c.plataformas as any)[selectedPlatform] || 0 : c.volumen).toLocaleString()}</span>
                    <span className={`text-xs ${c.pctCambio > 0 ? "text-green-500" : "text-red-500"}`}>{c.pctCambio > 0 ? "↗" : "↘"} {Math.abs(c.pctCambio)}%</span>
                  </button>
                ))}
            </div>
            <div className="p-4 text-center text-xs text-slate-400 border-t border-white/5">+19 países más activos</div>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faGlobe} className="text-blue-500 w-5 h-5"/>
            Todos los Territorios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedCountries.map(c => (
                <button 
                    key={c.id} 
                    onClick={() => setSelected(c.id)}
                    className="p-4 bg-[#0b101d] border border-white/5 rounded-2xl text-left hover:border-primary/50 transition-all"
                >
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-sm">
                            <span className="font-mono text-slate-500 mr-2">{c.id}</span>
                            {c.pais}
                        </h4>
                        <span className={`text-xs font-semibold ${c.pctCambio > 0 ? "text-green-500" : "text-red-500"}`}>
                            {c.pctCambio > 0 ? "↗ +" : "↘ "} {Math.abs(c.pctCambio)}%
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3 truncate">{c.tema}</p>
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-yellow-500 text-sm">{(selectedPlatform ? (c.plataformas as any)[selectedPlatform] || 0 : c.volumen).toLocaleString()}</p>
                        <span className={`text-[10px] ${c.sentimiento === 'positivo' ? 'text-green-500' : 'text-slate-400'}`}>↑ {c.sentimiento.charAt(0).toUpperCase() + c.sentimiento.slice(1)}</span>
                    </div>
                    <div className="w-full h-1 mt-2 rounded-full bg-slate-800">
                        <div className="h-full rounded-full bg-yellow-500" style={{ width: '60%' }}></div>
                    </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
}
