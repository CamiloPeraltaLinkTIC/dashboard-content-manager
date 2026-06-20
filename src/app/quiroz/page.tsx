"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-provider";
import { canEdit } from "@/lib/auth/rbac";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { TopicTabs } from "@/components/topic-tabs";
import {
  pageHeaders,
  quirozTabs,
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
  faUser, 
  faMicrophone, 
  faTv, 
  faRadio, 
  faNewspaper, 
  faGlobe, 
  faArrowTrendUp,
  faRotate,
  faSave,
  faPlus,
  faTrash,
  faUpload,
  faBrain,
  faNewspaper as faNews,
  faBullseye
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { AdminPopup } from "@/components/admin-popup";
import { Input } from "@/components/ui/input";
import * as XLSX from 'xlsx';

function QuirozOverview({ 
    data, 
    apariciones, 
    isEditing, 
    setProfile, 
    setApariciones 
}: { 
    data: any, 
    apariciones: any[], 
    isEditing: boolean, 
    setProfile: (p: any) => void, 
    setApariciones: (a: any[]) => void 
}) {
  const q = data || {
      nombre: "Cargando...", cargo: "", desde: "", partido: "", declaraciones: 0, apariciones: 0, cuentas_verificadas: 0, entrevistas_tv: 0, menciones_totales: 0, sentimiento_positivo: 0, sentimiento_neutral: 0, sentimiento_negativo: 0, semanal_menciones: []
  };

  const getMediaIcon = (medio: string) => {
    const name = medio.toLowerCase();
    if (name.includes("tiempo") || name.includes("semana")) return faNewspaper;
    if (name.includes("radio") || name.includes("la fm") || name.includes("blu") || name.includes("caracol")) return faRadio;
    if (name.includes("noticias") || name.includes("tv") || name.includes("rcn")) return faTv;
    return faGlobe;
  };

  return (
    <div className="space-y-5 fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="kpi-card p-5 flex flex-col items-center gap-3 text-center rounded-2xl">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500" 
            style={{ 
              background: isEditing ? "linear-gradient(135deg, #1270e2, #2eb88a)" : "linear-gradient(135deg, rgb(11, 65, 132), rgb(155, 111, 8))", 
              border: `3px solid ${isEditing ? "#2eb88a" : "rgb(243, 177, 22)"}`,
              transform: isEditing ? "scale(1.05)" : "scale(1)"
            }}
          >
            <FontAwesomeIcon icon={faUser} className="text-2xl" style={{ color: isEditing ? "white" : "rgb(243, 177, 22)" }} />
          </div>
          <div className="w-full space-y-1">
            {isEditing ? (
                <div className="space-y-2 mb-2">
                    <Input value={q.nombre} onChange={e => setProfile({...q, nombre: e.target.value})} className="h-8 text-center font-bold bg-white/5 border-blue-500/30" />
                    <Input value={q.cargo} onChange={e => setProfile({...q, cargo: e.target.value})} className="h-6 text-center text-xs bg-white/5 border-white/10" />
                    <div className="flex gap-2">
                        <Input value={q.desde} onChange={e => setProfile({...q, desde: e.target.value})} className="h-6 text-center text-[10px] bg-white/5 border-white/10" />
                        <Input value={q.partido} onChange={e => setProfile({...q, partido: e.target.value})} className="h-6 text-center text-[10px] bg-white/5 border-white/10" />
                    </div>
                </div>
            ) : (
                <>
                    <div className="font-bold text-lg">{q.nombre}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{q.cargo}</div>
                    <div className="text-xs text-muted-foreground mt-1">Desde {q.desde} · {q.partido}</div>
                </>
            )}
          </div>
          <div className="w-full h-px bg-white/5 my-2"></div>
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="text-center group">
              {isEditing ? (
                  <Input type="number" value={q.declaraciones} onChange={e => setProfile({...q, declaraciones: parseInt(e.target.value)})} className="h-8 text-center font-bold bg-white/5 border-blue-500/20" />
              ) : (
                  <div className="text-xl font-bold transition-all group-hover:scale-110" style={{ color: "rgb(43, 130, 238)" }}>{q.declaraciones}</div>
              )}
              <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">Declaraciones</div>
            </div>
            <div className="text-center group">
              {isEditing ? (
                  <Input type="number" value={q.apariciones} onChange={e => setProfile({...q, apariciones: parseInt(e.target.value)})} className="h-8 text-center font-bold bg-white/5 border-orange-500/20" />
              ) : (
                  <div className="text-xl font-bold transition-all group-hover:scale-110" style={{ color: "rgb(243, 177, 22)" }}>{q.apariciones}</div>
              )}
              <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">Medios</div>
            </div>
            <div className="text-center group">
              {isEditing ? (
                  <Input type="number" value={q.cuentas_verificadas} onChange={e => setProfile({...q, cuentas_verificadas: parseInt(e.target.value)})} className="h-8 text-center font-bold bg-white/5 border-blue-500/20" />
              ) : (
                  <div className="text-xl font-bold transition-all group-hover:scale-110" style={{ color: "rgb(43, 130, 238)" }}>{q.cuentas_verificadas}</div>
              )}
              <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">Verificadas</div>
            </div>
            <div className="text-center group">
              {isEditing ? (
                  <Input type="number" value={q.entrevistas_tv} onChange={e => setProfile({...q, entrevistas_tv: parseInt(e.target.value)})} className="h-8 text-center font-bold bg-white/5 border-orange-500/20" />
              ) : (
                  <div className="text-xl font-bold transition-all group-hover:scale-110" style={{ color: "rgb(243, 177, 22)" }}>{q.entrevistas_tv}</div>
              )}
              <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-semibold">TV</div>
            </div>
          </div>
        </div>

        {/* Sentiment Card */}
        <div className="kpi-card p-4 flex flex-col rounded-2xl">
          <h3 className="text-sm font-semibold mb-1">Sentimiento de Menciones</h3>
          <div className="flex-1 flex flex-col justify-center space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground text-xs">Positivo</span>
                {isEditing ? (
                    <Input type="number" value={q.sentimiento_positivo} onChange={e => setProfile({...q, sentimiento_positivo: parseInt(e.target.value)})} className="h-6 w-16 text-right text-xs bg-white/5 border-green-500/30" />
                ) : (
                    <span className="font-bold" style={{ color: "rgb(46, 184, 138)" }}>{q.sentimiento_positivo}%</span>
                )}
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#2eb88a]" style={{ width: `${q.sentimiento_positivo}%` }}></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground text-xs">Neutral</span>
                {isEditing ? (
                    <Input type="number" value={q.sentimiento_neutral} onChange={e => setProfile({...q, sentimiento_neutral: parseInt(e.target.value)})} className="h-6 w-16 text-right text-xs bg-white/5 border-yellow-500/30" />
                ) : (
                    <span className="font-bold" style={{ color: "rgb(243, 177, 22)" }}>{q.sentimiento_neutral}%</span>
                )}
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#f3b116]" style={{ width: `${q.sentimiento_neutral}%` }}></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground text-xs">Negativo</span>
                {isEditing ? (
                    <Input type="number" value={q.sentimiento_negativo} onChange={e => setProfile({...q, sentimiento_negativo: parseInt(e.target.value)})} className="h-6 w-16 text-right text-xs bg-white/5 border-red-500/30" />
                ) : (
                    <span className="font-bold" style={{ color: "rgb(223, 58, 58)" }}>{q.sentimiento_negativo}%</span>
                )}
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#df3a3a]" style={{ width: `${q.sentimiento_negativo}%` }}></div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg text-center" style={{ background: "rgb(25, 31, 46)" }}>
            {isEditing ? (
                <Input type="number" value={q.menciones_totales} onChange={e => setProfile({...q, menciones_totales: parseInt(e.target.value)})} className="h-8 text-center text-xl font-bold bg-white/5 border-blue-500/30" />
            ) : (
                <div className="text-2xl font-bold" style={{ color: "rgb(43, 130, 238)" }}>{q.menciones_totales?.toLocaleString()}</div>
            )}
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">menciones totales 2026</div>
          </div>
        </div>

        {/* Mentions by Day Chart */}
        <div className="kpi-card p-4 rounded-2xl">
          <h3 className="text-sm font-semibold mb-1">Menciones por Día</h3>
          <p className="text-xs text-muted-foreground mb-4">Última semana</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={q.semanal_menciones || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="dia" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 11 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 11 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0e1320', border: '1px solid #20283c', borderRadius: '6px' }}
                />
                <Bar dataKey="n" fill="hsl(213,85%,55%)" radius={[3, 3, 0, 0]} barSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Media Appearances Card */}
      <div className="kpi-card p-4 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMicrophone} className="text-blue-500" />
                <h3 className="text-sm font-semibold">Apariciones Recientes en Medios</h3>
              </div>
              {isEditing && (
                  <Button size="sm" variant="ghost" onClick={() => setApariciones([{ medio: 'Nuevo Medio', tema: '', fecha: 'Hoy', sentimiento: 'neutral' }, ...apariciones])} className="text-[10px] font-black uppercase text-blue-400">
                    <FontAwesomeIcon icon={faPlus} className="mr-1" /> Añadir Fila
                  </Button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs text-muted-foreground font-medium py-2 pr-4">Medio</th>
                    <th className="text-left text-xs text-muted-foreground font-medium py-2 pr-4">Fecha</th>
                    <th className="text-left text-xs text-muted-foreground font-medium py-2 pr-4">Tema</th>
                    <th className="text-left text-xs text-muted-foreground font-medium py-2 pr-4 text-right">Sentimiento</th>
                    {isEditing && <th className="w-10"></th>}
                  </tr>
                </thead>
                <tbody>
                  {apariciones.map((a, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-2.5 pr-4">
                        {isEditing ? (
                            <Input value={a.medio} onChange={e => {
                                const up = [...apariciones];
                                up[i].medio = e.target.value;
                                setApariciones(up);
                            }} className="h-7 text-xs bg-white/5 border-white/10" />
                        ) : (
                            <div className="flex items-center gap-1.5">
                              <span style={{ color: "rgb(43, 130, 238)" }}>
                                <FontAwesomeIcon icon={getMediaIcon(a.medio)} className="w-3 h-3" />
                              </span>
                              <span className="font-medium">{a.medio}</span>
                            </div>
                        )}
                      </td>
                      <td className="py-2.5 pr-4 text-muted-foreground text-xs">
                        {isEditing ? (
                            <Input value={a.fecha} onChange={e => {
                                const up = [...apariciones];
                                up[i].fecha = e.target.value;
                                setApariciones(up);
                            }} className="h-7 text-xs bg-white/5 border-white/10" />
                        ) : a.fecha}
                      </td>
                      <td className="py-2.5 pr-4 text-slate-300">
                        {isEditing ? (
                            <Input value={a.tema} onChange={e => {
                                const up = [...apariciones];
                                up[i].tema = e.target.value;
                                setApariciones(up);
                            }} className="h-7 text-xs bg-white/5 border-white/10" />
                        ) : a.tema}
                      </td>
                      <td className="py-2.5 text-right">
                        {isEditing ? (
                            <select 
                                value={a.sentimiento} 
                                onChange={e => {
                                    const up = [...apariciones];
                                    up[i].sentimiento = e.target.value;
                                    setApariciones(up);
                                }}
                                className="bg-[#0b101d] text-xs border border-white/10 rounded px-1 h-7 outline-none"
                            >
                                <option value="positivo">Positivo</option>
                                <option value="neutral">Neutral</option>
                                <option value="negativo">Negativo</option>
                            </select>
                        ) : (
                            <span 
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold" 
                                style={{ 
                                    color: a.sentimiento === "positivo" ? "rgb(46, 184, 138)" : a.sentimiento === "negativo" ? "rgb(223, 58, 58)" : "rgb(243, 177, 22)",
                                    background: "rgba(255,255,255,0.03)"
                                }}
                            >
                                {a.sentimiento?.charAt(0).toUpperCase() + a.sentimiento?.slice(1)}
                            </span>
                        )}
                      </td>
                      {isEditing && (
                          <td className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => setApariciones(apariciones.filter((_, idx) => idx !== i))} className="h-7 w-7 p-0 text-red-500">
                                  <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                              </Button>
                          </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      </div>
    </div>
  );
}

export default function QuirozPage() {
  const h = pageHeaders.quiroz;
  const { role } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [apariciones, setApariciones] = useState<any[]>([]);
  const [strategy, setStrategy] = useState<any>(mockTopicData.quiroz);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchQuirozData = async () => {
    setLoading(true);
    const { data: pData } = await supabase.from('content_manager_quiroz_profile').select('*').single();
    const { data: aData } = await supabase.from('content_manager_quiroz_apariciones').select('*').order('id', { ascending: false });
    const { data: sData } = await supabase.from('content_manager_quiroz_strategy').select('*').single();
    
    if (pData) setProfile(pData);
    if (aData) setApariciones(aData);
    if (sData) setStrategy(sData);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuirozData();
  }, []);

  const saveQuirozData = async () => {
    try {
        await supabase.from('content_manager_quiroz_profile').upsert(profile);
        for (const a of apariciones) {
            await supabase.from('content_manager_quiroz_apariciones').upsert(a);
        }
        await supabase.from('content_manager_quiroz_strategy').upsert(strategy);
        alert("¡Estrategia de Cristian Quiroz guardada!");
        setIsEditing(false);
        fetchQuirozData();
    } catch (err) {
        console.error(err);
        alert("Error al guardar");
    }
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
        try {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            
            let updatedProfile = { ...profile };
            let updatedApariciones = [...apariciones];

            wb.SheetNames.forEach((wsname) => {
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                if (data.length === 0) return;

                const firstRow = data[0] as any;

                // APARICIONES detection
                if (firstRow['Medio'] || firstRow['Tema'] || firstRow['Fecha']) {
                    updatedApariciones = data.map((row: any) => ({
                        medio: row['Medio'] || 'Medio',
                        fecha: row['Fecha'] || 'Hoy',
                        tema: row['Tema'] || '',
                        sentimiento: (row['Sentimiento'] || 'neutral').toLowerCase()
                    }));
                } 
                // PROFILE detection
                else if (firstRow['Nombre'] || firstRow['Cargo'] || firstRow['Declaraciones']) {
                    const row = firstRow;
                    updatedProfile = {
                        ...updatedProfile,
                        nombre: row['Nombre'] || updatedProfile.nombre,
                        cargo: row['Cargo'] || updatedProfile.cargo,
                        desde: row['Desde'] || updatedProfile.desde,
                        partido: row['Partido'] || updatedProfile.partido,
                        declaraciones: parseInt(row['Declaraciones']) || 0,
                        apariciones: parseInt(row['Apariciones']) || 0,
                        cuentas_verificadas: parseInt(row['CuentasVerificadas']) || 0,
                        entrevistas_tv: parseInt(row['EntrevistasTV']) || 0,
                        menciones_totales: parseInt(row['MencionesTotales']) || 0,
                        sentimiento_positivo: parseInt(row['Positivo']) || 0,
                        sentimiento_neutral: parseInt(row['Neutral']) || 0,
                        sentimiento_negativo: parseInt(row['Negativo']) || 0,
                        semanal_menciones: row['Semanal'] ? JSON.parse(row['Semanal']) : updatedProfile.semanal_menciones
                    };
                }
            });

            setProfile(updatedProfile);
            setApariciones(updatedApariciones);
            alert("Excel procesado. Revisa y pulsa Guardar.");
        } catch(err) {
            console.error(err);
            alert("Error procesando Excel.");
        }
    };
    reader.readAsBinaryString(file);
  };

  if (loading) return <div className="h-screen page-bg text-white flex justify-center items-center font-mono animate-pulse uppercase tracking-widest">Cargando Estrategia Quiroz...</div>;

  return (
    <div className="p-6 page-bg text-white relative">
      <div className="flex justify-between items-start mb-2">
        <PageHeader badges={h.badges} title={h.title} description={h.description} />
        <div className="flex gap-2">
            {canEdit(role) && (
                !isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="bg-blue-600/10 text-blue-400 border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all">
                        <FontAwesomeIcon icon={faRotate} className="mr-2" /> Modo Edición
                    </Button>
                ) : (
                    <div className="flex gap-2 animate-in fade-in zoom-in duration-300">
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">
                            Cancelar
                        </Button>
                        <Button variant="default" size="sm" onClick={saveQuirozData} className="bg-green-600 hover:bg-green-700 text-white font-bold px-4">
                            <FontAwesomeIcon icon={faSave} className="mr-2" /> Guardar Todo
                        </Button>
                    </div>
                )
            )}
            <Button variant="ghost" size="sm" onClick={fetchQuirozData} className="text-slate-500 hover:text-white">
                <FontAwesomeIcon icon={faRotate} className="mr-2" /> 
            </Button>
        </div>
      </div>

      <div className="mt-6">
        <TopicTabs
            tabs={quirozTabs}
            overviewContent={<QuirozOverview data={profile} apariciones={apariciones} isEditing={isEditing} setProfile={setProfile} setApariciones={setApariciones} />}
            narrativa={strategy.narrativa}
            pilares={strategy.pilares}
            noticias={strategy.noticias}
            contenido={strategy.contenido}
            conversacion={strategy.conversacion}
            pauta={strategy.pauta}
            isEditing={isEditing}
            setStrategy={setStrategy}
            strategy={strategy}
        />
      </div>

      <AdminPopup title="Estratega: Cristian Quiroz" hideTrigger={true}>
          <div className="space-y-6">
              <div className="flex justify-between items-center bg-[#161d2b] p-4 rounded-xl border border-white/5">
                <div>
                    <h3 className="font-bold text-orange-400">Panel Estratégico</h3>
                    <p className="text-xs text-slate-400">Gestión de narrativa, pilares y pauta pagada.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="relative cursor-pointer bg-green-600/20 text-green-400 border-green-500/20">
                        <FontAwesomeIcon icon={faUpload} className="mr-2" /> Excel
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleExcelUpload} accept=".xlsx,.xls" />
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 font-bold" onClick={saveQuirozData}>
                        <FontAwesomeIcon icon={faSave} className="mr-2" /> Guardar Todo
                    </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                  {/* Overview Stats Editor (Previous section) */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-4">
                      <h4 className="text-xs font-black uppercase text-blue-400 flex items-center gap-2"><FontAwesomeIcon icon={faUser} /> Perfil y Métricas Overview</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <Input value={profile?.nombre} onChange={e => setProfile({...profile, nombre: e.target.value})} placeholder="Nombre" className="bg-black/40 border-white/5 h-8 text-xs" />
                          <Input value={profile?.cargo} onChange={e => setProfile({...profile, cargo: e.target.value})} placeholder="Cargo" className="bg-black/40 border-white/5 h-8 text-xs" />
                          <Input value={profile?.declaraciones} type="number" onChange={e => setProfile({...profile, declaraciones: parseInt(e.target.value)})} placeholder="Dec" className="bg-black/40 border-white/5 h-8 text-xs" />
                          <Input value={profile?.entrevistas_tv} type="number" onChange={e => setProfile({...profile, entrevistas_tv: parseInt(e.target.value)})} placeholder="TV" className="bg-black/40 border-white/5 h-8 text-xs" />
                      </div>
                  </div>

                  {/* Narrative Editor */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-4">
                      <h4 className="text-xs font-black uppercase text-purple-400 flex items-center gap-2"><FontAwesomeIcon icon={faBrain} /> Estrategia Narrativa</h4>
                      <div className="space-y-3">
                          <div className="space-y-1">
                              <label className="text-[10px] text-slate-500 font-bold">GANCHO NARRATIVO</label>
                              <textarea value={strategy.narrativa.gancho} onChange={e => setStrategy({...strategy, narrativa: {...strategy.narrativa, gancho: e.target.value}})} className="w-full bg-black/40 border border-white/5 rounded-lg p-3 text-xs text-slate-300 min-h-[60px]" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-500 font-bold">TIPO CONVERSACIÓN</label>
                                <Input value={strategy.narrativa.tipoConversacion} onChange={e => setStrategy({...strategy, narrativa: {...strategy.narrativa, tipoConversacion: e.target.value}})} className="bg-black/40 border-white/5 h-8 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-500 font-bold">MENSAJE CLAVE</label>
                                <Input value={strategy.narrativa.mensajeClave} onChange={e => setStrategy({...strategy, narrativa: {...strategy.narrativa, mensajeClave: e.target.value}})} className="bg-black/40 border-white/5 h-8 text-xs" />
                            </div>
                          </div>
                      </div>
                  </div>

                  {/* News Section */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black uppercase text-yellow-500 flex items-center gap-2"><FontAwesomeIcon icon={faNews} /> Noticias de Interés</h4>
                        <Button size="sm" variant="ghost" onClick={() => setStrategy({...strategy, noticias: [{ medio: 'Medio', titulo: '', fecha: 'Ahora', categoria: 'Electoral', url: '#' }, ...strategy.noticias]})} className="text-[10px] font-black uppercase"><FontAwesomeIcon icon={faPlus} className="mr-1" /> Añadir</Button>
                      </div>
                      <div className="space-y-2">
                          {strategy.noticias.map((n: any, i: number) => (
                              <div key={i} className="flex gap-2 items-center bg-black/20 p-2 rounded-lg border border-white/5">
                                  <Input value={n.medio} onChange={e => {
                                      const news = [...strategy.noticias];
                                      news[i].medio = e.target.value;
                                      setStrategy({...strategy, noticias: news});
                                  }} className="h-7 text-[10px] w-1/4" />
                                  <Input value={n.titulo} placeholder="Titular" onChange={e => {
                                      const news = [...strategy.noticias];
                                      news[i].titulo = e.target.value;
                                      setStrategy({...strategy, noticias: news});
                                  }} className="h-7 text-[10px] flex-1" />
                                  <Button variant="ghost" size="sm" onClick={() => setStrategy({...strategy, noticias: strategy.noticias.filter((_: any, idx: number) => idx !== i)})} className="text-red-500 h-6 w-6 p-0"><FontAwesomeIcon icon={faTrash} className="w-2.5 h-2.5" /></Button>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Paid Ads Editor */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black uppercase text-green-400 flex items-center gap-2"><FontAwesomeIcon icon={faBullseye} /> Estrategia de Pauta</h4>
                        <Button size="sm" variant="ghost" onClick={() => setStrategy({...strategy, pauta: [{ formato: 'NUEVO', objetivo: '', presupuesto: 'Bajo', cta: 'Ver más', segmento: 'Todos', plataforma: ['X'] }, ...strategy.pauta]})} className="text-[10px] font-black uppercase"><FontAwesomeIcon icon={faPlus} className="mr-1" /> Añadir Pieza</Button>
                      </div>
                      <div className="space-y-3">
                          {strategy.pauta.map((p: any, i: number) => (
                              <div key={i} className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-2">
                                  <div className="flex gap-2">
                                    <Input value={p.formato} onChange={e => {
                                        const news = [...strategy.pauta];
                                        news[i].formato = e.target.value;
                                        setStrategy({...strategy, pauta: news});
                                    }} className="h-7 text-[10px] font-bold w-1/3 text-orange-400" />
                                    <Input value={p.presupuesto} onChange={e => {
                                        const news = [...strategy.pauta];
                                        news[i].presupuesto = e.target.value;
                                        setStrategy({...strategy, pauta: news});
                                    }} className="h-7 text-[10px] w-1/3" />
                                    <Button variant="ghost" size="sm" onClick={() => setStrategy({...strategy, pauta: strategy.pauta.filter((_: any, idx: number) => idx !== i)})} className="text-red-500 h-6 w-6 ml-auto p-0"><FontAwesomeIcon icon={faTrash} className="w-2.5 h-2.5" /></Button>
                                  </div>
                                  <Input value={p.objetivo} placeholder="Objetivo de campaña" onChange={e => {
                                      const news = [...strategy.pauta];
                                      news[i].objetivo = e.target.value;
                                      setStrategy({...strategy, pauta: news});
                                  }} className="h-7 text-[10px] w-full" />
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </AdminPopup>
    </div>
  );
}

