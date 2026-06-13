import type { Post } from "./instagram-types";

export const TYPE_LABELS: Record<string, string> = {
  REELS: "Reel",
  CAROUSEL_ALBUM: "Carrusel",
  IMAGE: "Imagen",
  VIDEO: "Video",
};

export function typeLabel(t: string): string {
  return TYPE_LABELS[t] ?? t;
}

/** Truncate by code points so emojis (surrogate pairs) are never split — avoids
 * lone-surrogate characters that cause React hydration mismatches. */
export function clip(text: string, max: number): string {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  const cps = Array.from(clean);
  return cps.length > max ? cps.slice(0, max).join("") + "…" : clean;
}

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function weekday(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return WEEKDAYS[new Date(y, m - 1, d).getDay()];
}

export function sum(posts: Post[], key: keyof Post): number {
  return posts.reduce((acc, p) => acc + (Number(p[key]) || 0), 0);
}

export interface Totals {
  count: number;
  reach: number;
  likes: number;
  comments: number;
  saved: number;
  shares: number;
  engagement: number;
  avgReach: number;
  avgEngagementRate: number;
}

export function computeTotals(posts: Post[]): Totals {
  const count = posts.length || 1;
  const reach = sum(posts, "reach");
  const engagement = sum(posts, "engagement");
  return {
    count: posts.length,
    reach,
    likes: sum(posts, "likes"),
    comments: sum(posts, "comments"),
    saved: sum(posts, "saved"),
    shares: sum(posts, "shares"),
    engagement,
    avgReach: Math.round(reach / count),
    avgEngagementRate: reach ? Math.round((engagement / reach) * 1000) / 10 : 0,
  };
}

export interface TypeBreakdown {
  type: string;
  count: number;
  reach: number;
  avgReach: number;
  avgLikes: number;
  avgEngagementRate: number;
}

export function breakdownByType(posts: Post[]): TypeBreakdown[] {
  const map = new Map<string, Post[]>();
  for (const p of posts) {
    const arr = map.get(p.type) ?? [];
    arr.push(p);
    map.set(p.type, arr);
  }
  return [...map.entries()]
    .map(([type, arr]) => {
      const t = computeTotals(arr);
      return {
        type,
        count: arr.length,
        reach: t.reach,
        avgReach: t.avgReach,
        avgLikes: Math.round(t.likes / arr.length),
        avgEngagementRate: t.avgEngagementRate,
      };
    })
    .sort((a, b) => b.count - a.count);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("es-CO").format(n);
}

export function formatDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function hashtags(caption: string): string[] {
  return (caption.match(/#[\p{L}\p{N}_]+/gu) ?? []).map((h) => h.toLowerCase());
}

export interface HashtagStat {
  tag: string;
  count: number;
  avgReach: number;
}

export function topHashtags(posts: Post[], limit = 12): HashtagStat[] {
  const map = new Map<string, { count: number; reach: number }>();
  for (const p of posts) {
    for (const tag of new Set(hashtags(p.caption))) {
      const cur = map.get(tag) ?? { count: 0, reach: 0 };
      cur.count += 1;
      cur.reach += p.reach;
      map.set(tag, cur);
    }
  }
  return [...map.entries()]
    .map(([tag, v]) => ({ tag, count: v.count, avgReach: Math.round(v.reach / v.count) }))
    .sort((a, b) => b.count - a.count || b.avgReach - a.avgReach)
    .slice(0, limit);
}
