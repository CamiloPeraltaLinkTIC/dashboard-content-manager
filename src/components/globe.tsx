"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Globe from "react-globe.gl";
import * as topojson from "topojson-client";
import { Topology } from "topojson-specification";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Importar los iconos de FontAwesome
import { faXTwitter, faTiktok, faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faRotate, faPlay, faPause, faExpand, faCompress, faXmark, faArrowTrendUp, faStar } from "@fortawesome/free-solid-svg-icons";

// Función para convertir un icono de FA a string SVG
const faToSvg = (faIcon: any, color: string = "white") => {
    const [width, height, , , svgPathData] = faIcon.icon;
    return `<svg viewBox="0 0 ${width} ${height}" width="14" height="14" fill="${color}" style="display:inline-block; vertical-align:middle;"><path d="${svgPathData}"/></svg>`;
};

const platformIcons: Record<string, string> = {
    tiktok: faToSvg(faTiktok, "#69C9D0"),
    x: faToSvg(faXTwitter, "#ffffff"),
    instagram: faToSvg(faInstagram, "#E1306C"),
    facebook: faToSvg(faFacebook, "#1877f2")
};

const intensityColors = {
    muyAlta: "rgba(46, 184, 138, 0.6)",
    alta: "rgba(102, 214, 150, 0.5)",
    media: "rgba(255, 152, 0, 0.5)",
    baja: "rgba(239, 154, 154, 0.5)",
    sinDatos: "rgba(200, 200, 200, 0.1)"
};

const getVolumeColor = (volumen: number) => {
    if (volumen > 150000) return intensityColors.muyAlta;
    if (volumen > 100000) return intensityColors.alta;
    if (volumen > 50000) return intensityColors.media;
    if (volumen > 10000) return intensityColors.baja;
    return intensityColors.sinDatos;
};

const nameMapping: Record<string, string> = {
  "United States of America": "Estados Unidos",
  "Brazil": "Brasil",
  "Spain": "España",
  "Germany": "Alemania",
  "France": "Francia",
  "Italy": "Italia",
  "United Kingdom": "Reino Unido",
  "Japan": "Japón",
  "Russia": "Rusia",
  "Canada": "Canadá",
  "South Korea": "Corea del Sur",
  "North Korea": "Corea del Norte",
  "China": "China",
  "Dominican Rep.": "República Dominicana",
  "Dem. Rep. Congo": "República Democrática del Congo",
  "W. Sahara": "Sahara Occidental",
  "Central African Rep.": "República Centroafricana",
  "Eq. Guinea": "Guinea Ecuatorial",
  "Bosnia and Herz.": "Bosnia y Herzegovina",
  "eSwatini": "Esuatini",
  "Congo": "República del Congo",
  "Côte d'Ivoire": "Costa de Marfil",
  "Czechia": "República Checa",
  "Cape Verde": "Cabo Verde",
  "South Africa": "Sudáfrica",
  "Peru": "Perú",
  "Panama": "Panamá",
};

const normalizeName = (name: string) => {
  return name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const getCountryData = (name: string, countriesData: any[]) => {
  const normalizedInput = normalizeName(name);
  const mappedName = normalizeName(nameMapping[name] || name);
  
  return countriesData.find(c => {
    const normalizedMockName = normalizeName(c.pais);
    return normalizedMockName === normalizedInput || normalizedMockName === mappedName;
  });
};

const getMissionData = (name: string, globeMarkers: any[]) => {
    const normalizedInput = normalizeName(name);
    const mappedName = normalizeName(nameMapping[name] || name);
    return globeMarkers.find(m => {
        const normalizedMissionName = normalizeName(m.pais);
        return normalizedMissionName === normalizedInput || normalizedMissionName === mappedName;
    });
};

interface GlobeProps {
    className?: string;
    onSelect: (id: string) => void;
    selectedCountryId: string | null;
    selectedPlatform: string | null;
    hideIntensity?: boolean;
    countriesData: any[];
    globeMarkers: any[];
    title?: string;
    showDetails?: boolean;
    mode?: 'global' | 'witnesses';
    sentimentColors?: Record<string, string>;
    platformColors?: Record<string, string>;
}

export function GlobeComponent({ 
    className, 
    onSelect, 
    selectedCountryId, 
    selectedPlatform,
    hideIntensity = false,
    countriesData = [],
    globeMarkers = [],
    title = "Conversación Global CNE Colombia",
    showDetails = true,
    mode = 'global',
    // Added props
    sentimentColors = { positivo: "rgb(46, 184, 138)", negativo: "rgb(223, 58, 58)", neutral: "rgb(243, 177, 22)", mixto: "hsl(42 90% 52%)" },
    platformColors = { X: "rgb(255, 255, 255)", Facebook: "rgb(24, 119, 242)", Instagram: "rgb(225, 48, 108)", TikTok: "rgb(105, 201, 208)" }
}: GlobeProps) {
  const globeEl = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCountry, setHoveredCountry] = useState<any | null>(null);
  const [features, setFeatures] = useState<any[]>([]);
  const [isTourActive, setIsTourActive] = useState(true);
  const [activeTourCountryId, setActiveTourCountryId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const userInteracting = useRef(false);
  const tourTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Derived data for popup
  const selectedData = useMemo(() => 
    countriesData.find(c => c.id === selectedCountryId), 
  [selectedCountryId]);

  useEffect(() => {
    fetch("/world.topojson")
      .then((res) => res.json())
      .then((topology: Topology) => {
        const geojson = topojson.feature(topology, topology.objects.countries);
        setFeatures((geojson as any).features);
      });
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Sync point of view when selectedCountryId changes externally (Manual selection)
  useEffect(() => {
    // Only move camera here if tour is NOT active or if it's a manual selection
    // that needs to override the current position.
    if (selectedCountryId && globeEl.current && !isTourActive) {
        const countryData = countriesData.find(c => c.id === selectedCountryId);
        if (countryData) {
            globeEl.current.pointOfView({ lat: countryData.lat, lng: countryData.lng, altitude: 2 }, 2000);
        }
    }
  }, [selectedCountryId, countriesData, isTourActive]);

  // Country-to-Country Tour Logic
  useEffect(() => {
    if (!isTourActive || !globeEl.current || features.length === 0) {
        if (globeEl.current) globeEl.current.controls().autoRotate = false;
        if (tourTimeoutRef.current) clearTimeout(tourTimeoutRef.current);
        return;
    }

    const tourCountries = mode === 'witnesses'
        ? countriesData.filter(c => getMissionData(c.pais, globeMarkers))
        : countriesData.filter(c => c.volumen > 0);
    
    if (tourCountries.length === 0) return;

    const runTour = () => {
        if (!isTourActive) return;

        // If user is interacting or hovering, wait and try again
        if (hoveredCountry || userInteracting.current) {
            tourTimeoutRef.current = setTimeout(runTour, 2000);
            return;
        }
        
        const countryData = tourCountries[currentIndexRef.current % tourCountries.length];
        
        // ACTIVATE EVERYTHING INSTANTLY
        setActiveTourCountryId(countryData.id);
        onSelect(countryData.id);
        
        if (globeEl.current) {
            globeEl.current.pointOfView({ lat: countryData.lat, lng: countryData.lng, altitude: 2 }, 2000);
            
            tourTimeoutRef.current = setTimeout(() => {
                if (isTourActive) {
                    currentIndexRef.current++;
                    runTour();
                }
            }, 7000);
        }
    };

    tourTimeoutRef.current = setTimeout(runTour, 1000);

    return () => {
        if (tourTimeoutRef.current) clearTimeout(tourTimeoutRef.current);
    };
  }, [isTourActive, onSelect, features, hoveredCountry, countriesData, globeMarkers, mode]);

  // Helper to generate tooltip HTML content
  const getTooltipHtml = (countryId: string, isTour: boolean = false) => {
    const countryData = countriesData.find(c => c.id === countryId);
    if (!countryData && mode === 'global') return '';

    // Data for Global mode
    const dominantPlat = countryData ? Object.keys(countryData.plataformas || {}).reduce((a, b) => countryData.plataformas[a] > countryData.plataformas[b] ? a : b, "X") : "X";
    const iconSvg = platformIcons[dominantPlat.toLowerCase()] || "";
    
    // Data for Witnesses mode
    const mission = countryData ? getMissionData(countryData.pais, globeMarkers) : null;
    
    // Fallback for ID if countryData is missing but we have a mission via name mapping
    const finalId = countryData?.id || (mission ? "??" : "??");
    const flagUrl = `https://flagcdn.com/w40/${finalId.toLowerCase()}.png`;
    const finalName = countryData?.pais || mission?.pais || "País";

    let contentHtml = '';
    
    if (mode === 'witnesses') {
        if (mission) {
            contentHtml = `
                <div class="theme" style="border-color: #f3b116; color: #f3b116;">${mission.tipo}</div>
                <div class="stats" style="margin-top: 5px; padding-top: 5px;">
                    <span class="volume" style="color: #ffffff; font-size: 13px;">${mission.ciudad}</span>
                    <span class="sentiment" style="color: #3b82f6;">${mission.count} obs.</span>
                </div>
                <div style="font-size: 10px; color: #64748b; margin-top: 8px;">${mission.narrativa || ''}</div>
            `;
        } else {
            contentHtml = `<div class="theme" style="color: #64748b;">Sin misión registrada</div>`;
        }
    } else {
        if (countryData) {
            contentHtml = `
                <div class="platform">${iconSvg} ${dominantPlat} dominante</div>
                <div class="theme">${countryData.tema}</div>
                <div class="stats">
                    <span class="volume">${Number(countryData.volumen).toLocaleString()} menciones</span>
                    <span class="sentiment">Positivo</span>
                </div>
            `;
        }
    }

    return `
        <div class="globe-tooltip persistent">
            <div class="header">
                <div class="flag-box">
                    <span class="iso-code">${finalId}</span>
                    <img src="${flagUrl}" class="flag-img" alt="${finalName} flag" />
                </div>
                <div>
                    <p class="country-name">${finalName}</p>
                </div>
            </div>
            ${contentHtml}
            ${!isTour ? '<div class="footer">Clic para ver detalle completo</div>' : ''}
        </div>
    `;
  };

  const htmlElements = useMemo(() => {
    const elements = [{ lat: 4.5, lng: -74.3, type: 'hq' }];
    if (activeTourCountryId && !hoveredCountry) {
        // If witnesses mode, ensure the element has the necessary mission data
        const c = countriesData.find(c => c.id === activeTourCountryId);
        if (c) elements.push({ ...c, type: 'tooltip' } as any);
    }
    return elements;
  }, [activeTourCountryId, hoveredCountry, countriesData]);

  return (
    <div 
        ref={containerRef}
        onPointerDown={() => { userInteracting.current = true; }}
        onPointerUp={() => { 
            if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
            interactionTimeoutRef.current = setTimeout(() => { userInteracting.current = false; }, 2000);
        }}
        className={`${className} ${isFullscreen ? 'fixed inset-0 z-[9999] bg-[#03060d]' : ''}`} 
        style={{ position: isFullscreen ? 'fixed' : 'relative', width: "100%", height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <style>{`
        .pulse-container { position: relative; width: 24px; height: 24px; }
        .dot { position: absolute; top: 8px; left: 8px; width: 8px; height: 8px; background-color: #f3b116; border-radius: 50%; box-shadow: 0 0 5px #f3b116; }
        .ring { position: absolute; top: 0px; left: 0px; width: 24px; height: 24px; border: 2px solid #f3b116; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
        
        .globe-tooltip {
            background: rgba(11, 16, 29, 0.95);
            color: white;
            padding: 16px;
            border-radius: 12px;
            border: 1px solid rgba(18, 112, 226, 0.4);
            box-shadow: 0 10px 40px rgba(0,0,0,0.6);
            min-width: 250px;
            font-family: 'Satoshi', sans-serif;
            pointer-events: none;
            backdrop-filter: blur(8px);
            z-index: 1000;
        }
        .globe-tooltip.persistent { 
            transform: translate(-50%, calc(-100% - 20px));
            margin: 0;
            position: absolute;
            animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translate(-50%, -90%); } to { opacity: 1; transform: translate(-50%, calc(-100% - 20px)); } }
        
        .globe-tooltip .header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .globe-tooltip .flag-box { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .globe-tooltip .iso-code { font-family: monospace; font-size: 14px; font-weight: 700; color: #94a3b8; }
        .globe-tooltip .flag-img { width: 24px; height: 16px; object-fit: cover; border-radius: 2px; border: 1px solid rgba(255,255,255,0.1); }
        .globe-tooltip .country-name { font-size: 18px; font-weight: 700; margin: 0; line-height: 1.2; }
        .globe-tooltip .platform { font-size: 12px; color: #94a3b8; margin-top: 2px; display: flex; align-items: center; gap: 6px; }
        .globe-tooltip .theme { font-size: 13px; color: #3b82f6; margin: 12px 0; font-weight: 600; line-height: 1.4; border-left: 2px solid #3b82f6; padding-left: 10px; }
        .globe-tooltip .stats { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px; }
        .globe-tooltip .volume { color: #f3b116; font-weight: 800; font-size: 15px; }
        .globe-tooltip .sentiment { color: #2eb88a; font-weight: 800; font-size: 13px; text-transform: capitalize; }
        .globe-tooltip .footer { font-size: 11px; color: #64748b; margin-top: 14px; text-align: center; }
      `}</style>
      
      {isFullscreen && (
          <div className="absolute top-8 left-0 right-0 text-center z-[100] animate-in fade-in slide-in-from-top-4 duration-1000">
              <h1 className="text-3xl font-black tracking-[0.2em] text-white uppercase opacity-90 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  {title}
              </h1>
              <div className="w-24 h-0.5 bg-blue-500 mx-auto mt-2 opacity-50"></div>
          </div>
      )}

      {!hideIntensity && (
        <div className={`absolute bottom-6 ${isFullscreen ? 'right-6' : 'left-6'} z-[110] bg-[#0b101d]/90 p-4 rounded-xl border border-white/10 text-white text-xs w-48 shadow-2xl`}>
            <h4 className="font-bold mb-2 text-slate-300 tracking-tight">Intensidad de conversación</h4>
            <div className="space-y-1.5">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{background: intensityColors.muyAlta}}></span> Muy alta (&gt;75%)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{background: intensityColors.alta}}></span> Alta (45&mdash;75%)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{background: intensityColors.media}}></span> Media (20&mdash;45%)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{background: intensityColors.baja}}></span> Baja (&lt;20%)</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{background: intensityColors.sinDatos}}></span> Sin datos</div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#f3b116]"></span> Colombia — HQ
            </div>
        </div>
      )}

      {/* Floating Controls */}
      <div className="absolute top-4 right-4 z-[110] flex gap-2">
        <Button 
            variant="outline"
            size="sm"
            className="bg-[#0b101d] text-white border-white/20 hover:bg-white/5"
            onClick={toggleFullscreen}
        >
            <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} className="mr-2" />
            {isFullscreen ? "Salir" : "Pantalla Completa"}
        </Button>
        <Button 
            variant="outline"
            size="sm"
            className={`bg-[#0b101d] text-white border-white/20 hover:bg-white/5 ${isTourActive ? 'border-blue-500/50 text-blue-400' : ''}`}
            onClick={() => setIsTourActive(!isTourActive)}
        >
            <FontAwesomeIcon icon={isTourActive ? faPause : faPlay} className="mr-2" />
            {isTourActive ? "Pausar" : "Giro"}
        </Button>
      </div>

      {/* Fullscreen Popup Details */}
      {isFullscreen && showDetails && selectedData && (
          <div className="absolute left-6 top-24 bottom-6 w-80 bg-[#0b101d]/95 backdrop-blur-xl border border-white/10 rounded-2xl z-[100] shadow-2xl p-6 overflow-y-auto animate-in fade-in slide-in-from-left-6 duration-500">
              <div className="flex justify-between items-start mb-6">
                  <div>
                      <span className="text-2xl font-black text-slate-500/50 block mb-1">{selectedData.id}</span>
                      <h2 className="text-2xl font-bold text-white leading-tight">{selectedData.pais}</h2>
                      <p className="text-xs text-blue-400 mt-1">{selectedData.updateTime}</p>
                  </div>
                  <button onClick={() => onSelect('')} className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors">
                      <FontAwesomeIcon icon={faXmark} />
                  </button>
              </div>

              <div className="space-y-6">
                  <div className="bg-[#161d2b] p-4 rounded-xl">
                      <p className="text-xs text-slate-400 mb-1">Tema principal</p>
                      <p className="text-sm font-semibold text-blue-400">{selectedData.tema}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#161d2b] p-4 rounded-xl">
                          <p className="text-xl font-bold text-yellow-500">{Number(selectedData.volumen).toLocaleString()}</p>
                          <p className="text-xs text-slate-400">menciones hoy</p>
                          <p className="text-xs text-green-500 flex items-center mt-1"><FontAwesomeIcon icon={faArrowTrendUp} className="w-3 h-3 mr-1"/> {selectedData.pctCambio}%</p>
                      </div>
                      <div className="bg-[#161d2b] p-4 rounded-xl">
                          <p className="text-md font-bold text-green-500 flex items-center">↑ Positivo <FontAwesomeIcon icon={faStar} className="w-3 h-3 ml-1 fill-green-500"/></p>
                          <p className="text-xs text-slate-400">Sentimiento</p>
                          <p className="text-xs text-blue-400 mt-1 flex items-center">{selectedPlatform || 'TikTok'} <FontAwesomeIcon icon={faStar} className="w-3 h-3 ml-1"/></p>
                      </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-400">Distribución de sentimiento</p>
                    <div className="flex rounded-full overflow-hidden h-2.5 bg-white/5">
                        <div className="transition-all duration-700 ease-out" style={{ width: `${selectedData.sentimientoPct.positivo}%`, background: sentimentColors.positivo }}></div>
                        <div className="transition-all duration-700 ease-out" style={{ width: `${selectedData.sentimientoPct.neutral}%`, background: sentimentColors.neutral }}></div>
                        <div className="transition-all duration-700 ease-out" style={{ width: `${selectedData.sentimientoPct.negativo}%`, background: sentimentColors.negativo }}></div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-2">Volumen por plataforma</p>
                    <div className="space-y-2">
                        {(() => {
                            const platformEntries = Object.entries(selectedData.plataformas) as [string, number][];
                            const trueTotal = platformEntries.reduce((acc, [_, v]) => acc + (v || 0), 0);
                            
                            return platformEntries
                                .sort((a, b) => (b[1] || 0) - (a[1] || 0))
                                .map(([plat, vol]) => (
                                    <div key={plat} className="flex items-center gap-3">
                                        <div style={{ color: platformColors[plat] }}>
                                            <span dangerouslySetInnerHTML={{ __html: platformIcons[plat.toLowerCase()] || "" }} />
                                        </div>
                                        <div className="flex-1 h-1.5 rounded-full bg-[#161d2b]">
                                            <div 
                                                className="h-full rounded-full transition-all duration-500" 
                                                style={{ 
                                                    width: `${trueTotal > 0 ? ((vol || 0) / trueTotal) * 100 : 0}%`, 
                                                    background: platformColors[plat] 
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-mono w-16 text-right text-white">{(vol || 0).toLocaleString()}</span>
                                    </div>
                                ));
                        })()}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs text-slate-400">Palabras clave</p>
                    <div className="flex flex-wrap gap-1">
                        {selectedData.keywords?.map((k: string) => <span key={k} className="px-2 py-1 rounded bg-[#161d2b] text-[10px] text-white">{k}</span>)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-400">Top hashtags</p>
                    <div className="flex flex-wrap gap-1">
                        {selectedData.topHashtags?.map((h: string) => <span key={h} className="px-2 py-1 rounded bg-[#161d2b] text-[10px] text-yellow-500">{h}</span>)}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#161d2b] border border-blue-500/20 text-xs text-slate-300 leading-relaxed">
                      <p className="text-slate-400 mb-1">Resumen</p>
                      {selectedData.resumen}
                  </div>
              </div>
          </div>
      )}

      <Globe
        ref={globeEl}
        width={isFullscreen ? undefined : undefined}
        height={isFullscreen ? undefined : undefined}
        globeImageUrl="/earth_day.jpg"
        bumpImageUrl="/earth_normal.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        htmlElementsData={htmlElements}
        htmlElement={(d: any) => {
            const el = document.createElement('div');
            if (d.type === 'hq') {
                el.innerHTML = '<div class="pulse-container"><div class="ring"></div><div class="dot"></div></div>';
            } else {
                el.innerHTML = getTooltipHtml(d.id, true); // true = hide footer during tour
            }
            return el;
        }}
        
        polygonsData={features}
        polygonLabel={(d: any) => {
            const properties = d.properties;
            const countryData = getCountryData(properties.name, countriesData);
            const mission = getMissionData(properties.name, globeMarkers);

            if (!countryData && !mission) {
                return `<div class="bg-[#0b101d] text-white p-2 rounded-xl border border-white/10 shadow-2xl text-sm">${properties.name}</div>`;
            }

            const id = countryData?.id || mission?.id?.substring(0, 2).toUpperCase() || "??";
            const flagUrl = `https://flagcdn.com/w40/${id.toLowerCase()}.png`;
            const name = countryData?.pais || mission?.pais || properties.name;

            let content = '';

            if (mode === 'witnesses') {
                if (mission) {
                    content = `
                        <div class="theme" style="border-color: #f3b116; color: #f3b116;">${mission.tipo}</div>
                        <div class="stats" style="margin-top: 5px; padding-top: 5px;">
                            <span class="volume" style="color: #ffffff; font-size: 13px;">${mission.ciudad}</span>
                            <span class="sentiment" style="color: #3b82f6;">${mission.count} obs.</span>
                        </div>
                    `;
                } else {
                    return `<div class="bg-[#0b101d] text-white p-2 rounded-xl border border-white/10 shadow-2xl text-sm">${name}</div>`;
                }
            } else {
                if (countryData) {
                    const dominantPlat = Object.keys(countryData.plataformas || {}).reduce((a, b) => countryData.plataformas[a] > countryData.plataformas[b] ? a : b, "X");
                    const iconSvg = platformIcons[dominantPlat.toLowerCase()] || "";
                    
                    content = `
                        <div class="platform" style="font-size: 11px; color: #94a3b8; margin-top: 8px; display: flex; align-items: center; gap: 6px;">
                            ${iconSvg} ${dominantPlat} dominante
                        </div>
                        <div class="theme">${countryData.tema}</div>
                        <div class="stats">
                            <span class="volume">${Number(countryData.volumen).toLocaleString()} menciones</span>
                            <span class="sentiment">Positivo</span>
                        </div>
                    `;
                } else {
                    return `<div class="bg-[#0b101d] text-white p-2 rounded-xl border border-white/10 shadow-2xl text-sm">${name}</div>`;
                }
            }

            return `
                <div class="globe-tooltip">
                    <div class="header">
                        <div class="flag-box">
                            <span class="iso-code">${id}</span>
                            <img src="${flagUrl}" class="flag-img" alt="${name} flag" />
                        </div>
                        <div>
                            <p class="country-name">${name}</p>
                        </div>
                    </div>
                    ${content}
                    <div class="footer">Clic para ver detalle completo</div>
                </div>
            `;
        }}
        polygonAltitude={0.005}
        polygonCapColor={(d: any) => {
            const countryData = getCountryData(d.properties.name, countriesData);
            if (countryData?.id === selectedCountryId) return "#c77dff";
            if (hideIntensity) return "rgba(18, 112, 226, 0.15)";
            if (countryData) {
                const volume = selectedPlatform ? (countryData.plataformas as any)[selectedPlatform] || 0 : countryData.volumen;
                return getVolumeColor(volume);
            }
            return intensityColors.sinDatos;
        }}
        polygonSideColor={() => "rgba(0, 0, 0, 0)"}
        polygonStrokeColor={() => "#444444"}
        
        onPolygonHover={(d: any) => {
            setHoveredCountry(d);
            if (d) {
                setActiveTourCountryId(null);
            }
        }}
        onPolygonClick={(d: any) => {
            const countryData = getCountryData(d.properties.name, countriesData);
            if (countryData) {
                userInteracting.current = false;
                onSelect(countryData.id);
                setIsTourActive(false); 
                setActiveTourCountryId(countryData.id);
                
                // Update tour index to resume from here
                const tourCountries = mode === 'witnesses'
                    ? countriesData.filter(c => getMissionData(c.pais, globeMarkers))
                    : countriesData.filter(c => c.volumen > 0);
                const newIdx = tourCountries.findIndex(c => c.id === countryData.id);
                if (newIdx !== -1) currentIndexRef.current = newIdx;

                if (tourTimeoutRef.current) clearTimeout(tourTimeoutRef.current);
            }
        }}
        onZoom={(pov) => { 
            userInteracting.current = true;
            if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
            interactionTimeoutRef.current = setTimeout(() => { userInteracting.current = false; }, 3000);
        }}
      />
    </div>
  );
}
