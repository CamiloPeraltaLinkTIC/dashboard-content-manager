"use client";

import { useEffect } from "react";
import type { Post } from "@/lib/instagram-types";
import { formatDate, formatNumber, typeLabel, weekday, hashtags } from "@/lib/instagram-analytics";
import { PostImage } from "./PostImage";

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-3">
      <div className="text-xs text-neutral-400">{label}</div>
      <div className={`mt-0.5 text-xl font-semibold ${accent ? "text-fuchsia-400" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

export function PostDetail({ post, onClose }: { post: Post | null; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!post) return null;
  const tags = hashtags(post.caption);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-white/10 bg-neutral-900 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <span className="inline-block rounded-full bg-fuchsia-500/15 px-2.5 py-0.5 text-xs font-medium text-fuchsia-300">
              {typeLabel(post.type)}
            </span>
            <h3 className="mt-2 text-lg font-semibold text-white">
              {formatDate(post.date)} · {weekday(post.date)}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-neutral-400 hover:bg-white/10 hover:text-white"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="px-5 pt-4">
          <PostImage post={post} className="aspect-square w-full" rounded="rounded-xl" />
        </div>

        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
          <Stat label="Alcance" value={formatNumber(post.reach)} accent />
          <Stat label="Engagement" value={formatNumber(post.engagement)} />
          <Stat label="ER" value={`${post.engagementRate}%`} />
          <Stat label="Likes" value={formatNumber(post.likes)} />
          <Stat label="Comentarios" value={formatNumber(post.comments)} />
          <Stat label="Guardados" value={formatNumber(post.saved)} />
          <Stat label="Compartidos" value={formatNumber(post.shares)} />
          {post.type === "REELS" && <Stat label="Reproducciones" value={formatNumber(post.plays || post.videoViews)} />}
        </div>

        <div className="px-5 pb-5">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
            Texto de la publicación
          </div>
          <p className="whitespace-pre-wrap rounded-xl border border-white/5 bg-white/5 p-4 text-sm leading-relaxed text-neutral-200">
            {post.caption || "(sin texto)"}
          </p>

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span key={t} className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs text-sky-300">
                  {t}
                </span>
              ))}
            </div>
          )}

          {post.permalink && (
            <a
              href={post.permalink}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-500"
            >
              Ver en Instagram ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
