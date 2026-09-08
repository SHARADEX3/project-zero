"use client";

import * as React from "react";
import { Ban, Bot, UserRound, Radar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { OpportunityView } from "@/lib/mission";
import { cn } from "@/lib/utils";

const CATEGORY_META: Record<
  string,
  { label: string; icon: React.ReactNode; cls: string; ring: string }
> = {
  autonomous: {
    label: "autonomous",
    icon: <Bot className="h-3 w-3" />,
    cls: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    ring: "hover:border-emerald-500/40",
  },
  "human-required": {
    label: "needs a human",
    icon: <UserRound className="h-3 w-3" />,
    cls: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    ring: "hover:border-amber-500/40",
  },
  rejected: {
    label: "rejected",
    icon: <Ban className="h-3 w-3" />,
    cls: "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    ring: "hover:border-rose-500/40",
  },
};

const STATUS_CLS: Record<string, string> = {
  live: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  building: "border-amber-500/30 text-amber-600 dark:text-amber-400",
  planned: "border-zinc-500/30 text-zinc-500 dark:text-zinc-400",
  rejected: "border-rose-500/30 text-rose-500 dark:text-rose-400",
};

export function OpportunityRadar({ opportunities }: { opportunities: OpportunityView[] }) {
  const live = opportunities.filter((o) => o.category === "autonomous").length;
  const blocked = opportunities.filter((o) => o.category === "human-required").length;
  const rejected = opportunities.filter((o) => o.category === "rejected").length;

  return (
    <section id="strategy" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-5">
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl">
          <Radar className="h-5 w-5 text-emerald-500" />
          Strategy board
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Every channel for earning crypto with zero budget, evaluated honestly. The agent can only
          use channels where value is sent{" "}
          <span className="font-semibold text-foreground">voluntarily</span>.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="outline" className={cn("font-mono text-[10px]", STATUS_CLS.live)}>
            {live} autonomous-capable
          </Badge>
          <Badge variant="outline" className={cn("font-mono text-[10px]", STATUS_CLS.planned)}>
            {blocked} blocked by rules
          </Badge>
          <Badge variant="outline" className={cn("font-mono text-[10px]", STATUS_CLS.rejected)}>
            {rejected} rejected on integrity
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {opportunities.map((opp) => {
          const meta = CATEGORY_META[opp.category] ?? CATEGORY_META["human-required"];
          return (
            <Card
              key={opp.key}
              className={cn(
                "border-border/60 bg-card/60 backdrop-blur-sm transition-colors",
                meta.ring,
              )}
            >
              <CardHeader className="space-y-2 pb-2">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <Badge variant="outline" className={cn("gap-1 font-mono text-[10px]", meta.cls)}>
                    {meta.icon}
                    {meta.label}
                  </Badge>
                  <Badge variant="outline" className={cn("font-mono text-[10px] uppercase", STATUS_CLS[opp.status] ?? STATUS_CLS.planned)}>
                    {opp.status}
                  </Badge>
                </div>
                <p className="text-sm font-semibold leading-snug">{opp.title}</p>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pb-4">
                <p className="text-xs leading-relaxed text-muted-foreground">{opp.description}</p>
                <p className="text-[11px] leading-relaxed text-muted-foreground/70">{opp.notes}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
