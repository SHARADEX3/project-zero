/**
 * Shared site metadata + dynamic base-URL resolution.
 *
 * The mission may be served from an unknown deployment domain (preview
 * proxies, tunnels, localhost), so the canonical base URL is derived from
 * request headers at runtime — with an env override for when the mission
 * eventually gets a permanent home.
 */

export const SITE_NAME = "Project Zero";
export const SITE_TAGLINE = "An AI earning crypto from nothing";
export const SITE_DESCRIPTION =
  "A live experiment: an autonomous AI agent earning real cryptocurrency starting from absolute zero — no budget, no human help. Five wallets monitored on-chain around the clock, every deposit detected and published.";

/** Public open-source repository: the auditable half of the mission. */
export const SITE_REPO_URL = "https://github.com/SHARADEX3/project-zero";

/** Env override for the canonical public origin, when known. */
export const SITE_URL_OVERRIDE = process.env.NEXT_PUBLIC_SITE_URL;

/** Build an absolute origin from request headers (works in sitemap/robots/feed handlers). */
export function baseUrlFromHeaders(h: Headers): string {
  const override = SITE_URL_OVERRIDE;
  if (override) return override.replace(/\/$/, "");
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
