"use client";

import * as React from "react";
import { AlertTriangle, RefreshCw, Wallet2 } from "lucide-react";
import { MissionHero } from "@/components/mission/mission-hero";
import { WalletCard } from "@/components/mission/wallet-card";
import { ActivityFeed } from "@/components/mission/activity-feed";
import { SupportersWall } from "@/components/mission/supporters-wall";
import { OpportunityRadar } from "@/components/mission/opportunity-radar";
import type { MissionPayload } from "@/lib/mission";

const POLL_INTERVAL_MS = 45_000;

export function useMissionData(initial: MissionPayload) {
  const [data, setData] = React.useState<MissionPayload>(initial);
  const [refreshing, setRefreshing] = React.useState(false);
  const [feedError, setFeedError] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (typeof document !== "undefined" && document.hidden) return;
      setRefreshing(true);
      try {
        const res = await fetch("/api/wallets", { cache: "no-store" });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const json = (await res.json()) as MissionPayload;
        if (!cancelled) {
          setData(json);
          setFeedError(false);
        }
      } catch {
        if (!cancelled) setFeedError(true);
      } finally {
        if (!cancelled) setRefreshing(false);
      }
    };

    load();
    const id = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return { data, refreshing, feedError };
}

export function MissionControl({ initial }: { initial: MissionPayload }) {
  const { data, refreshing, feedError } = useMissionData(initial);

  return (
    <>
      <MissionHero mission={data.mission} refreshing={refreshing} />

      <section id="wallets" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl">
              <Wallet2 className="h-5 w-5 text-emerald-500" />
              The wallets
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Five chains, live balances, scannable QR codes. Supporting the mission takes under a
              minute.
            </p>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <RefreshCw
              className={`h-3 w-3 ${refreshing ? "animate-spin text-emerald-500" : ""}`}
              aria-hidden
            />
            auto-refresh 45s
          </span>
        </div>

        {feedError && (
          <div
            role="alert"
            className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-600 dark:text-amber-400"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Live feed interrupted — showing last known state, retrying automatically.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.wallets.map((wallet) => (
            <WalletCard key={wallet.chain} wallet={wallet} />
          ))}
        </div>
      </section>

      <ActivityFeed events={data.events} />
      <SupportersWall
        events={data.events}
        wallets={data.wallets}
        totalEarnedUsd={data.mission.totalEarnedUsd}
      />
      <OpportunityRadar opportunities={data.opportunities} />
    </>
  );
}
