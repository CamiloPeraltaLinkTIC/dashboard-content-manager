"use client";

// nota: comentario de prueba
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import * as topojson from "topojson-client";
import { Topology } from "topojson-specification";
import { Button } from "@/components/ui/button";
import { SentimentDonut } from "@/components/sentiment-donut";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Importar los iconos de FontAwesome
import { faXTwitter, faTiktok, faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faRotate, faPlay, faPause, faExpand, faCompress, faXmark, faArrowTrendUp, faStar, faLayerGroup, faHashtag, faChartColumn, faTriangleExclamation, faBolt, faShareNodes, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

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
    muyAlta: "rgba(13, 110, 68, 0.75)",
    alta: "rgba(102, 214, 150, 0.5)",
    media: "rgba(255, 152, 0, 0.5)",
    baja: "rgba(239, 154, 154, 0.5)",
    sinDatos: "rgba(200, 200, 200, 0.1)"
};

const getVolumeColor = (volumen: number) => {
    if (volumen > 150000) return intensityColors.muyAlta;
    if (volumen > 100000) return intensityColors.alta;
    if (volumen > 50000) return intensityColors.media;
    if (volumen > 0) return intensityColors.baja;
    return intensityColors.sinDatos;
};

// Sede del CNE (Bogotá): destino de todos los arcos de conversación global.
const COLOMBIA_HQ = { lat: 4.5, lng: -74.3 };

// Elemento HTML de la sede: referencia ESTABLE a nivel de módulo. Si se recreara
// en cada recálculo de htmlElements, react-globe.gl reconstruiría su DOM y el
// pulso reiniciaría su animación constantemente (efecto "parpadeo/reinicio").
const HQ_ELEMENT = { lat: COLOMBIA_HQ.lat, lng: COLOMBIA_HQ.lng, type: "hq" as const };

// Convierte "rgb(r, g, b)" en "rgba(r, g, b, a)" para los anillos animados.
const toRgba = (rgb: string, alpha: number) => {
    if (!rgb) return `rgba(243, 177, 22, ${alpha})`;
    if (rgb.startsWith("rgba")) return rgb;
    if (rgb.startsWith("rgb")) return rgb.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
    return rgb; // hex u otro formato: se devuelve tal cual
};

// Heurística de "dispositivo de gama baja": pocos núcleos, poca RAM, pantalla
// pequeña o preferencia de movimiento reducido. Se usa para bajar la calidad
// del render (pixel ratio, antialias, conteo de estrellas, segmentos, arcos).
const detectLowEnd = () => {
    if (typeof navigator === "undefined" || typeof window === "undefined") return false;
    const n = navigator as any;
    const cores = n.hardwareConcurrency || 8;
    const mem = n.deviceMemory || 8;
    const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 700;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    return cores <= 4 || mem <= 4 || smallScreen || reduce;
};

const prefersReducedMotion = () =>
    typeof window !== "undefined" && (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);

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

// Accesores constantes del globo: definidos a nivel de módulo para que su
// identidad nunca cambie y react-globe.gl no reprocese polígonos sin necesidad.
const polygonSideColorConst = () => "rgba(0, 0, 0, 0)";
const polygonStrokeColorConst = () => "#444444";

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
    // Geografía configurable: permite reutilizar el globo para Colombia (departamentos)
    geoUrl?: string;            // TopoJSON o GeoJSON con los polígonos a pintar
    geoObjectKey?: string;      // Clave dentro de topology.objects (solo TopoJSON)
    regionNameProp?: string;    // Propiedad del feature que tiene el nombre de la región
    initialPov?: { lat: number; lng: number; altitude: number }; // Cámara inicial
    tourAltitude?: number;      // Altitud de cámara durante el tour
    showFlag?: boolean;         // Mostrar bandera de país en tooltips (off para departamentos)
    unitLabel?: string;         // Etiqueta de la métrica (ej: "menciones")
    initialTourActive?: boolean; // Si el tour automático arranca activo (default true)
    plainGlobe?: boolean;       // Globo "normal": sin arcos, anillos, nubes ni estrellas
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
    platformColors = { X: "rgb(255, 255, 255)", Facebook: "rgb(24, 119, 242)", Instagram: "rgb(225, 48, 108)", TikTok: "rgb(105, 201, 208)" },
    // Geografía (defaults = mapa mundial CNE)
    geoUrl = "/world.topojson",
    geoObjectKey = "countries",
    regionNameProp = "name",
    initialPov,
    tourAltitude = 2,
    showFlag = true,
    unitLabel = "menciones",
    initialTourActive = true,
    plainGlobe = false,
}: GlobeProps) {
  const globeEl = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCountry, setHoveredCountry] = useState<any | null>(null);
  const [features, setFeatures] = useState<any[]>([]);
  const [isTourActive, setIsTourActive] = useState(initialTourActive);
  const [activeTourCountryId, setActiveTourCountryId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // El ref del globo se asigna de forma asíncrona (react-globe.gl) y asignar un
  // ref no reejecuta efectos. Este estado avisa cuando el globo está listo para
  // que el efecto del tour vuelva a correr y arranque el autoplay al cargar.
  const [globeReady, setGlobeReady] = useState(false);
  const userInteracting = useRef(false);
  const tourTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const cloudAnimRef = useRef<number | null>(null);
  // Marca el país hacia el que el tour está moviendo la cámara, para que el efecto
  // de sincronización no dispare una segunda animación (evita el "mini salto").
  const tourMoveRef = useRef<string | null>(null);
  // Estado previo del tour: permite distinguir un arranque manual (clic en "Giro")
  // —que debe empezar YA— de una reejecución del efecto por hover/datos.
  const prevTourActiveRef = useRef(initialTourActive);
  // País seleccionado al montar (p. ej. "CO"): es un encuadre por defecto, NO un
  // clic del usuario, así que no debe apagar el autoplay al cargar.
  const initialSelectedRef = useRef(selectedCountryId);
  // Calidad adaptativa: el componente solo se monta en cliente (dynamic ssr:false),
  // así que podemos detectar la gama del dispositivo de forma síncrona.
  const [lowEnd] = useState(detectLowEnd);

  // --- Capas visuales activables (panel "Capas") ---
  const [layersOpen, setLayersOpen] = useState(false);
  const [showColumns, setShowColumns] = useState(false);   // columnas 3D de volumen
  const [showHashtags, setShowHashtags] = useState(false); // burbujas de hashtag dominante
  const [showAlerts, setShowAlerts] = useState(false);     // aura roja en sentimiento negativo
  const [showNetwork, setShowNetwork] = useState(false);   // red país↔país por hashtag
  const [showLivePings, setShowLivePings] = useState(false); // pulsos de actividad en vivo
  // Narración IA: siempre activa en modo global (no es opcional).
  // Revelado animado (build-up por volumen): null = todo visible; n = solo top-n revelados.
  const [revealCount, setRevealCount] = useState<number | null>(null);
  const revealTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Pulso de actividad "en vivo" más reciente (se renderiza como elemento HTML efímero).
  const [livePing, setLivePing] = useState<{ lat: number; lng: number; color: string; key: number } | null>(null);
  const pingSeqRef = useRef(0);
  // Narración IA: texto del subtítulo y bandera de carga.
  const [narratorText, setNarratorText] = useState<string>("");
  const [narratorLoading, setNarratorLoading] = useState(false);
  const narratorAbortRef = useRef<AbortController | null>(null);
  const narratorCacheRef = useRef<Record<string, string>>({});

  // Derived data for popup
  const selectedData = useMemo(() =>
    countriesData.find(c => c.id === selectedCountryId),
  [selectedCountryId, countriesData]);

  // Config del renderer: referencia ESTABLE. Un objeto inline en el JSX cambia de
  // identidad en cada render y react-globe.gl reprocesa props estáticas innecesariamente.
  const rendererConfig = useMemo(
    () => ({ antialias: !lowEnd, powerPreference: (lowEnd ? "low-power" : "high-performance") as WebGLPowerPreference }),
    [lowEnd]
  );

  useEffect(() => {
    fetch(geoUrl)
      .then((res) => res.json())
      .then((data: any) => {
        // Soporta tanto TopoJSON (se convierte a features) como GeoJSON directo
        if (data?.type === "Topology") {
          const geojson = topojson.feature(data as Topology, (data as any).objects[geoObjectKey]);
          setFeatures((geojson as any).features);
        } else if (data?.type === "FeatureCollection") {
          setFeatures(data.features);
        }
      });
  }, [geoUrl, geoObjectKey]);

  useEffect(() => { console.log('[TOUR] isTourActive →', isTourActive); }, [isTourActive]);
  useEffect(() => { console.log('[TOUR] features →', features.length); }, [features.length]);

  // Lee el nombre de la región desde las propiedades del feature (país o departamento)
  const getRegionName = useCallback(
    (properties: any) => properties?.[regionNameProp] ?? properties?.name ?? "",
    [regionNameProp]
  );

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Pausar el render loop WebGL cuando no se está viendo (pestaña en segundo
  // plano o globo fuera del viewport). Evita gastar GPU/CPU/batería renderizando
  // a 60fps algo invisible. react-globe.gl expone pause/resumeAnimation.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isVisible = !document.hidden;
    let isOnScreen = true;

    const apply = () => {
      const g = globeEl.current;
      if (!g) return;
      if (isVisible && isOnScreen) {
        g.resumeAnimation?.();
      } else {
        g.pauseAnimation?.();
      }
    };

    const handleVisibility = () => { isVisible = !document.hidden; apply(); };
    document.addEventListener("visibilitychange", handleVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => { isOnScreen = entry.isIntersecting; apply(); },
      { threshold: 0.05 }
    );
    observer.observe(container);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      observer.disconnect();
      globeEl.current?.resumeAnimation?.();
    };
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

  // Mueve la cámara a un país de forma fluida. globe.gl, al pedir un nuevo
  // pointOfView, hace `.end()` del tween en curso, lo que SALTA la cámara al
  // destino anterior antes de animar al nuevo (el "salto feo" al hacer clics
  // rápidos). Para evitarlo, primero congelamos la animación en la posición
  // ACTUAL (set con duración 0, sin frame intermedio visible) y luego animamos:
  // así el nuevo tween parte de donde está la cámara, sin teletransporte.
  const flyTo = useCallback((lat: number, lng: number, duration: number) => {
    const g = globeEl.current;
    if (!g?.pointOfView) return;
    try {
      const cur = g.pointOfView();
      g.pointOfView(cur, 0);
    } catch {
      // getter/setter no disponible aún
    }
    g.pointOfView({ lat, lng, altitude: tourAltitude }, duration);
  }, [tourAltitude]);

  // Única fuente de movimiento de cámara: se dispara cuando cambia selectedCountryId
  // (ya sea por el tour automático o por selección manual). Así nunca compiten dos
  // animaciones y la transición es fluida.
  useEffect(() => {
    if (selectedCountryId && globeEl.current) {
        const countryData = countriesData.find(c => c.id === selectedCountryId);
        if (countryData) {
            // ¿El cambio lo originó el tour? (lo marcó tourMoveRef antes de onSelect)
            const isTourDriven = tourMoveRef.current === selectedCountryId;

            if (isTourDriven) {
                tourMoveRef.current = null; // consumir la marca
                setActiveTourCountryId(selectedCountryId);
                flyTo(countryData.lat, countryData.lng, 2600); // transición larga y suave del tour
            } else if (selectedCountryId === initialSelectedRef.current) {
                // Encuadre del país inicial por defecto (p. ej. "CO"): NO es un clic
                // del usuario, así que solo ubica la cámara y NO apaga el autoplay.
                // Condición estable (no muta refs) → sobrevive al doble-render de
                // StrictMode en desarrollo, que antes apagaba el tour al cargar.
                setActiveTourCountryId(selectedCountryId);
                flyTo(countryData.lat, countryData.lng, 1400);
            } else if (selectedCountryId !== activeTourCountryId) {
                // Selección manual real (ranking, clic): se detiene el tour.
                // Cancelar YA el temporizador pendiente del tour evita el "minisalto":
                // si no, el tour alcanza a disparar un paso más y mueve la cámara a
                // otro país compitiendo con la animación del clic manual.
                if (tourTimeoutRef.current) clearTimeout(tourTimeoutRef.current);
                tourMoveRef.current = null;
                console.log('[TOUR] DISABLE por selección manual', { selectedCountryId, activeTourCountryId, initial: initialSelectedRef.current });
                setIsTourActive(false);
                setActiveTourCountryId(selectedCountryId);
                const tourCountries = mode === 'witnesses'
                    ? countriesData.filter(c => getMissionData(c.pais, globeMarkers))
                    : countriesData.filter(c => c.volumen > 0);
                const newIdx = tourCountries.findIndex(c => c.id === selectedCountryId);
                if (newIdx !== -1) currentIndexRef.current = newIdx;
                flyTo(countryData.lat, countryData.lng, 1400); // más ágil para clics manuales
            }
            // Si no cambió el país (p. ej. refetch de datos) no se hace nada: el tour sigue.
        }
    } else if (!selectedCountryId) {
        setActiveTourCountryId(null);
    }
  }, [selectedCountryId, countriesData, mode, globeMarkers, flyTo]);

  // Country-to-Country Tour Logic
  useEffect(() => {
    console.log(`[TOUR] effect isTourActive=${isTourActive} globeReady=${globeReady} hasGlobe=${!!globeEl.current} features=${features.length} countries=${countriesData.length} mode=${mode}`);
    if (!isTourActive || !globeReady || !globeEl.current || features.length === 0) {
        console.log(`[TOUR] gate-bail isTourActive=${isTourActive} globeReady=${globeReady} hasGlobe=${!!globeEl.current} features=${features.length}`);
        if (globeEl.current) globeEl.current.controls().autoRotate = false;
        if (tourTimeoutRef.current) clearTimeout(tourTimeoutRef.current);
        prevTourActiveRef.current = false;
        return;
    }

    // ¿El tour acaba de activarse (clic en "Giro")? Entonces arranca de inmediato;
    // si el efecto sólo se reejecutó (hover/datos) se mantiene el retardo normal.
    const startedByUser = !prevTourActiveRef.current;
    prevTourActiveRef.current = true;

    const tourCountries = mode === 'witnesses'
        ? countriesData.filter(c => getMissionData(c.pais, globeMarkers))
        : countriesData.filter(c => c.volumen > 0);

    console.log('[TOUR] tourCountries', tourCountries.length, 'startedByUser', startedByUser);
    if (tourCountries.length === 0) { console.log('[TOUR] no tourCountries → return'); return; }

    const runTour = () => {
        if (!isTourActive) { console.log('[TOUR] runTour: tour inactivo'); return; }

        // If user is interacting, hovering, or the tab is hidden, wait and retry
        if (hoveredCountry || userInteracting.current || document.hidden) {
            console.log('[TOUR] runTour: aplazado', { hovered: !!hoveredCountry, interacting: userInteracting.current, hidden: document.hidden });
            tourTimeoutRef.current = setTimeout(runTour, 2000);
            return;
        }
        console.log('[TOUR] runTour: avanzando a idx', currentIndexRef.current % tourCountries.length);

        const countryData = tourCountries[currentIndexRef.current % tourCountries.length];
        if (!countryData) return;

        // Marca el destino para que el efecto de sync mueva la cámara una sola vez.
        tourMoveRef.current = countryData.id;
        setActiveTourCountryId(countryData.id);
        onSelect(countryData.id);

        // La cámara la anima el efecto de sincronización (transición única y fluida).
        tourTimeoutRef.current = setTimeout(() => {
            if (isTourActive) {
                currentIndexRef.current++;
                runTour();
            }
        }, 7000);
    };

    if (startedByUser) {
        // Reanudación manual: llevar la cámara al país activo DE INMEDIATO (sin
        // ningún retardo) y, desde ahí, continuar el tour tras el intervalo normal.
        const activeId = selectedCountryId || activeTourCountryId;
        let idx = activeId ? tourCountries.findIndex(c => c.id === activeId) : -1;
        if (idx === -1) idx = currentIndexRef.current % tourCountries.length;
        currentIndexRef.current = idx;
        const cd = tourCountries[idx];
        console.log('[TOUR] startedByUser → arranque inmediato', { activeId, idx, cd: cd?.id });
        if (cd) {
            tourMoveRef.current = cd.id;
            setActiveTourCountryId(cd.id);
            onSelect(cd.id);
            // Re-centrado explícito e inmediato (aunque el país ya esté seleccionado,
            // en cuyo caso onSelect no movería la cámara por sí solo).
            flyTo(cd.lat, cd.lng, 800);
        }
        tourTimeoutRef.current = setTimeout(() => {
            if (isTourActive) { currentIndexRef.current++; runTour(); }
        }, 7000);
    } else {
        // Reejecución por hover/datos: retardo suave, sin re-centrar.
        tourTimeoutRef.current = setTimeout(runTour, 1000);
    }

    return () => {
        if (tourTimeoutRef.current) clearTimeout(tourTimeoutRef.current);
    };
  }, [isTourActive, globeReady, onSelect, features, hoveredCountry, countriesData, globeMarkers, mode]);

  // Helper to generate tooltip HTML content
  const getTooltipHtml = useCallback((countryId: string, isTour: boolean = false) => {
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
                    <span class="volume">${Number(countryData.volumen).toLocaleString()} ${unitLabel}</span>
                    <span class="sentiment">Positivo</span>
                </div>
            `;
        }
    }

    const flagBox = showFlag
        ? `<div class="flag-box">
                    <img src="${flagUrl}" class="flag-img" alt="${finalName} flag" />
                </div>`
        : `<div class="flag-box"><span class="iso-code">${finalId}</span></div>`;

    return `
        <div class="globe-tooltip persistent">
            <div class="header">
                ${flagBox}
                <div>
                    <p class="country-name">${finalName}</p>
                </div>
            </div>
            ${contentHtml}
            ${!isTour ? '<div class="footer">Clic para ver detalle completo</div>' : ''}
        </div>
    `;
  }, [countriesData, globeMarkers, mode, showFlag, unitLabel]);

  // --- Arcos de flujo: cada país conversa "hacia" Colombia (HQ) ---
  // El grosor y la velocidad del trazo dependen del volumen; el color, del
  // sentimiento del país (degradado país -> dorado del HQ).
  const volumeOf = useCallback(
    (c: any) => (selectedPlatform ? (c.plataformas as any)?.[selectedPlatform] || 0 : c.volumen || 0),
    [selectedPlatform]
  );

  const arcsData = useMemo(() => {
    if (mode === "witnesses" || plainGlobe) return [];
    let active = countriesData.filter(
      (c) => c.id !== "CO" && c.lat && c.lng && volumeOf(c) > 0
    );
    if (active.length === 0) return [];
    const maxVol = Math.max(...active.map(volumeOf), 1);
    // En gama baja, solo los 20 países con más volumen para aligerar el render.
    if (lowEnd) {
      active = [...active].sort((a, b) => volumeOf(b) - volumeOf(a)).slice(0, 20);
    }
    return active.map((c) => {
      const vol = volumeOf(c);
      const ratio = vol / maxVol;
      const color = sentimentColors[c.sentimiento] || sentimentColors.neutral || "#3b82f6";
      // Nota: NO se resalta por país seleccionado/tour. Si se hiciera, arcsData se
      // recalcularía en cada paso del tour y react-globe.gl redibujaría toda la capa
      // (desvanecido por arcsTransitionDuration) -> las líneas hacia Colombia
      // "parpadean" y el globo da un mini salto. El país actual ya se enfatiza con
      // el tooltip, el anillo pulsante y el enfoque de cámara.
      return {
        startLat: c.lat,
        startLng: c.lng,
        endLat: COLOMBIA_HQ.lat,
        endLng: COLOMBIA_HQ.lng,
        color: [toRgba(color, 0.7), "rgba(243, 177, 22, 0.9)"],
        stroke: Math.max(0.25, ratio * 1.6),
        // Más volumen -> dash más rápido (menor tiempo de animación).
        animTime: 4500 - ratio * 2500,
        // Desfase inicial pseudo-aleatorio para que los destellos no viajen en sincronía.
        dashInitialGap: ((c.lat * 13 + c.lng * 7) % 100) / 100,
      };
    });
  }, [countriesData, mode, volumeOf, sentimentColors, lowEnd, plainGlobe]);

  // --- Anillos pulsantes en los focos más activos ---
  const ringsData = useMemo(() => {
    if (mode === "witnesses" || plainGlobe) return [];
    const active = countriesData.filter((c) => c.id !== "CO" && c.lat && c.lng && volumeOf(c) > 0);
    if (active.length === 0) return [];
    const maxVol = Math.max(...active.map(volumeOf), 1);
    const hotspots = [...active]
      .sort((a, b) => volumeOf(b) - volumeOf(a))
      .slice(0, 6)
      .map((c) => {
        const ratio = volumeOf(c) / maxVol;
        return {
          lat: c.lat,
          lng: c.lng,
          color: sentimentColors[c.sentimiento] || sentimentColors.neutral || "rgb(59,130,246)",
          maxR: 3 + ratio * 5,
          speed: 1.5 + ratio * 2,
          period: 1400 - ratio * 600,
        };
      });
    // Onda expansiva permanente desde la sede del CNE (Colombia) en dorado.
    const hqRing = {
      lat: COLOMBIA_HQ.lat,
      lng: COLOMBIA_HQ.lng,
      color: "rgb(243, 177, 22)",
      maxR: 9,
      speed: 3,
      period: 1600,
    };
    return [hqRing, ...hotspots];
  }, [countriesData, mode, volumeOf, sentimentColors, plainGlobe]);

  const ringColorInterpolator = useCallback(
    (d: any) => (t: number) => toRgba(d.color, Math.max(0, 0.85 - t)),
    []
  );

  // --- Atmósfera reactiva al sentimiento global ---
  // El halo del planeta tiñe a verde (conversación positiva), rojo (negativa)
  // o azul (equilibrada/neutra), ponderado por volumen de menciones.
  const atmosphereColorDynamic = useMemo(() => {
    if (mode === "witnesses" || plainGlobe) return "#4aa3ff";
    let pos = 0, neg = 0, tot = 0;
    countriesData.forEach((c) => {
      const v = volumeOf(c);
      if (v <= 0) return;
      const sp = c.sentimientoPct || {};
      pos += (sp.positivo || 0) * v;
      neg += (sp.negativo || 0) * v;
      tot += v;
    });
    if (tot === 0) return "#4aa3ff";
    const p = pos / tot, n = neg / tot;
    if (p - n > 8) return "#3fd6a0";
    if (n - p > 8) return "#ff5a5a";
    return "#4aa3ff";
  }, [countriesData, mode, plainGlobe, volumeOf]);

  // Países activos ordenados por volumen (base para columnas, red y revelado).
  const rankedActive = useMemo(() => {
    if (mode === "witnesses" || plainGlobe) return [];
    return countriesData
      .filter((c) => c.id !== "CO" && c.lat && c.lng && volumeOf(c) > 0)
      .sort((a, b) => volumeOf(b) - volumeOf(a));
  }, [countriesData, mode, plainGlobe, volumeOf]);

  // Revelado animado (build-up): cuando revealCount !== null solo se muestran
  // los primeros N países más activos. Devuelve null = "mostrar todos".
  const revealedIds = useMemo(() => {
    if (revealCount === null) return null;
    return new Set(rankedActive.slice(0, revealCount).map((c) => c.id));
  }, [revealCount, rankedActive]);

  // --- Columnas 3D de volumen ("luces de ciudad") ---
  const columnsData = useMemo(() => {
    if (!showColumns || rankedActive.length === 0) return [];
    const maxVol = Math.max(...rankedActive.map(volumeOf), 1);
    const limit = lowEnd ? 20 : 45;
    return rankedActive
      .filter((c) => !revealedIds || revealedIds.has(c.id))
      .slice(0, limit)
      .map((c) => {
        const ratio = volumeOf(c) / maxVol;
        return {
          lat: c.lat,
          lng: c.lng,
          altitude: 0.08 + ratio * 0.65,
          radius: 0.28 + ratio * 0.45,
          color: toRgba(sentimentColors[c.sentimiento] || sentimentColors.neutral || "rgb(243,177,22)", 0.85),
        };
      });
  }, [showColumns, rankedActive, volumeOf, sentimentColors, lowEnd, revealedIds]);

  // --- Red de co-conversación país↔país (mismo hashtag dominante) ---
  // Conecta en estrella los países que comparten el hashtag más repetido,
  // hacia el de mayor volumen del grupo. Muestra cómo se contagia el discurso.
  const networkArcs = useMemo(() => {
    if (!showNetwork || rankedActive.length === 0) return [];
    const groups: Record<string, any[]> = {};
    rankedActive.forEach((c) => {
      const tag = (c.topHashtags?.[0] || "").toString().toLowerCase().trim();
      if (!tag) return;
      (groups[tag] = groups[tag] || []).push(c);
    });
    const arcs: any[] = [];
    Object.values(groups).forEach((members) => {
      if (members.length < 2) return;
      const hub = members[0]; // mayor volumen del grupo
      members.slice(1, lowEnd ? 4 : 8).forEach((m) => {
        if (revealedIds && !(revealedIds.has(m.id) && revealedIds.has(hub.id))) return;
        arcs.push({
          startLat: m.lat,
          startLng: m.lng,
          endLat: hub.lat,
          endLng: hub.lng,
          color: ["rgba(167, 139, 250, 0.05)", "rgba(167, 139, 250, 0.75)"],
          stroke: 0.4,
          animTime: 3200,
          dashInitialGap: ((m.lat * 11 + m.lng * 5) % 100) / 100,
        });
      });
    });
    return arcs;
  }, [showNetwork, rankedActive, lowEnd, revealedIds]);

  // --- Auras de alerta (desinformación / sentimiento negativo) ---
  const alertRings = useMemo(() => {
    if (!showAlerts || rankedActive.length === 0) return [];
    return rankedActive
      .filter((c) => {
        const sp = c.sentimientoPct || {};
        const isNeg = c.sentimiento === "negativo" || (sp.negativo || 0) >= 45;
        return isNeg && (!revealedIds || revealedIds.has(c.id));
      })
      .slice(0, 10)
      .map((c) => ({
        lat: c.lat,
        lng: c.lng,
        color: "rgb(239, 68, 68)",
        maxR: 7,
        speed: 4,
        period: 900,
      }));
  }, [showAlerts, rankedActive, revealedIds]);

  // Capas combinadas que se pasan al globo (respetan el revelado animado).
  const combinedArcs = useMemo(() => {
    const base = revealedIds ? arcsData.filter((a: any) => {
      // arcsData no lleva id; se filtra por coincidencia de coordenada de origen.
      return rankedActive.some((c) => revealedIds.has(c.id) && c.lat === a.startLat && c.lng === a.startLng);
    }) : arcsData;
    return showNetwork ? [...base, ...networkArcs] : base;
  }, [arcsData, networkArcs, showNetwork, revealedIds, rankedActive]);

  const combinedRings = useMemo(
    () => (showAlerts ? [...ringsData, ...alertRings] : ringsData),
    [ringsData, alertRings, showAlerts]
  );

  const htmlElements = useMemo(() => {
    const elements: any[] = [HQ_ELEMENT];
    // Burbujas con el hashtag dominante de cada foco activo.
    if (showHashtags) {
      rankedActive
        .filter((c) => c.topHashtags?.[0] && (!revealedIds || revealedIds.has(c.id)))
        .slice(0, lowEnd ? 6 : 12)
        .forEach((c) => elements.push({ lat: c.lat, lng: c.lng, type: 'hashtag', tag: c.topHashtags[0] }));
    }
    if (activeTourCountryId && !hoveredCountry) {
        // If witnesses mode, ensure the element has the necessary mission data
        const c = countriesData.find(c => c.id === activeTourCountryId);
        if (c) elements.push({ ...c, type: 'tooltip' } as any);
    }
    // Pulso de actividad "en vivo" (efímero, una sola onda a la vez).
    if (livePing) elements.push({ lat: livePing.lat, lng: livePing.lng, type: 'ping', color: livePing.color, key: livePing.key });
    return elements;
  }, [activeTourCountryId, hoveredCountry, countriesData, showHashtags, rankedActive, revealedIds, lowEnd, livePing]);

  // --- Accesores memoizados del globo ---
  // Mantienen identidad estable entre renders para que react-globe.gl no
  // reprocese todos los polígonos cada vez que el tour cambia de país.
  const htmlElement = useCallback((d: any) => {
    const el = document.createElement('div');
    if (d.type === 'hq') {
        el.innerHTML = '<div class="pulse-container"><div class="ring"></div><div class="dot"></div></div>';
    } else if (d.type === 'hashtag') {
        const safe = String(d.tag).replace(/[<>]/g, '');
        el.innerHTML = `<div class="hashtag-bubble">${safe.startsWith('#') ? '' : '#'}${safe.replace(/^#/, '')}</div>`;
    } else if (d.type === 'ping') {
        el.innerHTML = `<div class="live-ping" style="--ping-color:${d.color}"></div>`;
    } else {
        el.innerHTML = getTooltipHtml(d.id, true); // true = hide footer during tour
    }
    return el;
  }, [getTooltipHtml]);

  const polygonLabel = useCallback((d: any) => {
    const properties = d.properties;
    const regionName = getRegionName(properties);
    const countryData = getCountryData(regionName, countriesData);
    const mission = getMissionData(regionName, globeMarkers);

    if (!countryData && !mission) {
        return `<div class="bg-[#0b101d] text-white p-2 rounded-xl border border-white/10 shadow-2xl text-sm">${regionName}</div>`;
    }

    const id = countryData?.id || mission?.id?.substring(0, 2).toUpperCase() || "??";
    const flagUrl = `https://flagcdn.com/w40/${id.toLowerCase()}.png`;
    const name = countryData?.pais || mission?.pais || regionName;

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
                    <span class="volume">${Number(countryData.volumen).toLocaleString()} ${unitLabel}</span>
                    <span class="sentiment">Positivo</span>
                </div>
            `;
        } else {
            return `<div class="bg-[#0b101d] text-white p-2 rounded-xl border border-white/10 shadow-2xl text-sm">${name}</div>`;
        }
    }

    const labelFlagBox = showFlag
        ? `<div class="flag-box">
                    <img src="${flagUrl}" class="flag-img" alt="${name} flag" />
                </div>`
        : `<div class="flag-box"><span class="iso-code">${id}</span></div>`;

    return `
        <div class="globe-tooltip">
            <div class="header">
                ${labelFlagBox}
                <div>
                    <p class="country-name">${name}</p>
                </div>
            </div>
            ${content}
            <div class="footer">Clic para ver detalle completo</div>
        </div>
    `;
  }, [countriesData, globeMarkers, mode, getRegionName, showFlag, unitLabel]);

  const polygonCapColor = useCallback((d: any) => {
    const countryData = getCountryData(getRegionName(d.properties), countriesData);
    if (countryData?.id === selectedCountryId) return "#c77dff";
    if (hideIntensity) return "rgba(18, 112, 226, 0.15)";
    if (countryData) {
        const volume = selectedPlatform ? (countryData.plataformas as any)[selectedPlatform] || 0 : countryData.volumen;
        return getVolumeColor(volume);
    }
    return intensityColors.sinDatos;
  }, [countriesData, selectedCountryId, hideIntensity, selectedPlatform, getRegionName]);

  const onPolygonHover = useCallback((d: any) => {
    setHoveredCountry(d);
  }, []);

  const onPolygonClick = useCallback((d: any) => {
    const countryData = getCountryData(getRegionName(d.properties), countriesData);
    if (countryData) {
        userInteracting.current = false;
        onSelect(countryData.id);
    }
  }, [countriesData, onSelect, getRegionName]);

  const onZoom = useCallback(() => {
    userInteracting.current = true;
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    interactionTimeoutRef.current = setTimeout(() => { userInteracting.current = false; }, 3000);
  }, []);

  const handleGlobeReady = useCallback(() => {
    if (initialPov && globeEl.current) {
      globeEl.current.pointOfView(initialPov, 0);
    }
    // No marcamos globeReady aquí: react-globe.gl puede invocar este callback en
    // una fase donde actualizar estado dispara un warning. Lo hace el efecto de
    // sondeo (red de seguridad), que corre ya montado.
  }, [initialPov]);

  // Red de seguridad: detecta que el globo está listo (aunque onGlobeReady no
  // llegue) para aplicar el encuadre inicial y, sobre todo, marcar globeReady
  // y que arranque el autoplay. Sondea poco tiempo y se detiene.
  useEffect(() => {
    let tries = 0;
    const id = setInterval(() => {
      tries++;
      if (globeEl.current?.pointOfView) {
        if (initialPov) globeEl.current.pointOfView(initialPov, 0);
        console.log('[TOUR] globeReady=true (tras', tries, 'intentos)');
        setGlobeReady(true);
        clearInterval(id);
      } else if (tries > 30) {
        console.log('[TOUR] globeReady NUNCA: globeEl no expuso pointOfView');
        clearInterval(id);
      }
    }, 100);
    return () => clearInterval(id);
  }, [initialPov]);

  // Realismo del planeta + starfield, con calidad escalada según el dispositivo:
  // océanos especulares, luz solar, capa de nubes visible y campo de estrellas 3D
  // con parallax. En gama baja se reduce pixel ratio, segmentos y conteo de estrellas.
  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    const reduce = prefersReducedMotion();
    const sharpenTimers: ReturnType<typeof setTimeout>[] = [];

    const setup = () => {
      const g = globeEl.current;
      if (cancelled) return;
      // Nota: globeMaterial() NO existe en el ref de react-globe.gl 2.38, así que
      // NO se exige aquí (se valida aparte en el paso especular).
      if (!g || typeof g.scene !== "function" || typeof g.getGlobeRadius !== "function" || typeof g.renderer !== "function") {
        if (tries++ < 40) setTimeout(setup, 150);
        return;
      }

      const scene = g.scene();
      const globeRadius = g.getGlobeRadius();
      // El radio puede no estar listo en los primeros frames: reintentar si es inválido.
      if (!globeRadius || globeRadius <= 0) {
        if (tries++ < 40) setTimeout(setup, 150);
        return;
      }

      // Idempotencia: elimina capas previas (re-ejecución por HMR/StrictMode) para
      // no acumular nubes/estrellas/luces ni dejar versiones viejas más tenues.
      ["cne-clouds", "cne-starfield", "cne-sun-light"].forEach((nm) => {
        const old: any = scene.getObjectByName(nm);
        if (old) {
          scene.remove(old);
          old.geometry?.dispose?.();
          old.material?.map?.dispose?.();
          old.material?.alphaMap?.dispose?.();
          old.material?.dispose?.();
        }
      });

      // 0) Pixel ratio adaptativo (nitidez vs. rendimiento) y anisotropía máxima
      //    del GPU para texturas nítidas en ángulos rasantes.
      let maxAniso = 1;
      try {
        const cap = lowEnd ? 1.25 : 2;
        g.renderer().setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
        maxAniso = g.renderer().capabilities?.getMaxAnisotropy?.() ?? 1;
        // setPixelRatio solo aplica en el próximo setSize; forzamos un resize.
        window.dispatchEvent(new Event("resize"));
      } catch {
        // renderer no accesible aún
      }

      // 0.5) Nitidez del PLANETA: aplica anisotropía a las texturas del globo
      //      (day/bump). globeMaterial() no se expone, así que se recorre la escena.
      //      Se reintenta porque las texturas del globo cargan de forma asíncrona.
      const sharpenGlobe = () => {
        try {
          scene.traverse((obj: any) => {
            if (!obj.isMesh || obj.name === "cne-clouds" || obj.name === "cne-starfield") return;
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((m: any) => {
              if (!m) return;
              ["map", "bumpMap", "normalMap", "specularMap"].forEach((k) => {
                if (m[k] && m[k].anisotropy !== maxAniso) {
                  m[k].anisotropy = maxAniso;
                  m[k].needsUpdate = true;
                }
              });
            });
          });
        } catch {
          // traverse no disponible
        }
      };
      sharpenGlobe();
      const sharpenT1 = setTimeout(() => { if (!cancelled) sharpenGlobe(); }, 1200);
      const sharpenT2 = setTimeout(() => { if (!cancelled) sharpenGlobe(); }, 3000);
      sharpenTimers.push(sharpenT1, sharpenT2);

      // 1) Océanos especulares: el agua refleja la luz (omitido en gama baja).
      //    globeMaterial() puede no existir en esta versión: se valida antes de usar.
      if (!lowEnd && typeof g.globeMaterial === "function") {
        try {
          const mat: any = g.globeMaterial();
          new THREE.TextureLoader().load("/earth_specular.jpg", (tex) => {
            if (cancelled) return;
            mat.specularMap = tex;
            if ("specular" in mat) mat.specular = new THREE.Color("#3a6ea5");
            if ("shininess" in mat) mat.shininess = 14;
            mat.needsUpdate = true;
          });
        } catch {
          // material no compatible
        }
      }

      // 2) Luz solar para relieve y brillo especular.
      try {
        const sun = new THREE.DirectionalLight(0xffffff, 0.7);
        sun.position.set(-1.5, 0.8, 1.2);
        sun.name = "cne-sun-light";
        scene.add(sun);
      } catch {
        // sin escena accesible
      }

      // 3) Campo de estrellas 3D (Points = una sola draw call, muy barato). El
      //    parallax surge solo: las estrellas quedan fijas mientras la cámara orbita.
      if (!plainGlobe) try {
        const starCount = lowEnd ? 700 : 2200;
        const positions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
          // Distribución uniforme sobre una cáscara esférica lejana, con profundidad variable.
          const u = (Math.sin(i * 12.9898) * 43758.5453) % 1;
          const v = (Math.sin(i * 78.233) * 12543.4521) % 1;
          const theta = Math.abs(u) * 2 * Math.PI;
          const phi = Math.acos(2 * Math.abs(v) - 1);
          const r = globeRadius * (8 + (Math.abs(Math.sin(i * 3.1)) * 8));
          positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = r * Math.cos(phi);
        }
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const starMat = new THREE.PointsMaterial({
          color: 0xffffff,
          size: lowEnd ? 1.1 : 1.5,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
        });
        const stars = new THREE.Points(starGeo, starMat);
        stars.name = "cne-starfield";
        scene.add(stars);
        starsRef.current = stars;
      } catch {
        // sin soporte de Points
      }

      // 4) Capa de nubes en alta resolución (Solar System Scope, CC BY 4.0):
      //    nubes blancas sobre negro. Se usa la textura DIRECTO como alphaMap (el
      //    negro -> transparente, el blanco -> nube), con filtrado nativo del GPU
      //    (anisotropía + mipmaps) para máxima nitidez. 4K en gama alta, 2K en baja.
      const cloudUrl = lowEnd ? "/earth_clouds_2k.jpg" : "/earth_clouds_4k.jpg";
      if (!plainGlobe) new THREE.TextureLoader().load(cloudUrl, (cloudTex) => {
        if (cancelled || !globeEl.current) return;

        cloudTex.anisotropy = maxAniso;
        cloudTex.minFilter = THREE.LinearMipmapLinearFilter;
        cloudTex.magFilter = THREE.LinearFilter;
        cloudTex.generateMipmaps = true;
        cloudTex.needsUpdate = true;

        const seg = lowEnd ? 48 : 96;
        const radius = globeRadius * 1.02;
        const clouds = new THREE.Mesh(
          new THREE.SphereGeometry(radius, seg, seg),
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            alphaMap: cloudTex,     // luminancia de la textura = densidad de nube
            transparent: true,
            opacity: 0.45,
            depthWrite: false,
          })
        );
        clouds.name = "cne-clouds";
        clouds.renderOrder = 2;
        globeEl.current.scene().add(clouds);
        cloudsRef.current = clouds;
      });

      // 5) Animación única (nubes + leve giro de estrellas), salvo movimiento reducido.
      if (!reduce && !plainGlobe) {
        const animate = () => {
          if (cancelled) return;
          if (!document.hidden) {
            if (cloudsRef.current) cloudsRef.current.rotation.y += (-0.006 * Math.PI) / 180;
            if (starsRef.current && !lowEnd) starsRef.current.rotation.y += (0.0008 * Math.PI) / 180;
          }
          cloudAnimRef.current = requestAnimationFrame(animate);
        };
        animate();
      }
    };

    setup();

    return () => {
      cancelled = true;
      if (cloudAnimRef.current) cancelAnimationFrame(cloudAnimRef.current);
      sharpenTimers.forEach(clearTimeout);
      const g = globeEl.current;
      const disposeObj = (obj: any) => {
        if (!obj) return;
        try { g?.scene?.().remove(obj); } catch { /* escena destruida */ }
        obj.geometry?.dispose?.();
        const m = obj.material;
        if (Array.isArray(m)) m.forEach((mm: any) => mm?.dispose?.());
        else m?.dispose?.();
        m?.map?.dispose?.();
        m?.alphaMap?.dispose?.();
      };
      disposeObj(cloudsRef.current);
      disposeObj(starsRef.current);
      cloudsRef.current = null;
      starsRef.current = null;
      if (g?.scene) {
        try {
          const sun = g.scene().getObjectByName("cne-sun-light");
          if (sun) g.scene().remove(sun);
        } catch {
          // ignore
        }
      }
    };
  }, [lowEnd, plainGlobe]);

  // --- Pulsos de actividad "en vivo" ---
  // Emite ondas periódicas en países activos, con probabilidad proporcional al
  // volumen. Da la sensación de conversación en curso sin depender de realtime DB.
  useEffect(() => {
    if (!showLivePings || rankedActive.length === 0) { setLivePing(null); return; }
    let cancelled = false;
    let timer: NodeJS.Timeout;
    const tick = () => {
      if (cancelled) return;
      const pool = rankedActive.slice(0, lowEnd ? 15 : 30);
      const weights = pool.map(volumeOf);
      const total = weights.reduce((a, b) => a + b, 0) || 1;
      // Selección ponderada determinista (hash sobre el contador, sin estado global).
      let r = ((((Math.sin(pingSeqRef.current * 99.13) * 99999) % 1) + 1) % 1) * total;
      let pick = pool[0];
      for (let i = 0; i < pool.length; i++) { r -= weights[i]; if (r <= 0) { pick = pool[i]; break; } }
      pingSeqRef.current += 1;
      setLivePing({
        lat: pick.lat,
        lng: pick.lng,
        color: toRgba(sentimentColors[pick.sentimiento] || sentimentColors.neutral || "rgb(243,177,22)", 0.9),
        key: pingSeqRef.current,
      });
      timer = setTimeout(tick, 2000 + (pingSeqRef.current % 5) * 300);
    };
    timer = setTimeout(tick, 800);
    return () => { cancelled = true; clearTimeout(timer); setLivePing(null); };
  }, [showLivePings, rankedActive, lowEnd, volumeOf, sentimentColors]);

  // --- Revelado animado (build-up por volumen) ---
  const startReveal = useCallback(() => {
    if (revealTimerRef.current) clearInterval(revealTimerRef.current);
    const total = rankedActive.length;
    if (total === 0) return;
    setIsTourActive(false);
    let n = 1;
    setRevealCount(1);
    revealTimerRef.current = setInterval(() => {
      n += 1;
      if (n >= total) {
        setRevealCount(null);
        if (revealTimerRef.current) clearInterval(revealTimerRef.current);
      } else {
        setRevealCount(n);
      }
    }, 260);
  }, [rankedActive]);

  useEffect(() => () => { if (revealTimerRef.current) clearInterval(revealTimerRef.current); }, []);

  // --- Narración IA durante el tour ---
  // Pide a Claude una frase por país enfocado y la muestra como subtítulo.
  useEffect(() => {
    if (mode !== "global") { setNarratorText(""); return; }
    const id = activeTourCountryId || selectedCountryId;
    if (!id) return;
    const c = countriesData.find((x) => x.id === id);
    if (!c) return;
    if (narratorCacheRef.current[id]) { setNarratorText(narratorCacheRef.current[id]); return; }
    narratorAbortRef.current?.abort();
    const ctrl = new AbortController();
    narratorAbortRef.current = ctrl;
    setNarratorLoading(true);
    setNarratorText("");
    fetch("/api/globe-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: ctrl.signal,
      body: JSON.stringify({
        mode: "narration",
        country: {
          pais: c.pais, tema: c.tema, volumen: c.volumen, sentimiento: c.sentimiento,
          sentimientoPct: c.sentimientoPct, plataformas: c.plataformas,
          topHashtags: c.topHashtags, keywords: c.keywords, pctCambio: c.pctCambio,
        },
      }),
    })
      .then((r) => r.json())
      .then((d) => { if (d?.text) { narratorCacheRef.current[id] = d.text; setNarratorText(d.text); } })
      .catch(() => {})
      .finally(() => setNarratorLoading(false));
    return () => ctrl.abort();
  }, [activeTourCountryId, selectedCountryId, mode, countriesData]);

  return (
    <div
        ref={containerRef}
        onPointerDown={(e) => {
            userInteracting.current = true;
            // Si el usuario interactúa directamente con el globo (canvas) —girar,
            // arrastrar o hacer clic— y el tour está activo, se apaga el autoplay.
            // Los botones del overlay no son <canvas>, así que no lo desactivan.
            if (isTourActive && (e.target as HTMLElement)?.tagName === "CANVAS") {
                console.log('[TOUR] DISABLE por pointerdown en canvas');
                setIsTourActive(false);
            }
        }}
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
        .globe-tooltip .flag-img { width: 32px; height: 22px; object-fit: cover; border-radius: 3px; border: 1px solid rgba(255,255,255,0.15); }
        .globe-tooltip .country-name { font-size: 18px; font-weight: 700; margin: 0; line-height: 1.2; }
        .globe-tooltip .platform { font-size: 12px; color: #94a3b8; margin-top: 2px; display: flex; align-items: center; gap: 6px; }
        .globe-tooltip .theme { font-size: 13px; color: #3b82f6; margin: 12px 0; font-weight: 600; line-height: 1.4; border-left: 2px solid #3b82f6; padding-left: 10px; }
        .globe-tooltip .stats { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px; }
        .globe-tooltip .volume { color: #f3b116; font-weight: 800; font-size: 15px; }
        .globe-tooltip .sentiment { color: #2eb88a; font-weight: 800; font-size: 13px; text-transform: capitalize; }
        .globe-tooltip .footer { font-size: 11px; color: #64748b; margin-top: 14px; text-align: center; }

        .hashtag-bubble {
            transform: translate(-50%, -170%);
            background: rgba(11, 16, 29, 0.9);
            color: #7dd3fc;
            border: 1px solid rgba(125, 211, 252, 0.4);
            padding: 3px 9px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            pointer-events: none;
            backdrop-filter: blur(4px);
            box-shadow: 0 4px 14px rgba(0,0,0,0.5);
            font-family: 'Satoshi', sans-serif;
            animation: fadeIn 0.4s ease-out;
        }
        .live-ping {
            position: absolute; top: 0; left: 0;
            width: 12px; height: 12px;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            background: var(--ping-color, #f3b116);
            box-shadow: 0 0 8px var(--ping-color, #f3b116);
            pointer-events: none;
        }
        .live-ping::after {
            content: ''; position: absolute; inset: -3px;
            border-radius: 50%;
            border: 2px solid var(--ping-color, #f3b116);
            animation: pingExpand 2s ease-out forwards;
        }
        @keyframes pingExpand { 0% { transform: scale(0.4); opacity: 0.9; } 100% { transform: scale(4.5); opacity: 0; } }
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
        <div className={`absolute bottom-3 sm:bottom-6 ${isFullscreen ? 'right-3 sm:right-6' : 'left-3 sm:left-6'} z-[110] bg-[#0b101d]/90 p-3 sm:p-4 rounded-xl border border-white/10 text-white text-[11px] sm:text-xs w-40 sm:w-48 shadow-2xl`}>
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
      <div className="absolute top-3 right-3 z-[110] flex flex-wrap justify-end gap-2 max-w-[calc(100%-1.5rem)]">
        {mode === 'global' && !plainGlobe && (
          <Button
              variant="outline"
              size="sm"
              className={`bg-[#0b101d] text-white border-white/20 hover:bg-white/5 ${layersOpen ? 'border-blue-500/50 text-blue-400' : ''}`}
              onClick={() => setLayersOpen((v) => !v)}
          >
              <FontAwesomeIcon icon={faLayerGroup} className="sm:mr-2" />
              <span className="hidden sm:inline">Capas</span>
          </Button>
        )}
        <Button
            variant="outline"
            size="sm"
            className="bg-[#0b101d] text-white border-white/20 hover:bg-white/5"
            onClick={toggleFullscreen}
        >
            <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} className="sm:mr-2" />
            <span className="hidden sm:inline">{isFullscreen ? "Salir" : "Pantalla Completa"}</span>
        </Button>
        <Button
            variant="outline"
            size="sm"
            className={`bg-[#0b101d] text-white border-white/20 hover:bg-white/5 ${isTourActive ? 'border-blue-500/50 text-blue-400' : ''}`}
            onClick={() => {
                const next = !isTourActive;
                if (next) {
                    // El clic sobre el botón disparó el onPointerDown del contenedor
                    // (marca "usuario interactuando"). Lo reseteamos para que el tour
                    // arranque YA y no espere el retardo anti-interacción.
                    userInteracting.current = false;
                    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
                }
                setIsTourActive(next);
            }}
        >
            <FontAwesomeIcon icon={isTourActive ? faPause : faPlay} className="sm:mr-2" />
            <span className="hidden sm:inline">{isTourActive ? "Pausar" : "Giro"}</span>
        </Button>
      </div>

      {/* Panel de Capas */}
      {layersOpen && mode === 'global' && !plainGlobe && (
        <div className="absolute top-16 right-4 z-[120] w-64 bg-[#0b101d]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between px-1 pb-2 mb-1 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Capas del globo</span>
            <button onClick={() => setLayersOpen(false)} className="text-slate-500 hover:text-white">
              <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" />
            </button>
          </div>
          {[
            { on: showColumns, set: setShowColumns, icon: faChartColumn, label: "Columnas 3D", desc: "Volumen en relieve", color: "text-yellow-400" },
            { on: showHashtags, set: setShowHashtags, icon: faHashtag, label: "Hashtags", desc: "Burbujas por país", color: "text-sky-400" },
            { on: showAlerts, set: setShowAlerts, icon: faTriangleExclamation, label: "Alertas", desc: "Sentimiento negativo", color: "text-red-400" },
            { on: showNetwork, set: setShowNetwork, icon: faShareNodes, label: "Red de discurso", desc: "País ↔ país por hashtag", color: "text-violet-400" },
            { on: showLivePings, set: setShowLivePings, icon: faBolt, label: "Pulsos en vivo", desc: "Actividad en tiempo real", color: "text-emerald-400" },
          ].map((row) => (
            <button
              key={row.label}
              onClick={() => row.set((v: boolean) => !v)}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
            >
              <FontAwesomeIcon icon={row.icon} className={`w-4 h-4 ${row.on ? row.color : 'text-slate-600'}`} />
              <span className="flex-1">
                <span className="block text-xs font-semibold text-white leading-tight">{row.label}</span>
                <span className="block text-[10px] text-slate-500 leading-tight">{row.desc}</span>
              </span>
              <span className={`relative w-9 h-5 rounded-full transition-colors ${row.on ? 'bg-blue-500/80' : 'bg-white/10'}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${row.on ? 'left-[18px]' : 'left-0.5'}`} />
              </span>
            </button>
          ))}
          <button
            onClick={startReveal}
            disabled={revealCount !== null}
            className="w-full mt-2 flex items-center justify-center gap-2 px-2 py-2 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold hover:bg-blue-500/25 transition-colors disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faPlay} className="w-3 h-3" />
            {revealCount !== null ? `Revelando… (${revealCount})` : "Revelar conversación"}
          </button>
        </div>
      )}

      {/* Subtítulo de narración IA (siempre activo en modo global).
          Pantalla completa: a la derecha, centrado vertical y un poco más grande.
          Ventana normal: centrado abajo (comportamiento normal). */}
      {mode === 'global' && (narratorText || narratorLoading) && (
        <div
          className={`absolute z-[120] rounded-2xl bg-[#0b101d]/90 backdrop-blur-md border border-fuchsia-500/30 shadow-2xl animate-in fade-in duration-500 ${
            isFullscreen
              ? 'right-6 top-1/2 -translate-y-1/2 max-w-sm px-6 py-4'
              : 'bottom-8 left-1/2 -translate-x-1/2 max-w-[80%] px-5 py-3'
          }`}
        >
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faWandMagicSparkles} className={`text-fuchsia-400 shrink-0 ${isFullscreen ? 'w-6 h-6' : 'w-4 h-4'}`} />
            <p className={`text-slate-100 leading-snug ${isFullscreen ? 'text-lg' : 'text-sm'}`}>
              {narratorLoading && !narratorText ? <span className="text-slate-400 italic">Analizando conversación…</span> : narratorText}
            </p>
          </div>
        </div>
      )}

      {/* Fullscreen Popup Details */}
      {isFullscreen && showDetails && selectedData && (
          <div className="absolute left-6 top-24 bottom-6 w-80 bg-[#0b101d]/95 backdrop-blur-xl border border-white/10 rounded-2xl z-[100] shadow-2xl p-6 overflow-y-auto animate-in fade-in slide-in-from-left-6 duration-500">
              <div className="flex justify-between items-start mb-6">
                  <div>
                      <div className="flex items-center gap-2 mb-1">
                          {showFlag && selectedData.id ? (
                              <img
                                  src={`https://flagcdn.com/w80/${selectedData.id.toLowerCase()}.png`}
                                  alt={`Bandera ${selectedData.pais}`}
                                  className="h-8 w-auto rounded border border-white/10 shadow object-cover"
                              />
                          ) : (
                              <span className="text-2xl font-black text-slate-500/50">{selectedData.id}</span>
                          )}
                      </div>
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

                  <div className="space-y-2 bg-[#0e1526] p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-slate-400">Distribución de sentimiento</p>
                    <SentimentDonut
                        size={104}
                        positivo={selectedData.sentimientoPct?.positivo || 0}
                        neutral={selectedData.sentimientoPct?.neutral || 0}
                        negativo={selectedData.sentimientoPct?.negativo || 0}
                        colors={{ positivo: sentimentColors.positivo, neutral: sentimentColors.neutral, negativo: sentimentColors.negativo }}
                    />
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
        onGlobeReady={handleGlobeReady}
        rendererConfig={rendererConfig}
        width={isFullscreen ? undefined : undefined}
        height={isFullscreen ? undefined : undefined}
        globeImageUrl="/earth_day.jpg"
        bumpImageUrl="/earth_normal.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

        showAtmosphere={true}
        atmosphereColor={atmosphereColorDynamic}
        atmosphereAltitude={lowEnd ? 0.22 : 0.28}

        htmlElementsData={htmlElements}
        htmlElement={htmlElement}

        pointsData={columnsData}
        pointLat={"lat"}
        pointLng={"lng"}
        pointAltitude={"altitude"}
        pointRadius={"radius"}
        pointColor={"color"}
        pointResolution={lowEnd ? 6 : 12}
        pointsTransitionDuration={600}

        arcsData={combinedArcs}
        arcColor={"color"}
        arcStroke={"stroke"}
        arcDashLength={0.4}
        arcDashGap={0.18}
        arcDashInitialGap={"dashInitialGap"}
        arcDashAnimateTime={"animTime"}
        arcsTransitionDuration={800}
        arcAltitudeAutoScale={0.45}
        arcCurveResolution={lowEnd ? 32 : 64}

        ringsData={combinedRings}
        ringColor={ringColorInterpolator}
        ringMaxRadius={"maxR"}
        ringPropagationSpeed={"speed"}
        ringRepeatPeriod={"period"}

        polygonsData={features}
        polygonLabel={polygonLabel}
        polygonAltitude={0.005}
        polygonCapColor={polygonCapColor}
        polygonSideColor={polygonSideColorConst}
        polygonStrokeColor={polygonStrokeColorConst}
        // Recolor instantáneo: sin transición, cambiar de país seleccionado (tour
        // o clic) NO dispara una animación de 1s sobre los ~177 polígonos a la vez,
        // que se percibía como un "barrido/reinicio" constante del mapa.
        polygonsTransitionDuration={0}

        onPolygonHover={onPolygonHover}
        onPolygonClick={onPolygonClick}
        onZoom={onZoom}
      />
    </div>
  );
}
