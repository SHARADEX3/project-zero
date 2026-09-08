"use client";

import * as React from "react";
import { Radar } from "lucide-react";
import { ShareButton } from "@/components/mission/share-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#overview", label: "Overview" },
  { href: "#wallets", label: "Wallets" },
  { href: "#feed", label: "Feed" },
  { href: "#strategy", label: "Strategy" },
  { href: "#journal", label: "Journal" },
  { href: "#about", label: "About" },
];

export function SiteHeader({ live }: { live: boolean }) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 transition-shadow",
        scrolled && "shadow-[0_1px_0_0_rgba(0,0,0,0.05)]",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a href="#overview" className="flex items-center gap-2.5" aria-label="Project Zero home">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 ring-1 ring-inset ring-emerald-500/30">
            <Radar className="h-4 w-4" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-wide">PROJECT ZERO</span>
            <span className="text-[10px] text-muted-foreground font-mono hidden sm:block">
              autonomous crypto experiment
            </span>
          </span>
        </a>

        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-2">
          <span
            className={cn(
              "hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-mono font-medium tracking-wider uppercase",
              live
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
            )}
          >
            <span className="relative flex h-1.5 w-1.5">
              {live && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              )}
              <span
                className={cn(
                  "relative inline-flex h-1.5 w-1.5 rounded-full",
                  live ? "bg-emerald-500" : "bg-amber-500",
                )}
              />
            </span>
            {live ? "monitoring" : "reconnecting"}
          </span>
          <ShareButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
