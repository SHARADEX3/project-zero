import { db } from "@/lib/db";
import { CHAINS, fetchBalance, type ChainConfig } from "@/lib/chains";
import { getPrices } from "@/lib/prices";
import { rawToHuman } from "@/lib/format";
import { OPPORTUNITY_SEED } from "@/lib/content";

export type WalletStatus = "ok" | "error" | "pending";

export interface WalletView {
  chain: string;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  color: string;
  explorer: string;
  explorerName: string;
  balanceRaw: string | null;
  balance: number | null;
  priceUsd: number | null;
  usdValue: number | null;
  status: WalletStatus;
  history: Array<{ t: string; usd: number }>;
  updatedAt: string | null;
}

export interface EventView {
  id: string;
  type: string;
  chain: string | null;
  symbol: string | null;
  amount: number | null;
  usdValue: number | null;
  title: string;
  description: string | null;
  refUrl: string | null;
  createdAt: string;
}

export interface OpportunityView {
  key: string;
  title: string;
  description: string;
  category: string;
  status: string;
  notes: string;
}

export interface MissionSummary {
  startedAt: string | null;
  totalUsd: number | null;
  totalEarnedUsd: number | null;
  fundedChains: number;
  totalChains: number;
  snapshotCount: number;
  eventCount: number;
  depositCount: number;
  lastRefreshedAt: string | null;
}

export interface MissionPayload {
  mission: MissionSummary;
  wallets: WalletView[];
  events: EventView[];
  opportunities: OpportunityView[];
}

const REFRESH_THROTTLE_MS = 20_000;
const HISTORY_POINTS = 40;
const SNAPSHOT_RETENTION_DAYS = 45;

const g = globalThis as unknown as {
  __missionRefresh?: { at: number; inflight: Promise<void> | null };
};

/* ------------------------------------------------------------------ */
/* Seeding                                                             */
/* ------------------------------------------------------------------ */

let seedPromise: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = doSeed().catch((err) => {
      seedPromise = null; // allow retry on next request
      throw err;
    });
  }
  return seedPromise;
}

async function doSeed(): Promise<void> {
  for (const cfg of CHAINS) {
    await db.wallet.upsert({
      where: { chain: cfg.chain },
      update: {
        name: cfg.name,
        symbol: cfg.symbol,
        address: cfg.address,
        decimals: cfg.decimals,
        sortOrder: cfg.sortOrder,
      },
      create: {
        chain: cfg.chain,
        name: cfg.name,
        symbol: cfg.symbol,
        address: cfg.address,
        decimals: cfg.decimals,
        sortOrder: cfg.sortOrder,
      },
    });
  }

  for (const opp of OPPORTUNITY_SEED) {
    await db.opportunity.upsert({
      where: { key: opp.key },
      update: {
        title: opp.title,
        description: opp.description,
        category: opp.category,
        status: opp.status,
        notes: opp.notes,
        sortOrder: opp.sortOrder,
      },
      create: {
        key: opp.key,
        title: opp.title,
        description: opp.description,
        category: opp.category,
        status: opp.status,
        notes: opp.notes,
        sortOrder: opp.sortOrder,
      },
    });
  }

  const eventCount = await db.missionEvent.count();
  if (eventCount === 0) {
    await db.missionEvent.create({
      data: {
        type: "system",
        title: "Mission initialized",
        description:
          "Five wallets registered across Bitcoin, Ethereum, Solana, Ronin and Tron. Confirmed starting balance: zero. Budget: zero. The monitor is live.",
      },
    });
  }
}

/* ------------------------------------------------------------------ */
/* Network refresh + deposit detection                                 */
/* ------------------------------------------------------------------ */

export function refreshBalances(force = false): Promise<void> {
  const state = g.__missionRefresh ?? (g.__missionRefresh = { at: 0, inflight: null });
  const fresh = Date.now() - state.at < REFRESH_THROTTLE_MS;
  if (!force && fresh) return Promise.resolve();
  if (state.inflight) return state.inflight;

  state.inflight = doRefresh()
    .catch(() => {
      /* per-chain errors are handled inside; total failure just skips this cycle */
    })
    .finally(() => {
      state.at = Date.now();
      state.inflight = null;
    });
  return state.inflight;
}

async function doRefresh(): Promise<void> {
  const [prices, balanceResults] = await Promise.all([
    getPrices(),
    Promise.all(
      CHAINS.map((cfg) =>
        fetchBalance(cfg)
          .then((raw) => ({ cfg, raw, ok: true as const }))
          .catch(() => ({ cfg, raw: null, ok: false as const })),
      ),
    ),
  ]);

  for (const result of balanceResults) {
    const { cfg, raw, ok } = result;
    const price = prices[cfg.chain] ?? null;

    let balance: number | null = null;
    let usdValue: number | null = null;
    if (ok && raw !== null) {
      balance = rawToHuman(raw, cfg.decimals);
      usdValue = price !== null ? balance * price : null;
    }

    const previous = await db.snapshot.findFirst({
      where: { wallet: { chain: cfg.chain } },
      orderBy: { createdAt: "desc" },
    });

    await db.snapshot.create({
      data: {
        walletId: (await db.wallet.findUnique({ where: { chain: cfg.chain } }))!.id,
        balance: raw ?? "0",
        usdValue,
        priceUsd: price,
      },
    });

    if (previous && raw !== null) {
      const prevRaw = BigInt(previous.balance);
      const nextRaw = BigInt(raw);
      if (nextRaw > prevRaw) {
        const amount = rawToHuman(raw, cfg.decimals) - rawToHuman(previous.balance, cfg.decimals);
        await db.missionEvent.create({
          data: {
            type: "deposit",
            chain: cfg.chain,
            symbol: cfg.symbol,
            amount,
            usdValue: usdValue !== null ? amount * price : null,
            title: `Deposit detected — ${cfg.name}`,
            description: `Inflow of ${amount} ${cfg.symbol} detected on-chain. Welcome aboard, anonymous supporter.`,
            refUrl: cfg.explorer,
          },
        });
      } else if (nextRaw < prevRaw) {
        const amount = rawToHuman(previous.balance, cfg.decimals) - rawToHuman(raw, cfg.decimals);
        await db.missionEvent.create({
          data: {
            type: "outflow",
            chain: cfg.chain,
            symbol: cfg.symbol,
            amount,
            usdValue: price !== null ? amount * price : null,
            title: `Outflow detected — ${cfg.name}`,
            description: `Balance decreased by ${amount} ${cfg.symbol} on-chain.`,
            refUrl: cfg.explorer,
          },
        });
      }
    }
  }

  // Prune old snapshots to keep the DB lean.
  const cutoff = new Date(Date.now() - SNAPSHOT_RETENTION_DAYS * 24 * 60 * 60 * 1000);
  await db.snapshot.deleteMany({ where: { createdAt: { lt: cutoff } } });
}

/* ------------------------------------------------------------------ */
/* Payload assembly                                                    */
/* ------------------------------------------------------------------ */

async function buildWalletViews(): Promise<WalletView[]> {
  const wallets = await db.wallet.findMany({ orderBy: { sortOrder: "asc" } });
  const views: WalletView[] = [];

  for (const w of wallets) {
    const cfg = CHAINS.find((c) => c.chain === w.chain) as ChainConfig;
    const latest = await db.snapshot.findFirst({
      where: { walletId: w.id },
      orderBy: { createdAt: "desc" },
    });
    const historyRows = await db.snapshot.findMany({
      where: { walletId: w.id },
      orderBy: { createdAt: "desc" },
      take: HISTORY_POINTS,
    });

    const balance = latest ? rawToHuman(latest.balance, w.decimals) : null;
    const priceUsd = latest?.priceUsd ?? null;
    const hasBalance = latest !== null;

    views.push({
      chain: w.chain,
      name: w.name,
      symbol: w.symbol,
      address: w.address,
      decimals: w.decimals,
      color: cfg?.color ?? "#22c55e",
      explorer: cfg?.explorer ?? "#",
      explorerName: cfg?.explorerName ?? "explorer",
      balanceRaw: latest?.balance ?? null,
      balance,
      priceUsd,
      usdValue: latest?.usdValue ?? null,
      status: hasBalance ? "ok" : "pending",
      history: historyRows
        .slice()
        .reverse()
        .map((s) => ({ t: s.createdAt.toISOString(), usd: s.usdValue ?? 0 })),
      updatedAt: latest?.createdAt.toISOString() ?? null,
    });
  }

  return views;
}

function toEventView(e: {
  id: string;
  type: string;
  chain: string | null;
  symbol: string | null;
  amount: number | null;
  usdValue: number | null;
  title: string;
  description: string | null;
  refUrl: string | null;
  createdAt: Date;
}): EventView {
  return { ...e, createdAt: e.createdAt.toISOString() };
}

export async function getMissionData(options?: { skipNetwork?: boolean }): Promise<MissionPayload> {
  await ensureSeeded();
  if (!options?.skipNetwork) {
    await refreshBalances();
  }

  const [wallets, events, opportunities, snapshotCount, eventCount, depositAgg, firstEvent, latestSnapshot] =
    await Promise.all([
      buildWalletViews(),
      db.missionEvent.findMany({ orderBy: { createdAt: "desc" }, take: 40 }),
      db.opportunity.findMany({ orderBy: { sortOrder: "asc" } }),
      db.snapshot.count(),
      db.missionEvent.count(),
      db.missionEvent.aggregate({
        where: { type: "deposit" },
        _sum: { usdValue: true },
        _count: true,
      }),
      db.missionEvent.findFirst({ orderBy: { createdAt: "asc" } }),
      db.snapshot.findFirst({ orderBy: { createdAt: "desc" } }),
    ]);

  const knownUsd = wallets.filter((w) => w.usdValue !== null);
  const totalUsd = knownUsd.length > 0 ? knownUsd.reduce((acc, w) => acc + (w.usdValue ?? 0), 0) : null;
  const fundedChains = wallets.filter((w) => w.balanceRaw !== null && BigInt(w.balanceRaw) > 0n).length;

  return {
    mission: {
      startedAt: firstEvent ? firstEvent.createdAt.toISOString() : null,
      totalUsd,
      totalEarnedUsd: depositAgg._sum.usdValue ?? 0,
      fundedChains,
      totalChains: wallets.length,
      snapshotCount,
      eventCount,
      depositCount: depositAgg._count,
      lastRefreshedAt: latestSnapshot ? latestSnapshot.createdAt.toISOString() : null,
    },
    wallets,
    events: events.map(toEventView),
    opportunities: opportunities.map((o) => ({
      key: o.key,
      title: o.title,
      description: o.description,
      category: o.category,
      status: o.status,
      notes: o.notes,
    })),
  };
}

export async function getRecentEvents(limit = 40): Promise<EventView[]> {
  await ensureSeeded();
  const events = await db.missionEvent.findMany({ orderBy: { createdAt: "desc" }, take: limit });
  return events.map(toEventView);
}
