/**
 * Chain registry for the mission's watched wallets.
 * Addresses are public identifiers — safe to embed in code and QR codes.
 */

export interface ChainConfig {
  chain: string;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  color: string;
  explorer: string;
  explorerName: string;
  sortOrder: number;
}

export const CHAINS: ChainConfig[] = [
  {
    chain: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    address: "bc1qh3areygq598ntxht0yp5yv87ej7g6aqvw8fl4z",
    decimals: 8,
    color: "#f7931a",
    explorer: "https://mempool.space/address/bc1qh3areygq598ntxht0yp5yv87ej7g6aqvw8fl4z",
    explorerName: "mempool.space",
    sortOrder: 1,
  },
  {
    chain: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    address: "0xd6DFE6b54bF3dBC919Fde57009452fe6bbb0D997",
    decimals: 18,
    color: "#8a92b2",
    explorer: "https://etherscan.io/address/0xd6DFE6b54bF3dBC919Fde57009452fe6bbb0D997",
    explorerName: "Etherscan",
    sortOrder: 2,
  },
  {
    chain: "solana",
    name: "Solana",
    symbol: "SOL",
    address: "2emXSLoziaB5wdC8y48ovbu41agh9PzR5ro8o7kRDUvM",
    decimals: 9,
    color: "#14f195",
    explorer: "https://solscan.io/account/2emXSLoziaB5wdC8y48ovbu41agh9PzR5ro8o7kRDUvM",
    explorerName: "Solscan",
    sortOrder: 3,
  },
  {
    chain: "ronin",
    name: "Ronin",
    symbol: "RON",
    address: "0xAa4E76e5Be5334c0f2Fe0716C42B2FC61D4c150B",
    decimals: 18,
    color: "#e1b073",
    explorer:
      "https://app.roninexplorer.com/address/ronin:0xAa4E76e5Be5334c0f2Fe0716C42B2FC61D4c150B",
    explorerName: "Ronin Explorer",
    sortOrder: 4,
  },
  {
    chain: "tron",
    name: "Tron",
    symbol: "TRX",
    address: "TJxkyJW57Tb8qmvvv5rCh3L2FYssRvWFEv",
    decimals: 6,
    color: "#ef4444",
    explorer: "https://tronscan.org/#/address/TJxkyJW57Tb8qmvvv5rCh3L2FYssRvWFEv",
    explorerName: "Tronscan",
    sortOrder: 5,
  },
];

export function chainBySymbol(symbol: string): ChainConfig | undefined {
  return CHAINS.find((c) => c.symbol === symbol);
}

/* ------------------------------------------------------------------ */
/* Balance fetchers — all free public endpoints, no API keys required. */
/* Each returns the raw integer balance as a string.                   */
/* ------------------------------------------------------------------ */

async function fetchWithTimeout(url: string, init?: RequestInit, ms = 8000): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchEvmBalance(rpcUrl: string, address: string): Promise<string> {
  const res = await fetchWithTimeout(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBalance",
      params: [address, "latest"],
    }),
  });
  if (!res.ok) throw new Error(`RPC ${res.status}`);
  const json = (await res.json()) as { result?: string };
  if (!json.result || typeof json.result !== "string") throw new Error("RPC no result");
  return BigInt(json.result).toString();
}

async function fetchBitcoinBalance(address: string): Promise<string> {
  const res = await fetchWithTimeout(`https://mempool.space/api/address/${address}`);
  if (!res.ok) throw new Error(`mempool ${res.status}`);
  const json = (await res.json()) as {
    chain_stats: { funded_txo_sum: number; spent_txo_sum: number };
  };
  return BigInt(json.chain_stats.funded_txo_sum - json.chain_stats.spent_txo_sum).toString();
}

async function fetchSolanaBalance(address: string): Promise<string> {
  const res = await fetchWithTimeout("https://api.mainnet-beta.solana.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getBalance",
      params: [address],
    }),
  });
  if (!res.ok) throw new Error(`solana ${res.status}`);
  const json = (await res.json()) as { result?: { value?: number } };
  const value = json.result?.value ?? 0;
  return BigInt(value).toString();
}

async function fetchTronBalance(address: string): Promise<string> {
  const res = await fetchWithTimeout(`https://api.trongrid.io/v1/accounts/${address}`);
  if (!res.ok) throw new Error(`trongrid ${res.status}`);
  const json = (await res.json()) as { data?: Array<{ balance?: number }> };
  const value = json.data?.[0]?.balance ?? 0;
  return BigInt(value).toString();
}

export async function fetchBalance(cfg: ChainConfig): Promise<string> {
  switch (cfg.chain) {
    case "ethereum":
      return fetchEvmBalance("https://ethereum-rpc.publicnode.com", cfg.address);
    case "ronin":
      return fetchEvmBalance("https://api.roninchain.com/rpc", cfg.address);
    case "bitcoin":
      return fetchBitcoinBalance(cfg.address);
    case "solana":
      return fetchSolanaBalance(cfg.address);
    case "tron":
      return fetchTronBalance(cfg.address);
    default:
      throw new Error(`no fetcher for ${cfg.chain}`);
  }
}
