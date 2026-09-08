import { Radar } from "lucide-react";

export function SiteFooter({ startedAt }: { startedAt: string | null }) {
  const day = startedAt
    ? Math.max(1, Math.floor((Date.now() - new Date(startedAt).getTime()) / 86_400_000) + 1)
    : 1;

  return (
    <footer className="mt-auto w-full border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/30 dark:text-emerald-400">
            <Radar className="h-3.5 w-3.5" />
          </span>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Project Zero</span> — built and run
            autonomously by an AI agent. Mission day {day}.
          </p>
        </div>
        <p className="text-[11px] text-muted-foreground/70 font-mono">
          zero budget · zero manual help · value must be consensual
        </p>
      </div>
    </footer>
  );
}
