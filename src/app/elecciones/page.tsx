"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";
import { PageHeader } from "@/components/page-header";
import { TopicTabs } from "@/components/topic-tabs";
import { AdminPopup } from "@/components/admin-popup";
import {
  pageHeaders,
  eleccionesTabs,
  participacionHistorica,
  topicData as mockTopicData,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowTrendUp, 
  faCircleCheck, 
  faClock, 
  faCircle,
  faRotate,
  faSave,
  faPlus,
  faTrash,
  faBrain
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function EleccionesOverview({ 
    kpis, 
    setKpis, 
    calendario, 
    setCalendario,
    participacion,
    setParticipacion,
    isEditing 
}: { 
    kpis: any[], 
    setKpis: (k: any[]) => void, 
    calendario: any[], 
    setCalendario: (c: any[]) => void,
    participacion: any[],
    setParticipacion: (p: any[]) => void,
    isEditing: boolean 
}) {

  return (
    <div className="space-y-5 fade-in">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={kpi.id} className="kpi-card p-4 flex flex-col gap-2 rounded-xl border-white/5 shadow-none">
            <div className="flex items-center justify-between">
              {isEditing ? (
                  <Input value={kpi.label} onChange={e => {
                      const newK = [...kpis];
                      newK[i].label = e.target.value;
                      setKpis(newK);
                  }} className="h-4 bg-transparent border-none p-0 text-[10px] font-bold uppercase tracking-widest text-slate-500" />
              ) : (
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{kpi.label}</span>
              )}
              {isEditing ? (
                  <Input value={kpi.delta || ''} onChange={e => {
                      const newK = [...kpis];
                      newK[i].delta = e.target.value;
                      setKpis(newK);
                  }} className="h-4 w-12 bg-transparent border-none p-0 text-[10px] font-bold text-green-400 text-right" />
              ) : (
                  kpi.delta && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-green-400">
                      <FontAwesomeIcon icon={faArrowTrendUp} className="w-2.5 h-2.5" />
                      {kpi.delta}
                    </span>
                  )
              )}
            </div>
            {isEditing ? (
                <Input value={kpi.value} onChange={e => {
                    const newK = [...kpis];
                    newK[i].value = e.target.value;
                    setKpis(newK);
                }} className="h-8 text-2xl font-bold text-[#1270e2] bg-white/5 border-white/10" />
            ) : (
                <div className="font-bold text-2xl text-[#1270e2]">{kpi.value}</div>
            )}
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-[#1270e2] rounded-full" style={{ width: `${kpi.progress}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Historical Participation Chart */}
        <div className="kpi-card p-4 rounded-xl border-white/5 shadow-none relative">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-semibold">Participación Histórica</h3>
            {isEditing && (
                <Button size="sm" variant="ghost" onClick={() => setParticipacion([...participacion, { anio: '20XX', pct: 50 }])} className="h-6 text-[10px] font-bold text-blue-400">
                    <FontAwesomeIcon icon={faPlus} className="mr-1" /> Año
                </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-4">% del censo electoral — Colombia presidenciales</p>
          
          <div className={`grid ${isEditing ? 'grid-cols-1 xl:grid-cols-3' : 'grid-cols-1'} gap-4`}>
            <div className={`${isEditing ? 'xl:col-span-2' : ''} h-[180px]`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={participacion} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(222 30% 18%)" />
                  <XAxis 
                    dataKey="anio" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888', fontSize: 11 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#888', fontSize: 11 }} 
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0e1320', border: '1px solid #20283c', borderRadius: '6px', fontSize: '12px' }}
                  />
                  <Bar 
                    dataKey="pct" 
                    fill="hsl(213,85%,55%)" 
                    radius={[3, 3, 0, 0]} 
                    barSize={40}
                  >
                      {participacion.map((entry, index) => (
                          <Bar key={`cell-${index}`} fill={index === participacion.length - 1 ? 'hsl(42,90%,52%)' : 'hsl(213,85%,55%)'} />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {isEditing && (
                <div className="bg-black/20 rounded-xl p-3 border border-white/5 overflow-y-auto max-h-[180px] custom-scrollbar">
                    <table className="w-full text-[10px]">
                        <thead>
                            <tr className="text-slate-500 uppercase font-black border-b border-white/10">
                                <th className="pb-1 text-left">Año</th>
                                <th className="pb-1 text-center">% Part.</th>
                                <th className="pb-1 text-right"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {participacion.map((p, i) => (
                                <tr key={i} className="border-b border-white/5 last:border-0 group">
                                    <td className="py-1">
                                        <Input value={p.anio} onChange={e => {
                                            const newP = [...participacion];
                                            newP[i].anio = e.target.value;
                                            setParticipacion(newP);
                                        }} className="h-5 text-[10px] bg-transparent border-none p-0 font-bold w-12" />
                                    </td>
                                    <td className="py-1">
                                        <Input type="number" value={p.pct} onChange={e => {
                                            const newP = [...participacion];
                                            newP[i].pct = parseFloat(e.target.value) || 0;
                                            setParticipacion(newP);
                                        }} className="h-5 w-12 text-[10px] bg-white/5 border-white/10 p-0 text-center mx-auto text-blue-400 font-bold" />
                                    </td>
                                    <td className="py-1 text-right">
                                        <button onClick={() => setParticipacion(participacion.filter((_, idx) => idx !== i))} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FontAwesomeIcon icon={faTrash} className="w-2.5 h-2.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
          </div>
        </div>

        {/* Electoral Calendar Milestones */}
        <div className="kpi-card p-4 rounded-xl border-white/5 shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Hitos del Calendario Electoral</h3>
            {isEditing && (
                <Button size="sm" variant="ghost" onClick={() => setCalendario([...calendario, { fecha: 'Fecha', evento: 'Nuevo Evento', estado: 'pendiente' }])} className="h-6 text-[10px] font-bold text-blue-400">
                    <FontAwesomeIcon icon={faPlus} className="mr-1" /> Agregar
                </Button>
            )}
          </div>
          <div className="space-y-2.5">
            {calendario.map((item, i) => {
              const isCompleted = item.estado === "completado";
              const isInProgress = item.estado === "activo";
              
              return (
                <div key={i} className="flex items-center gap-3 group">
                  {isEditing ? (
                      <Input value={item.fecha} onChange={e => {
                          const newC = [...calendario];
                          newC[i].fecha = e.target.value;
                          setCalendario(newC);
                      }} className="h-6 w-16 text-[10px] font-medium bg-white/5 border-white/10 p-1" />
                  ) : (
                      <div className="shrink-0 w-16 text-xs text-muted-foreground font-medium">{item.fecha}</div>
                  )}
                  <FontAwesomeIcon 
                    icon={isCompleted ? faCircleCheck : (isInProgress ? faClock : faCircle)} 
                    className={`w-3.5 h-3.5 shrink-0 ${isCompleted ? 'text-green-400' : (isInProgress ? 'text-yellow-500' : 'text-slate-600')}`}
                  />
                  {isEditing ? (
                      <Input value={item.evento} onChange={e => {
                          const newC = [...calendario];
                          newC[i].evento = e.target.value;
                          setCalendario(newC);
                      }} className="h-6 text-xs bg-white/5 border-white/10 p-1 flex-1" />
                  ) : (
                      <span className="text-sm flex-1 truncate text-slate-200">{item.evento}</span>
                  )}
                  {isEditing ? (
                      <div className="flex items-center gap-2">
                        <select 
                            value={item.estado} 
                            onChange={e => {
                                const newC = [...calendario];
                                newC[i].estado = e.target.value;
                                setCalendario(newC);
                            }}
                            className="bg-[#0e1320] text-[10px] font-bold rounded p-1 border border-white/10 outline-none"
                        >
                            <option value="completado">Completado</option>
                            <option value="activo">En curso</option>
                            <option value="pendiente">Pendiente</option>
                        </select>
                        <Button variant="ghost" size="sm" onClick={() => setCalendario(calendario.filter((_, idx) => idx !== i))} className="h-6 w-6 p-0 text-red-500 opacity-0 group-hover:opacity-100">
                            <FontAwesomeIcon icon={faTrash} className="w-2.5 h-2.5" />
                        </Button>
                      </div>
                  ) : (
                    <span 
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                            isCompleted ? 'bg-green-400/10 text-green-400' : 
                            (isInProgress ? 'bg-yellow-500/10 text-yellow-500' : 'bg-slate-500/10 text-slate-500')
                        }`}
                    >
                        {isCompleted ? 'Completado' : (isInProgress ? 'En curso' : 'Pendiente')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EleccionesPage() {
  const h = pageHeaders.elecciones;
  const { role } = useAuth();
  const [strategy, setStrategy] = useState<any>(mockTopicData.elecciones);
  const [kpis, setKpis] = useState<any[]>([]);
  const [calendario, setCalendario] = useState<any[]>([]);
  const [participacion, setParticipacion] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEleccionesData = async () => {
    setLoading(true);
    const { data: sData } = await supabase.from('content_manager_elecciones_strategy').select('*').eq('id', 'main').single();
    const { data: kData } = await supabase.from('content_manager_elecciones_kpis').select('*').order('id');
    const { data: cData } = await supabase.from('content_manager_elecciones_calendario').select('*').order('id');
    const { data: pData } = await supabase.from('content_manager_elecciones_participacion').select('*').order('id');

    if (sData) setStrategy(sData);
    if (kData) setKpis(kData);
    if (cData) setCalendario(cData);
    if (pData) setParticipacion(pData);
    setLoading(false);
  };

  useEffect(() => {
    fetchEleccionesData();
  }, []);

  const saveEleccionesData = async () => {
      try {
          await supabase.from('content_manager_elecciones_strategy').upsert({ id: 'main', ...strategy });
          
          for (const k of kpis) {
              await supabase.from('content_manager_elecciones_kpis').upsert(k);
          }

          await supabase.from('content_manager_elecciones_calendario').delete().neq('id', 0);
          if (calendario.length > 0) {
              await supabase.from('content_manager_elecciones_calendario').insert(calendario.map(({ id, ...rest }) => rest));
          }

          await supabase.from('content_manager_elecciones_participacion').delete().neq('id', 0);
          if (participacion.length > 0) {
              await supabase.from('content_manager_elecciones_participacion').insert(participacion.map(({ id, ...rest }) => rest));
          }

          alert("¡Cambios en Elecciones guardados con éxito!");
          setIsEditing(false);
          fetchEleccionesData();
      } catch (err) {
          console.error(err);
          alert("Error al guardar los datos.");
      }
  };

  if (loading) return <div className="h-screen bg-[#03060d] text-white flex justify-center items-center font-mono tracking-widest uppercase animate-pulse">Cargando Elecciones...</div>;

  return (
    <div className="p-6 bg-[#03060d] text-white">
      <div className="flex justify-between items-start">
        <PageHeader badges={h.badges} title={h.title} description={h.description} />
        <div className="flex gap-2">
            {role === "admin" && (
                !isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="bg-blue-600/10 text-blue-400 border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all">
                        <FontAwesomeIcon icon={faRotate} className="mr-2" /> Modo Edición
                    </Button>
                ) : (
                    <div className="flex gap-2 animate-in fade-in zoom-in duration-300">
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">
                            Cancelar
                        </Button>
                        <Button variant="default" size="sm" onClick={saveEleccionesData} className="bg-green-600 hover:bg-green-700 text-white font-bold px-4">
                            <FontAwesomeIcon icon={faSave} className="mr-2" /> Guardar Todo
                        </Button>
                    </div>
                )
            )}
            <Button variant="outline" size="sm" onClick={fetchEleccionesData} className="bg-[#0b101d] border-white/10 text-white">
                <FontAwesomeIcon icon={faRotate} className={`mr-2 ${loading ? 'animate-spin' : ''}`}/>
            </Button>
        </div>
      </div>

      <div className="mt-6">
        <TopicTabs
            tabs={eleccionesTabs}
            overviewContent={
                <EleccionesOverview 
                    kpis={kpis} 
                    setKpis={setKpis} 
                    calendario={calendario} 
                    setCalendario={setCalendario}
                    participacion={participacion}
                    setParticipacion={setParticipacion}
                    isEditing={isEditing} 
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

      <AdminPopup title="Estratega: Elecciones Presidenciales" hideTrigger={true}>
          <div className="space-y-6">
              <div className="flex justify-between items-center bg-[#161d2b] p-4 rounded-xl border border-white/5">
                <div>
                    <h3 className="font-bold text-blue-400">Panel de Control</h3>
                    <p className="text-xs text-slate-400">Gestiona los hitos del calendario y métricas clave.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 font-bold" onClick={saveEleccionesData}>
                    <FontAwesomeIcon icon={faSave} className="mr-2" /> Guardar Todo
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Métricas de Elecciones</h4>
                      <div className="space-y-4">
                          {kpis.map((k, i) => (
                              <div key={k.id}>
                                  <label className="text-[10px] text-slate-400 uppercase font-bold">{k.label}</label>
                                  <div className="flex gap-2">
                                      <Input value={k.value} onChange={e => {
                                          const newK = [...kpis];
                                          newK[i].value = e.target.value;
                                          setKpis(newK);
                                      }} className="bg-[#05080f] border-white/5 h-10 flex-1" />
                                      <Input value={k.delta || ''} placeholder="Delta" onChange={e => {
                                          const newK = [...kpis];
                                          newK[i].delta = e.target.value;
                                          setKpis(newK);
                                      }} className="bg-[#05080f] border-white/5 h-10 w-24" />
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Calendario Electoral</h4>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                          {calendario.map((c, i) => (
                              <div key={i} className="bg-black/20 p-3 rounded-lg space-y-2">
                                  <div className="flex gap-2">
                                      <Input value={c.fecha} onChange={e => {
                                          const newC = [...calendario];
                                          newC[i].fecha = e.target.value;
                                          setCalendario(newC);
                                      }} className="h-7 text-[10px] bg-transparent border-white/10 w-20" />
                                      <select 
                                        value={c.estado} 
                                        onChange={e => {
                                            const newC = [...calendario];
                                            newC[i].estado = e.target.value;
                                            setCalendario(newC);
                                        }}
                                        className="h-7 bg-[#0e1320] text-[10px] font-bold rounded px-2 border border-white/10 outline-none flex-1"
                                      >
                                          <option value="completado">Completado</option>
                                          <option value="activo">En curso</option>
                                          <option value="pendiente">Pendiente</option>
                                      </select>
                                  </div>
                                  <Input value={c.evento} onChange={e => {
                                      const newC = [...calendario];
                                      newC[i].evento = e.target.value;
                                      setCalendario(newC);
                                  }} className="h-7 text-[11px] bg-transparent border-white/10 w-full" />
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Participación Histórica</h4>
                    <Button size="sm" variant="ghost" onClick={() => setParticipacion([...participacion, { anio: '20XX', pct: 50 }])} className="h-6 text-[10px] font-bold text-blue-400">
                        <FontAwesomeIcon icon={faPlus} className="mr-1" /> Agregar Año
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                      {participacion.map((p, i) => (
                          <div key={i} className="bg-black/20 p-2 rounded-lg space-y-1 relative group">
                              <Input value={p.anio} onChange={e => {
                                  const newP = [...participacion];
                                  newP[i].anio = e.target.value;
                                  setParticipacion(newP);
                              }} className="h-6 text-[10px] bg-transparent border-white/10 font-bold" />
                              <Input type="number" value={p.pct} onChange={e => {
                                  const newP = [...participacion];
                                  newP[i].pct = parseFloat(e.target.value) || 0;
                                  setParticipacion(newP);
                              }} className="h-6 text-[10px] bg-white/5 border-white/10 text-blue-400" />
                              <button onClick={() => setParticipacion(participacion.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
                                  <FontAwesomeIcon icon={faTrash} />
                              </button>
                          </div>
                      ))}
                  </div>
              </div>

              <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">IA — Recomendaciones</h4>
                    <span className="text-[10px] text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full"><FontAwesomeIcon icon={faBrain} className="mr-1" /> IA Insights</span>
                  </div>
                  <div className="bg-blue-600/5 border border-blue-500/20 p-4 rounded-2xl">
                      <p className="text-xs text-blue-300 leading-relaxed">
                          Faltan 247 días para la elección. Se recomienda iniciar la campaña de pedagogía sobre el marcado del tarjetón en redes sociales para reducir el número de votos nulos.
                      </p>
                  </div>
              </div>
          </div>
      </AdminPopup>
    </div>
  );
}
