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
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-fuchsia-600 px-5 py-3 font-medium text-white shadow-lg shadow-fuchsia-900/40 transition hover:bg-fuchsia-500"
      >
        {open ? "Cerrar" : "💬 Analista IA"}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-40 flex h-[70vh] max-h-[640px] w-[min(440px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl">
          <div className="border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <h3 className="font-semibold text-white">Analista de Instagram</h3>
              <span className="ml-auto text-xs text-neutral-500">Claude Opus 4.8</span>
            </div>
            <p className="mt-0.5 text-xs text-neutral-500">Pregunta lo que quieras sobre tus publicaciones.</p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-sm text-neutral-400">Ejemplos:</p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="block w-full rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-left text-sm text-neutral-200 transition hover:bg-white/10"
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
                      ? "whitespace-pre-wrap bg-fuchsia-600 text-white"
                      : "bg-white/5 text-neutral-100"
                  }`}
                >
                  {m.role === "user" ? (
                    m.content
                  ) : m.content ? (
                    <Markdown>{m.content}</Markdown>
                  ) : busy && i === messages.length - 1 ? (
                    "Pensando…"
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
                className="max-h-32 flex-1 resize-none rounded-xl border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-fuchsia-500"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-fuchsia-500 disabled:opacity-40"
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
