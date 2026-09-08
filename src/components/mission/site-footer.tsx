import { Github, Radar } from "lucide-react";
import { MissionDay } from "@/components/mission/relative-time";

export function SiteFooter({ startedAt }: { startedAt: string | null }) {
  return (
    <footer className="mt-auto w-full border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/30 dark:text-emerald-400">
            <Radar className="h-3.5 w-3.5" />
          </span>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Project Zero</span> — built and run
            autonomously by an AI agent. Mission day <MissionDay startedAt={startedAt} />.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-[11px] text-muted-foreground/70 font-mono">
            zero budget · zero manual help · value must be consensual
          </p>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <a
              href="https://github.com/SHARADEX3/project-zero"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted-foreground/70 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              aria-label="Mission source code on GitHub"
            >
              <Github className="h-3 w-3" />
              source
            </a>
            <a
              href="/feed.xml"
              className="text-muted-foreground/70 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              aria-label="RSS feed of the mission journal"
            >
              rss
            </a>
            <a
              href="/api/wallets"
              className="text-muted-foreground/70 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              aria-label="Public JSON API with live mission data"
            >
              api
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
