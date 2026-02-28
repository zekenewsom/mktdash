import { getWithRetry } from '../lib/httpClient';
import { HeadlineItem } from '../contracts/intelligence';

const FEEDS = [
  { name: 'Reuters', url: 'https://feeds.reuters.com/reuters/businessNews' },
  { name: 'BBC', url: 'http://feeds.bbci.co.uk/news/business/rss.xml' },
  { name: 'Guardian', url: 'https://www.theguardian.com/business/rss' },
];

function decodeEntities(text: string) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractItems(xml: string, source: string) {
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
  const linkRegex = /<link>(.*?)<\/link>/;
  const pubRegex = /<pubDate>(.*?)<\/pubDate>/;

  const rows: Array<{ title: string; url: string; as_of: string; source: string }> = [];
  let m;
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];
    const t = block.match(titleRegex);
    const l = block.match(linkRegex);
    const p = block.match(pubRegex);
    const title = decodeEntities((t?.[1] || t?.[2] || '').trim());
    const url = (l?.[1] || '').trim();
    const asOf = p?.[1] ? new Date(p[1]).toISOString() : new Date().toISOString();
    if (title && url) rows.push({ title, url, as_of: asOf, source });
    if (rows.length >= 15) break;
  }
  return rows;
}

function normalizeTitle(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

export async function fetchHeadlineIntelligence() {
  const collected: Array<{ title: string; url: string; as_of: string; source: string }> = [];
  const errors: string[] = [];

  for (const feed of FEEDS) {
    try {
      const resp = await getWithRetry<string>(feed.url, { responseType: 'text' as any });
      const xml = typeof resp.data === 'string' ? resp.data : String(resp.data);
      collected.push(...extractItems(xml, feed.name));
    } catch (err: any) {
      errors.push(`${feed.name}: ${err?.message || 'fetch failed'}`);
    }
  }

  const clusters = new Map<string, HeadlineItem>();
  for (const row of collected) {
    const key = normalizeTitle(row.title);
    if (!clusters.has(key)) {
      clusters.set(key, {
        id: `hl-${Math.random().toString(36).slice(2, 10)}`,
        title: row.title,
        url: row.url,
        source_count: 1,
        sources: [row.source],
        as_of: row.as_of,
        confidence: 'low',
      });
    } else {
      const existing = clusters.get(key)!;
      if (!existing.sources.includes(row.source)) existing.sources.push(row.source);
      existing.source_count = existing.sources.length;
      existing.confidence = existing.source_count >= 3 ? 'high' : existing.source_count === 2 ? 'medium' : 'low';
      if (row.as_of > existing.as_of) existing.as_of = row.as_of;
    }
  }

  const data = Array.from(clusters.values())
    .sort((a, b) => b.as_of.localeCompare(a.as_of))
    .slice(0, 15);

  return {
    data,
    error: errors.length ? errors.join(' | ') : null,
  };
}
