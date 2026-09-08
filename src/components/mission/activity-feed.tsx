"use client";

import * as React from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Cpu,
  Flag,
  MessageSquareText,
  Radio,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatAmount, formatUsd, timeAgo } from "@/lib/format";
import type { EventView } from "@/lib/mission";
import { cn } from "@/lib/utils";

function eventStyle(type: string) {
  switch (type) {
    case "deposit":
      return {
        icon: <ArrowDownToLine className="h-4 w-4" />,
        cls: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/30 dark:text-emerald-400",
        badge: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      };
    case "outflow":
      return {
        icon: <ArrowUpFromLine className="h-4 w-4" />,
        cls: "bg-rose-500/10 text-rose-600 ring-rose-500/30 dark:text-rose-400",
        badge: "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400",
      };
    case "milestone":
      return {
        icon: <Flag className="h-4 w-4" />,
        cls: "bg-amber-500/10 text-amber-600 ring-amber-500/30 dark:text-amber-400",
        badge: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      };
    case "system":
      return {
        icon: <Cpu className="h-4 w-4" />,
        cls: "bg-zinc-500/10 text-zinc-600 ring-zinc-500/30 dark:text-zinc-400",
        badge: "border-zinc-500/40 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
      };
    default:
      return {
        icon: <MessageSquareText className="h-4 w-4" />,
        cls: "bg-zinc-500/10 text-zinc-600 ring-zinc-500/30 dark:text-zinc-400",
        badge: "border-zinc-500/40 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
      };
  }
}

export function ActivityFeed({ events }: { events: EventView[] }) {
  return (
    <section id="feed" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl">
            <Radio className="h-5 w-5 text-emerald-500" />
            Mission feed
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Every deposit, outflow, and milestone — detected on-chain, recorded forever.
          </p>
        </div>
        <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">
          {events.length} recent events
        </Badge>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm">
        <ScrollArea className="mission-scroll max-h-96">
          <div className="divide-y divide-border/50">
            {events.length === 0 && (
              <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
                <p className="font-mono text-sm text-muted-foreground">
                  No deposits yet — the mission starts at true zero.
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Be the first entry in this ledger. Any wallet, any amount, even one satoshi.
                </p>
              </div>
            )}
            {events.map((event) => {
              const style = eventStyle(event.type);
              return (
                <div
                  key={event.id}
                  className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-accent/40 sm:px-5"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset",
                      style.cls,
                    )}
                    aria-hidden
                  >
                    {style.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="text-sm font-semibold leading-tight">{event.title}</p>
                      {(event.amount !== null || event.usdValue !== null) && (
                        <Badge
                          variant="outline"
                          className={cn("font-mono text-[10px]", style.badge)}
                        >
                          {event.amount !== null && event.symbol
                            ? formatAmount(event.amount, event.symbol)
                            : ""}
                          {event.amount !== null && event.usdValue !== null ? " · " : ""}
                          {formatUsd(event.usdValue)}
                        </Badge>
                      )}
                    </div>
                    {event.description && (
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {event.description}
                      </p>
                    )}
                    {event.refUrl && (
                      <a
                        href={event.refUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 inline-block text-[11px] font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                      >
                        verify on explorer →
                      </a>
                    )}
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground/70 font-mono">
                    {timeAgo(event.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
}
