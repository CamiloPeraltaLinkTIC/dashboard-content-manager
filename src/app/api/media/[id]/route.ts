export const runtime = "nodejs";

interface MediaRow {
  media_id: string;
  media_type?: string;
  media_url?: string | null;
  media_thumbnail_url?: string | null;
}

let cache: { at: number; byId: Map<string, string> } | null = null;
const TTL_MS = 15 * 60 * 1000;

async function getFreshUrls(): Promise<Map<string, string>> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.byId;
  const key = process.env.WINDSOR_API_KEY;
  if (!key) throw new Error("Falta WINDSOR_API_KEY");
  const url = `https://connectors.windsor.ai/instagram?api_key=${key}&date_preset=last_90d&fields=media_id,media_type,media_url,media_thumbnail_url`;
  const res = await fetch(url, { cache: "no-store" });
  const json = (await res.json()) as { data?: MediaRow[] };
  const byId = new Map<string, string>();
  for (const r of json.data ?? []) {
    const best = r.media_thumbnail_url || r.media_url;
    if (r.media_id && best) byId.set(String(r.media_id), best);
  }
  cache = { at: Date.now(), byId };
  return byId;
}

function weservUrl(instagramUrl: string): string {
  const src = encodeURIComponent(instagramUrl.replace(/^https:\/\//, "ssl:"));
  return `https://images.weserv.nl/?url=${src}&w=800&output=jpg`;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let urls: Map<string, string>;
  try {
    urls = await getFreshUrls();
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
  const target = urls.get(id);
  if (!target) return Response.json({ error: "media no encontrado" }, { status: 404 });

  return Response.redirect(weservUrl(target), 302);
}
