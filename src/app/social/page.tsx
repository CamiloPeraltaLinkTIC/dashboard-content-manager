"use client";

import { useState, useMemo } from "react";
import { liveFeed, socialProfiles } from "@/data/mock";
import { faRotate, faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook, faTwitter, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

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
  
  if (!p || !p.icon) return null;
  
  return <FontAwesomeIcon icon={p.icon} className={className} />;
};

const getPlatformConfig = (name: string) => {
  const key = Object.keys(platformConfig).find(k => k.toLowerCase() === name.toLowerCase());
  return key ? platformConfig[key] : null;
};

export default function SocialPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const filteredFeed = useMemo(() => {
    return selectedPlatform 
        ? liveFeed.filter(post => post.red.toLowerCase() === selectedPlatform.toLowerCase())
        : liveFeed;
  }, [selectedPlatform]);

  return (
    <div className="min-h-screen bg-[#03060d] text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Conversación en Redes Sociales</h1>
        <p className="text-slate-400 text-sm">Monitoreo en tiempo real de Instagram, Facebook, X y TikTok.</p>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(platformConfig).map(([key, p]) => {
              const stats = (socialProfiles as any)[key.toLowerCase()];
              return (
                <Card key={key} className="bg-[#0b101d] border border-white/5 p-4 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-white/5" style={{ color: p.color }}>
                                <BrandIcon name={key} className="w-5 h-5"/>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">{p.name}</h3>
                                <p className="text-[10px] text-slate-400">{stats.seguidores} seguidores</p>
                            </div>
                        </div>
                        <span className="text-green-500 text-xs">● {stats.sentimiento}% pos</span>
                    </div>
                    <div className="flex justify-between text-center mb-4">
                        <div><p className="text-lg font-bold">{stats.interacciones.toLocaleString()}</p><p className="text-[10px] text-slate-400">Interacciones</p></div>
                        <div><p className="text-lg font-bold">{stats.alcance}</p><p className="text-[10px] text-slate-400">Alcance</p></div>
                        <div><p className="text-lg font-bold">{stats.posts}</p><p className="text-[10px] text-slate-400">Posts</p></div>
                    </div>
                    <div className="h-16 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.tendencia}>
                                <Area type="monotone" dataKey="mentions" stroke={p.color} fill={p.color} fillOpacity={0.1} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-xs">
                        <p className="text-slate-400 mb-1">Top post</p>
                        <p className="font-semibold mb-2 line-clamp-2">{stats.topPosts[0]?.texto}</p>
                        <div className="flex gap-3 text-slate-500 text-[10px]">
                            <span className="flex items-center gap-1"><FontAwesomeIcon icon={faHeart} className="w-3 h-3"/>{stats.topPosts[0]?.likes}</span>
                            <span className="flex items-center gap-1"><FontAwesomeIcon icon={faComment} className="w-3 h-3"/>{stats.topPosts[0]?.comments}</span>
                        </div>
                    </div>
                </Card>
              )
          })}
      </div>

      {/* Feed */}
      <div className="bg-[#0b101d] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <span className="text-yellow-500 font-bold text-xl">⚡</span>
                <h1 className="text-xl font-bold">Feed en Vivo</h1>
                <span className="bg-[#0f291e] text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-500/20">● EN TIEMPO REAL</span>
            </div>
            <Button variant="outline" size="sm" className="bg-[#0b101d] border-white/10 text-white"><FontAwesomeIcon icon={faRotate} className="mr-2"/> Actualizar</Button>
        </div>

        <div className="flex gap-2 mb-6">
            {["Todas", "Instagram", "Facebook", "X", "TikTok"].map((p) => (
                <Button 
                    key={p}
                    variant="ghost"
                    className={`rounded-full px-4 py-1.5 h-auto text-xs ${selectedPlatform === (p === "Todas" ? null : p) ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}
                    onClick={() => setSelectedPlatform(p === "Todas" ? null : p)}
                >
                    {p === "Todas" ? p : <span className="flex items-center gap-2"><BrandIcon name={p} className="w-3 h-3"/> {p}</span>}
                </Button>
            ))}
        </div>

        <div className="space-y-2">
            {filteredFeed.map((post) => {
                const p = getPlatformConfig(post.red);
                return (
                    <div key={post.id} className="bg-[#05080f] border border-white/5 rounded-xl p-4 flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-white/5" style={{ color: p?.color || 'white' }}>
                            <BrandIcon name={post.red} className="w-5 h-5"/>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm">@{post.usuario}</span>
                                <span className="text-xs text-slate-500">{post.tiempo}</span>
                                <span className={`text-[10px] font-bold ${post.tipo === 'positivo' ? 'text-green-500' : post.tipo === 'negativo' ? 'text-red-500' : 'text-yellow-500'}`}>
                                    {post.tipo.charAt(0).toUpperCase() + post.tipo.slice(1)}
                                </span>
                            </div>
                            <p className="text-sm text-slate-300">{post.texto}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${post.tipo === 'positivo' ? 'bg-green-500' : post.tipo === 'negativo' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
}
