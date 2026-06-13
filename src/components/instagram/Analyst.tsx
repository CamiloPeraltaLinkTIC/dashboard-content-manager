"use client";

import { useRef, useState, useEffect } from "react";
import { Markdown } from "./Markdown";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "¿Qué tipo de contenido funciona mejor y por qué?",
  "¿Qué publicación tuvo mejor engagement y qué tenía?",
  "¿Qué días debería publicar según los datos?",
  "Dame 3 recomendaciones para crecer el alcance",
];

export function Analyst() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setBusy(true);

    try {
      const res = await fetch("/api/analyst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) {
        const e = await res.json().catch(() => ({ error: "Error de red" }));
        throw new Error(e.error ?? "Error");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error";
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: `⚠️ ${msg}` };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full px-5 py-3 font-semibold text-white shadow-lg transition hover:opacity-90 group"
        style={{ background: "linear-gradient(135deg, #E1306C 0%, #833ab4 100%)", boxShadow: "0 8px 32px rgba(131,58,180,0.45)" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <circle cx="12" cy="12" r="3" fill="white" />
          <path d="M12 3C12 3 9 6 9 9M12 3C12 3 15 6 15 9M12 21C12 21 9 18 9 15M12 21C12 21 15 18 15 15M3 12C3 12 6 9 9 9M3 12C3 12 6 15 9 15M21 12C21 12 18 9 15 9M21 12C21 12 18 15 15 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="3" r="1.5" fill="white" opacity="0.7" />
          <circle cx="12" cy="21" r="1.5" fill="white" opacity="0.7" />
          <circle cx="3" cy="12" r="1.5" fill="white" opacity="0.7" />
          <circle cx="21" cy="12" r="1.5" fill="white" opacity="0.7" />
        </svg>
        {open ? "Cerrar" : "NEXUS IA"}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-40 flex h-[70vh] max-h-[640px] w-[min(440px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b101d] shadow-2xl">
          <div
            className="border-b border-white/10 px-4 py-3"
            style={{ background: "linear-gradient(135deg, rgba(225,48,108,0.08) 0%, rgba(131,58,180,0.08) 100%)" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl shrink-0"
                style={{ background: "linear-gradient(135deg, #E1306C 0%, #833ab4 100%)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" fill="white" />
                  <path d="M12 3C12 3 9 6 9 9M12 3C12 3 15 6 15 9M12 21C12 21 9 18 9 15M12 21C12 21 15 18 15 15M3 12C3 12 6 9 9 9M3 12C3 12 6 15 9 15M21 12C21 12 18 9 15 9M21 12C21 12 18 15 15 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="3" r="1.5" fill="white" opacity="0.7" />
                  <circle cx="12" cy="21" r="1.5" fill="white" opacity="0.7" />
                  <circle cx="3" cy="12" r="1.5" fill="white" opacity="0.7" />
                  <circle cx="21" cy="12" r="1.5" fill="white" opacity="0.7" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white tracking-wide">NEXUS</h3>
                  <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full" style={{ background: "rgba(131,58,180,0.2)", color: "#c084fc" }}>IA</span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 ml-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    activo
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">Inteligencia analítica · Instagram</p>
              </div>
              <span className="ml-auto text-[10px] text-slate-600 font-mono">Claude Opus 4.8</span>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-3">Sugerencias</p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="block w-full rounded-xl border border-white/5 bg-white/5 px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-white/10 hover:border-white/10"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "whitespace-pre-wrap text-white"
                      : "bg-white/5 text-slate-100"
                  }`}
                  style={m.role === "user" ? { background: "#E1306C" } : undefined}
                >
                  {m.role === "user" ? (
                    m.content
                  ) : m.content ? (
                    <Markdown>{m.content}</Markdown>
                  ) : busy && i === messages.length - 1 ? (
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="flex gap-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                      Analizando
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-white/10 p-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Escribe tu pregunta…"
                className="max-h-32 flex-1 resize-none rounded-xl border border-white/10 bg-[#05080f] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-pink-500"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #E1306C 0%, #833ab4 100%)" }}
              >
                {busy ? "…" : "Enviar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
