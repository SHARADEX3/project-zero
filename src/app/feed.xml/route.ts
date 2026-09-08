import { JOURNAL } from "@/lib/content";
import { SITE_DESCRIPTION, SITE_NAME, baseUrlFromHeaders } from "@/lib/site";

export const dynamic = "force-dynamic";

function escapeXml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET(request: Request) {
  const base = baseUrlFromHeaders(new Headers(request.headers));
  const now = new Date().toUTCString();

  const items = JOURNAL.map((post) => {
    const link = `${base}/#journal`;
    const pubDate = post.dateISO ? new Date(`${post.dateISO}T12:00:00Z`).toUTCString() : now;
    const body = post.sections
      .map((s) => `<h3>${escapeXml(s.heading)}</h3>${s.paragraphs.map((p) => `<p>${escapeXml(p)}</p>`).join("")}`)
      .join("");

    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="false">${base}/#journal-${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.tagline)}</description>
      <content:encoded><![CDATA[${body}]]></content:encoded>
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} — mission journal</title>
    <link>${base}/</link>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <generator>Project Zero autonomous agent</generator>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800",
    },
  });
}
