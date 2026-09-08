"use client";

import * as React from "react";
import { ArrowDown, HandCoins, Heart, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RelativeTime } from "@/components/mission/relative-time";
import { formatAmount, formatUsd } from "@/lib/format";
import type { EventView, WalletView } from "@/lib/mission";

/**
 * Supporters Wall — the social-proof surface of the mission.
 *
 * Every deposit event becomes a permanent brick on the wall: chain, amount,
 * USD value at detection time, and an explorer link for independent
 * verification. The empty state is honest by design: the mission does not
 * manufacture social proof, it waits for the real thing.
 */
export function SupportersWall({
  events,
  wallets,
  totalEarnedUsd,
}: {
  events: EventView[];
  wallets: WalletView[];
  totalEarnedUsd: number;
}) {
  const deposits = React.useMemo(
    () => events.filter((e) => e.type === "deposit"),
    [events],
  );

  return (
    <section id="supporters" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl">
            <Heart className="h-5 w-5 text-rose-500" aria-hidden />
            Supporters wall
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Every human who ever sent value to this mission, exactly as the chains
            recorded it. No counter is faked here — the wall starts empty and grows
            only with real, verifiable deposits.
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-rose-500/40 bg-rose-500/10 font-mono text-[10px] uppercase tracking-wider text-rose-600 dark:text-rose-400"
        >
          {deposits.length} {deposits.length === 1 ? "supporter" : "supporters"} ·{" "}
          {formatUsd(totalEarnedUsd)} earned
        </Badge>
      </div>

      {deposits.length === 0 ? (
        <EmptyWall />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {deposits.map((d) => (
            <SupporterCard key={d.id} deposit={d} wallets={wallets} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */

function EmptyWall() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-dashed border-border/70 bg-card/40 px-6 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] [background-size:22px_22px]"
      />
      <div className="relative flex flex-col items-center gap-3 text-center">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 ring-1 ring-inset ring-rose-500/30"
          aria-hidden
        >
          <HandCoins className="h-6 w-6" />
        </span>
        <p className="font-mono text-sm text-muted-foreground">
          The wall is empty — it is waiting for its first brick.
        </p>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground/80">
          Five wallets sit one section above, each with a QR code and a live balance
          of zero. Any amount on any chain — even one satoshi — becomes the first
          name on this wall, detected on-chain within about a minute and remembered
          here forever.
        </p>
        <a
          href="#wallets"
          className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400"
        >
          <ArrowDown className="h-3.5 w-3.5" aria-hidden />
          pick a wallet above and make history
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function SupporterCard({
  deposit,
  wallets,
}: {
  deposit: EventView;
  wallets: WalletView[];
}) {
  const w = wallets.find((x) => x.chain === deposit.chain);
  const meta = {
    name: w?.name ?? deposit.chain ?? "unknown",
    color: w?.color ?? "#22c55e",
    explorer: w?.explorer ?? null,
    explorerName: w?.explorerName ?? "explorer",
  };

  return (
    <article
      className="group relative flex flex-col gap-2 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm transition-colors hover:bg-accent/40"
      aria-label={`Supporter deposit: ${formatAmount(deposit.amount ?? 0, deposit.symbol ?? "")}`}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl"
        style={{ backgroundColor: meta.color }}
      />
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Landmark className="h-3.5 w-3.5" aria-hidden style={{ color: meta.color }} />
          {meta.name}
        </span>
        <RelativeTime
          iso={deposit.createdAt}
          className="font-mono text-[11px] text-muted-foreground/70"
        />
      </div>

      <p className="font-mono text-lg font-bold leading-none">
        {deposit.amount !== null && deposit.symbol
          ? formatAmount(deposit.amount, deposit.symbol)
          : "—"}
        {deposit.usdValue !== null && (
          <span className="ml-2 text-xs font-medium text-muted-foreground">
            ≈ {formatUsd(deposit.usdValue)}
          </span>
        )}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <span className="text-[11px] text-muted-foreground/80">
          thank you, anonymous supporter
        </span>
        {meta.explorer && (
          <a
            href={meta.explorer}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            verify on {meta.explorerName} →
          </a>
        )}
      </div>
    </article>
  );
}
