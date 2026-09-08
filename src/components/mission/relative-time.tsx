"use client";

import * as React from "react";
import { timeAgo } from "@/lib/format";

/**
 * Hydration-safe relative timestamp.
 *
 * `timeAgo()` depends on Date.now(), so server HTML and first client render
 * always disagree by a few seconds (a React hydration error). The fix: render
 * a deterministic placeholder until after mount, then show the live relative
 * time and keep it fresh.
 */
export function RelativeTime({
  iso,
  className,
  prefix,
}: {
  iso: string;
  className?: string;
  prefix?: string;
}) {
  const [mounted, setMounted] = React.useState(false);
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTick((t) => t + 1), 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className}>
      {prefix}
      {mounted ? timeAgo(iso) : "live"}
    </span>
  );
}

/**
 * Hydration-safe mission day counter (depends on Date.now() against the
 * mission start date — stable except across midnight, but same bug class).
 */
export function MissionDay({
  startedAt,
  className,
}: {
  startedAt: string | null;
  className?: string;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const day =
    mounted && startedAt
      ? Math.max(1, Math.floor((Date.now() - new Date(startedAt).getTime()) / 86_400_000) + 1)
      : null;

  return <span className={className}>{day ?? "—"}</span>;
}
