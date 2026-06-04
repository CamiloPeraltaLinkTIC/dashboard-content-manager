"use client";

import { useState, useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import * as topojson from "topojson-client";
import { Topology } from "topojson-specification";
import { countriesData } from "@/data/mock";
import { Button } from "@/components/ui/button";

// Importar los iconos de FontAwesome
import { faTwitter, faTiktok, faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons";

// Función para convertir un icono de FA a string SVG
const faToSvg = (faIcon: any, color: string = "white") => {
    const { width, height, svgPathData } = faIcon.icon;
    return `<svg viewBox="0 0 ${width} ${height}" width="14" height="14" fill="${color}"><path d="${svgPathData}"/></svg>`;
};

const platformIcons: Record<string, string> = {
    tiktok: faToSvg(faTiktok),
    x: faToSvg(faTwitter),
    instagram: faToSvg(faInstagram),
    facebook: faToSvg(faFacebook)
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

const getCountryData = (name: string) => {
  const normalizedInput = normalizeName(name);
  const mappedName = normalizeName(nameMapping[name] || name);
  
  return countriesData.find(c => {
    const normalizedMockName = normalizeName(c.pais);
    return normalizedMockName === normalizedInput || normalizedMockName === mappedName;
  });
};

export function GlobeComponent({ className, onSelect, selectedCountryId, selectedPlatform }: { className?: string, onSelect: (id: string) => void, selectedCountryId: string | null, selectedPlatform: string | null }) {
  const globeEl = useRef<any>();
  const [hoveredCountry, setHoveredCountry] = useState<any | null>(null);
  const [features, setFeatures] = useState<any[]>([]);
  const [isTouring, setIsTouring] = useState(false);

  useEffect(() => {
    fetch("/world.topojson")
      .then((res) => res.json())
      .then((topology: Topology) => {
        const geojson = topojson.feature(topology, topology.objects.countries);
        setFeatures((geojson as any).features);
      });
  }, []);

  useEffect(() => {
    if (selectedCountryId && globeEl.current) {
        const countryData = countriesData.find(c => c.id === selectedCountryId);
        if (countryData) {
            globeEl.current.pointOfView({ lat: countryData.lat, lng: countryData.lng, altitude: 2 }, 2000);
        }
    }
  }, [selectedCountryId]);

  useEffect(() => {
    if (!isTouring || !globeEl.current) return;
    let currentIndex = 0;
    const interval = setInterval(() => {
        const countryData = countriesData[currentIndex % countriesData.length];
        globeEl.current.pointOfView({ lat: countryData.lat, lng: countryData.lng, altitude: 2 }, 2000);
        onSelect(countryData.id);
        const feature = features.find(f => getCountryData(f.properties.name)?.id === countryData.id);
        setHoveredCountry(feature || null);
        currentIndex++;
    }, 4000);
    return () => clearInterval(interval);
  }, [isTouring, onSelect, features]);

  return (
    <div className={className} style={{ position: "relative", width: "100%", height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <style>{`
        .pulse-container { position: relative; width: 24px; height: 24px; }
        .dot { position: absolute; top: 8px; left: 8px; width: 8px; height: 8px; background-color: #f3b116; border-radius: 50%; box-shadow: 0 0 5px #f3b116; }
        .ring { position: absolute; top: 0px; left: 0px; width: 24px; height: 24px; border: 2px solid #f3b116; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
      `}</style>
      
      <div className="absolute bottom-6 left-6 z-50 bg-[#0b101d]/90 p-4 rounded-xl border border-white/10 text-white text-xs w-48 shadow-2xl">
        <h4 className="font-bold mb-2">Intensidad de conversación</h4>
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

      <Button 
        variant="outline"
        className="absolute top-4 right-4 z-50 bg-[#0b101d] text-white border-white/20"
        onClick={() => setIsTouring(!isTouring)}
      >
        {isTouring ? "Detener tour" : "Girar automáticamente"}
      </Button>

      <Globe
        ref={globeEl}
        globeImageUrl="/earth_day.jpg"
        bumpImageUrl="/earth_normal.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        htmlElementsData={[{ lat: 4.5, lng: -74.3 }]}
        htmlElement={() => {
            const el = document.createElement('div');
            el.innerHTML = '<div class="pulse-container"><div class="ring"></div><div class="dot"></div></div>';
            return el;
        }}
        
        polygonsData={features}
        polygonLabel={({ properties }: any) => {
            const countryData = getCountryData(properties.name);
            const dominantPlat = countryData ? Object.keys(countryData.plataformas).reduce((a, b) => countryData.plataformas[a] > countryData.plataformas[b] ? a : b) : "";
            const iconSvg = platformIcons[dominantPlat.toLowerCase()] || "";
            return countryData ? `
                <div class="bg-[#0b101d] text-white p-4 rounded-xl border border-white/10 shadow-2xl w-64 text-sm z-50">
                    <p class="font-bold text-lg flex items-center gap-2">${countryData.pais} <span style="display:inline-flex;">${iconSvg}</span></p>
                    <p class="text-xs text-blue-400">${countryData.tema}</p>
                    <p class="font-bold text-yellow-500 mt-2">${countryData.volumen.toLocaleString()} menciones</p>
                </div>
            ` : `<div class="bg-[#0b101d] text-white p-2 rounded-xl border border-white/10 shadow-2xl text-sm">${properties.name}</div>`;
        }}
        polygonAltitude={0.005}
        polygonCapColor={(d: any) => {
            const countryData = getCountryData(d.properties.name);
            if (countryData?.id === selectedCountryId) return "#c77dff";
            if (countryData) {
                const volume = selectedPlatform ? (countryData.plataformas as any)[selectedPlatform] || 0 : countryData.volumen;
                return getVolumeColor(volume);
            }
            return intensityColors.sinDatos;
        }}
        polygonSideColor={() => "rgba(0, 0, 0, 0)"}
        polygonStrokeColor={() => "#444444"}
        polygonStrokeWidth={0.5}
        onPolygonHover={(d: any) => setHoveredCountry(d)}
        onPolygonClick={(d: any) => {
            const countryData = getCountryData(d.properties.name);
            if (countryData) onSelect(countryData.id);
        }}
      />
    </div>
  );
}
