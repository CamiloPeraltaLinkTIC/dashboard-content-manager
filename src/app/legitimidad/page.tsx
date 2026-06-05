"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/page-header";
import { TopicTabs } from "@/components/topic-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPopup } from "@/components/admin-popup";
import {
  pageHeaders,
  legitimidadTabs,
  topicData as mockTopicData,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faAward, 
  faCircleCheck, 
  faShieldHalved, 
  faClock,
  faRotate,
  faSave,
  faPlus,
  faTrash,
  faBrain,
  faArrowTrendUp
} from "@fortawesome/free-solid-svg-icons";

const GaugeCircle = ({ value, color, label }: { value: number, color: string, label: string }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(222 30% 18%)" strokeWidth="8"></circle>
        <circle 
          cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="8" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round" 
          transform="rotate(-90 50 50)" 
          style={{ transition: 'stroke-dashoffset 1s' }}
        ></circle>
        <text x="50" y="46" textAnchor="middle" style={{ fontSize: '20px', fontWeight: 700, fill: color, fontVariantNumeric: 'tabular-nums' }}>{value}</text>
        <text x="50" y="60" textAnchor="middle" style={{ fontSize: '9px', fill: 'rgb(136, 136, 136)' }}>/ 100</text>
      </svg>
      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground text-center max-w-[80px]">{label}</span>
    </div>
  );
};

function LegitimidadOverview({ 
    indices, 
    certificaciones, 
    acciones, 
    isEditing, 
    setIndices, 
    setCertificaciones, 
    setAcciones 
}: { 
    indices: any, 
    certificaciones: any[], 
    acciones: any[], 
    isEditing: boolean, 
    setIndices: (i: any) => void, 
    setCertificaciones: (c: any[]) => void, 
    setAcciones: (a: any[]) => void 
}) {
  const d = indices || { indice_confianza: 0, indice_transparencia: 0, indice_eficiencia: 0, encuestas: [] };
  
  return (
    <div className="space-y-5 fade-in">
      {/* Institutional Indices */}
      <div className="kpi-card p-6 rounded-2xl border-white/5 shadow-none">
        <h3 className="text-sm font-semibold mb-6">Índices Institucionales CNE — Junio 2026</h3>
        <div className="flex flex-wrap justify-around gap-6">
          <div className="flex flex-col items-center gap-2">
              {isEditing ? (
                  <Input type="number" value={d.indice_confianza} onChange={e => setIndices({...d, indice_confianza: parseInt(e.target.value)})} className="w-16 h-8 text-center bg-white/5 border-white/10" />
              ) : (
                  <GaugeCircle value={d.indice_confianza} color="rgb(43, 130, 238)" label="Confianza Ciudadana" />
              )}
              {isEditing && <span className="text-[10px] uppercase font-bold text-muted-foreground">Confianza</span>}
          </div>
          <div className="flex flex-col items-center gap-2">
              {isEditing ? (
                  <Input type="number" value={d.indice_transparencia} onChange={e => setIndices({...d, indice_transparencia: parseInt(e.target.value)})} className="w-16 h-8 text-center bg-white/5 border-white/10" />
              ) : (
                  <GaugeCircle value={d.indice_transparencia} color="rgb(243, 177, 22)" label="Transparencia Institucional" />
              )}
              {isEditing && <span className="text-[10px] uppercase font-bold text-muted-foreground">Transparencia</span>}
          </div>
          <div className="flex flex-col items-center gap-2">
              {isEditing ? (
                  <Input type="number" value={d.indice_eficiencia} onChange={e => setIndices({...d, indice_eficiencia: parseInt(e.target.value)})} className="w-16 h-8 text-center bg-white/5 border-white/10" />
              ) : (
                  <GaugeCircle value={d.indice_eficiencia} color="rgb(46, 184, 138)" label="Eficiencia de Procesos" />
              )}
              {isEditing && <span className="text-[10px] uppercase font-bold text-muted-foreground">Eficiencia</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Evolution Chart */}
        <div className="kpi-card p-4 rounded-2xl border-white/5 shadow-none">
          <h3 className="text-sm font-semibold mb-1">Evolución de Índices</h3>
          <p className="text-xs text-muted-foreground mb-4">Agosto 2025 – Enero 2026</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={d.encuestas} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(222 30% 18%)" />
                <XAxis 
                  dataKey="mes" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 11 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 11 }} 
                  domain={[55, 90]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0e1320', border: '1px solid #20283c', borderRadius: '6px', fontSize: '12px' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center" 
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="confianza" 
                  name="Confianza" 
                  stroke="rgb(43, 130, 238)" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: '#fff', stroke: 'rgb(43, 130, 238)', strokeWidth: 2 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="transparencia" 
                  name="Transparencia" 
                  stroke="rgb(243, 177, 22)" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: '#fff', stroke: 'rgb(243, 177, 22)', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Certifications Card */}
        <div className="kpi-card p-4 rounded-2xl border-white/5 shadow-none">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faAward} className="text-[#f3b116]" />
                <h3 className="text-sm font-semibold">Certificaciones Vigentes</h3>
            </div>
            {isEditing && (
                <Button size="sm" variant="ghost" onClick={() => setCertificaciones([...certificaciones, { nombre: 'Nueva Certificación', exp: '2026' }])} className="h-6 text-[10px] font-bold text-blue-400">
                    <FontAwesomeIcon icon={faPlus} className="mr-1" /> Agregar
                </Button>
            )}
          </div>
          <div className="space-y-2.5">
            {certificaciones.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[rgb(25,31,46)] group">
                <div className="flex items-center gap-2 flex-1">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-[#2eb88a] text-sm" />
                  {isEditing ? (
                      <Input value={c.nombre} onChange={e => {
                          const newC = [...certificaciones];
                          newC[i].nombre = e.target.value;
                          setCertificaciones(newC);
                      }} className="h-7 text-xs bg-white/5 border-white/10 flex-1" />
                  ) : (
                      <span className="text-sm text-slate-200">{c.nombre}</span>
                  )}
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <div className="text-[10px] font-bold text-[#2eb88a] uppercase tracking-wider">VIGENTE</div>
                    {isEditing ? (
                        <Input value={c.exp} onChange={e => {
                            const newC = [...certificaciones];
                            newC[i].exp = e.target.value;
                            setCertificaciones(newC);
                        }} className="h-5 w-20 text-[10px] bg-white/5 border-white/10 p-1 mt-0.5" />
                    ) : (
                        <div className="text-[10px] text-muted-foreground">Exp. {c.exp}</div>
                    )}
                  </div>
                  {isEditing && (
                      <Button variant="ghost" size="sm" onClick={() => setCertificaciones(certificaciones.filter((_, idx) => idx !== i))} className="h-8 w-8 p-0 text-red-500 opacity-0 group-hover:opacity-100">
                          <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                      </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions Card */}
      <div className="kpi-card p-4 rounded-2xl border-white/5 shadow-none">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldHalved} className="text-blue-500" />
            <h3 className="text-sm font-semibold">Acciones de Transparencia</h3>
          </div>
          {isEditing && (
              <Button size="sm" variant="ghost" onClick={() => setAcciones([...acciones, { accion: 'Nueva Acción', avance: 0 }])} className="h-6 text-[10px] font-bold text-blue-400">
                  <FontAwesomeIcon icon={faPlus} className="mr-1" /> Agregar
              </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {acciones.map((a, i) => (
            <div key={i} className="space-y-1.5 group">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 flex-1">
                  <FontAwesomeIcon 
                    icon={a.avance === 100 ? faCircleCheck : faClock} 
                    className={a.avance === 100 ? "text-[#2eb88a] text-xs" : "text-[#f3b116] text-xs"} 
                  />
                  {isEditing ? (
                      <Input value={a.accion} onChange={e => {
                          const newA = [...acciones];
                          newA[i].accion = e.target.value;
                          setAcciones(newA);
                      }} className="h-6 text-[11px] bg-white/5 border-white/10 flex-1 p-1" />
                  ) : (
                      <span className="text-xs font-medium text-slate-300">{a.accion}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <Input type="number" value={a.avance} onChange={e => {
                            const newA = [...acciones];
                            newA[i].avance = parseInt(e.target.value);
                            setAcciones(newA);
                        }} className="h-6 w-12 text-[11px] text-right bg-white/5 border-white/10 p-1" />
                    ) : (
                        <span className="font-bold text-xs" style={{ color: a.avance === 100 ? "rgb(46, 184, 138)" : "rgb(243, 177, 22)" }}>{a.avance}%</span>
                    )}
                    {isEditing && (
                        <Button variant="ghost" size="sm" onClick={() => setAcciones(acciones.filter((_, idx) => idx !== i))} className="h-6 w-6 p-0 text-red-500 opacity-0 group-hover:opacity-100">
                            <FontAwesomeIcon icon={faTrash} className="w-2.5 h-2.5" />
                        </Button>
                    )}
                </div>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000" 
                  style={{ 
                    width: `${a.avance}%`,
                    background: a.avance === 100 ? 'rgb(46, 184, 138)' : 'linear-gradient(90deg, rgb(43, 130, 238), rgb(243, 177, 22))'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LegitimidadPage() {
  const h = pageHeaders.legitimidad;
  const [strategy, setStrategy] = useState<any>(mockTopicData.legitimidad);
  const [indices, setIndices] = useState<any>(null);
  const [certificaciones, setCertificaciones] = useState<any[]>([]);
  const [acciones, setAcciones] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLegitimidadData = async () => {
    setLoading(true);
    const { data: sData } = await supabase.from('content_manager_legitimidad_strategy').select('*').eq('id', 'main').single();
    const { data: iData } = await supabase.from('content_manager_legitimidad_indices').select('*').eq('id', 'main').single();
    const { data: cData } = await supabase.from('content_manager_legitimidad_certificaciones').select('*');
    const { data: aData } = await supabase.from('content_manager_legitimidad_acciones').select('*');

    if (sData) setStrategy(sData);
    if (iData) setIndices(iData);
    if (cData) setCertificaciones(cData);
    if (aData) setAcciones(aData);
    setLoading(false);
  };

  useEffect(() => {
    fetchLegitimidadData();
  }, []);

  const saveLegitimidadData = async () => {
      try {
          await supabase.from('content_manager_legitimidad_strategy').upsert({ id: 'main', ...strategy });
          await supabase.from('content_manager_legitimidad_indices').upsert({ id: 'main', ...indices });
          
          // Simplified Certs/Actions update (delete and re-insert for clean state)
          await supabase.from('content_manager_legitimidad_certificaciones').delete().neq('id', 0);
          if (certificaciones.length > 0) {
              await supabase.from('content_manager_legitimidad_certificaciones').insert(certificaciones.map(({ id, ...rest }) => rest));
          }

          await supabase.from('content_manager_legitimidad_acciones').delete().neq('id', 0);
          if (acciones.length > 0) {
              await supabase.from('content_manager_legitimidad_acciones').insert(acciones.map(({ id, ...rest }) => rest));
          }

          alert("¡Cambios en Legitimidad guardados con éxito!");
          setIsEditing(false);
          fetchLegitimidadData();
      } catch (err) {
          console.error(err);
          alert("Error al guardar los datos.");
      }
  };

  if (loading) return <div className="h-screen bg-[#03060d] text-white flex justify-center items-center font-mono tracking-widest uppercase animate-pulse">Cargando Legitimidad...</div>;

  return (
    <div className="p-6 h-screen overflow-y-auto bg-[#03060d] text-white">
      <div className="flex justify-between items-start">
        <PageHeader badges={h.badges} title={h.title} description={h.description} />
        <div className="flex gap-2">
            {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="bg-blue-600/10 text-blue-400 border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all">
                    <FontAwesomeIcon icon={faRotate} className="mr-2" /> Modo Edición
                </Button>
            ) : (
                <div className="flex gap-2 animate-in fade-in zoom-in duration-300">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">
                        Cancelar
                    </Button>
                    <Button variant="default" size="sm" onClick={saveLegitimidadData} className="bg-green-600 hover:bg-green-700 text-white font-bold px-4">
                        <FontAwesomeIcon icon={faSave} className="mr-2" /> Guardar Todo
                    </Button>
                </div>
            )}
            <Button variant="outline" size="sm" onClick={fetchLegitimidadData} className="bg-[#0b101d] border-white/10 text-white">
                <FontAwesomeIcon icon={faRotate} className={`mr-2 ${loading ? 'animate-spin' : ''}`}/>
            </Button>
        </div>
      </div>
      <div className="mt-6">
        <TopicTabs
          tabs={legitimidadTabs}
          overviewContent={
            <LegitimidadOverview 
                indices={indices} 
                certificaciones={certificaciones} 
                acciones={acciones} 
                isEditing={isEditing} 
                setIndices={setIndices}
                setCertificaciones={setCertificaciones}
                setAcciones={setAcciones}
            />
          }
          narrativa={strategy.narrativa}
          pilares={strategy.pilares}
          noticias={strategy.noticias}
          contenido={strategy.contenido}
          conversacion={strategy.conversacion}
          pauta={strategy.pauta}
          isEditing={isEditing}
          strategy={strategy}
          setStrategy={setStrategy}
        />
      </div>

      <AdminPopup title="Estratega: Legitimidad y Transparencia">
          <div className="space-y-6">
              <div className="flex justify-between items-center bg-[#161d2b] p-4 rounded-xl border border-white/5">
                <div>
                    <h3 className="font-bold text-blue-400">Panel de Control</h3>
                    <p className="text-xs text-slate-400">Gestiona los índices de confianza y certificaciones.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 font-bold" onClick={saveLegitimidadData}>
                    <FontAwesomeIcon icon={faSave} className="mr-2" /> Guardar Todo
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Índices Principales</h4>
                      <div className="space-y-4">
                          <div>
                              <label className="text-[10px] text-slate-400 uppercase font-bold">Confianza Ciudadana</label>
                              <Input type="number" value={indices.indice_confianza} onChange={e => setIndices({...indices, indice_confianza: parseInt(e.target.value)})} className="bg-[#05080f] border-white/5 h-10" />
                          </div>
                          <div>
                              <label className="text-[10px] text-slate-400 uppercase font-bold">Transparencia</label>
                              <Input type="number" value={indices.indice_transparencia} onChange={e => setIndices({...indices, indice_transparencia: parseInt(e.target.value)})} className="bg-[#05080f] border-white/5 h-10" />
                          </div>
                          <div>
                              <label className="text-[10px] text-slate-400 uppercase font-bold">Eficiencia</label>
                              <Input type="number" value={indices.indice_eficiencia} onChange={e => setIndices({...indices, indice_eficiencia: parseInt(e.target.value)})} className="bg-[#05080f] border-white/5 h-10" />
                          </div>
                      </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Gráfico Histórico</h4>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                          {indices.encuestas.map((en: any, i: number) => (
                              <div key={i} className="flex gap-2 items-center bg-black/20 p-2 rounded-lg">
                                  <Input value={en.mes} onChange={e => {
                                      const newE = [...indices.encuestas];
                                      newE[i].mes = e.target.value;
                                      setIndices({...indices, encuestas: newE});
                                  }} className="h-7 text-[10px] bg-transparent border-white/10 w-12" />
                                  <Input type="number" value={en.confianza} onChange={e => {
                                      const newE = [...indices.encuestas];
                                      newE[i].confianza = parseInt(e.target.value);
                                      setIndices({...indices, encuestas: newE});
                                  }} className="h-7 text-[10px] bg-transparent border-white/10" />
                                  <Input type="number" value={en.transparencia} onChange={e => {
                                      const newE = [...indices.encuestas];
                                      newE[i].transparencia = parseInt(e.target.value);
                                      setIndices({...indices, encuestas: newE});
                                  }} className="h-7 text-[10px] bg-transparent border-white/10" />
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">IA — Recomendaciones</h4>
                    <span className="text-[10px] text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full"><FontAwesomeIcon icon={faBrain} className="mr-1" /> Inteligencia Artificial</span>
                  </div>
                  <div className="bg-blue-600/5 border border-blue-500/20 p-4 rounded-2xl">
                      <p className="text-xs text-blue-300 leading-relaxed">
                          La confianza ciudadana ha subido un 2% este mes. Se recomienda potenciar la comunicación sobre las auditorías internacionales para mantener la tendencia positiva antes del simulacro nacional.
                      </p>
                  </div>
              </div>
          </div>
      </AdminPopup>
    </div>
  );
}
