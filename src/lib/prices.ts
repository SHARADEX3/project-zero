/**
 * USD price layer — free public endpoints, no API keys, with graceful
 * degradation per asset. Cached in module memory (HMR-safe via globalThis).
 *
 * Binance: BTC, ETH, SOL, TRX
 * OKX:     RON
 */

export type PriceMap = Record<string, number | null>;

const PRICE_TTL_MS = 120_000;

type PriceCache = { data: PriceMap; at: number };

const g = globalThis as unknown as { __priceCache?: PriceCache };

async function fetchBinance(symbols: string[]): Promise<Record<string, string>> {
  const query = encodeURIComponent(JSON.stringify(symbols));
  const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${query}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`binance ${res.status}`);
  const rows = (await res.json()) as Array<{ symbol: string; price: string }>;
  return Object.fromEntries(rows.map((r) => [r.symbol, r.price]));
}

async function fetchOkx(instId: string): Promise<string> {
  const res = await fetch(`https://www.okx.com/api/v5/market/ticker?instId=${instId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`okx ${res.status}`);
  const json = (await res.json()) as { data?: Array<{ last?: string }> };
  const last = json.data?.[0]?.last;
  if (!last) throw new Error("okx no last");
  return last;
}

async function fetchPricesUncached(): Promise<PriceMap> {
  const [binance, ron] = await Promise.all([
    fetchBinance(["BTCUSDT", "ETHUSDT", "SOLUSDT", "TRXUSDT"]).catch(() => null),
    fetchOkx("RON-USDT").catch(() => null),
  ]);

  return {
    bitcoin: binance ? Number(binance.BTCUSDT) : null,
    ethereum: binance ? Number(binance.ETHUSDT) : null,
    solana: binance ? Number(binance.SOLUSDT) : null,
    tron: binance ? Number(binance.TRXUSDT) : null,
    ronin: ron ? Number(ron) : null,
  };
}

export async function getPrices(): Promise<PriceMap> {
  const cache = g.__priceCache;
  if (cache && Date.now() - cache.at < PRICE_TTL_MS) return cache.data;
  const data = await fetchPricesUncached();
  g.__priceCache = { data, at: Date.now() };
  return data;
}
