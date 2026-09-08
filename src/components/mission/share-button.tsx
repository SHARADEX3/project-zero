"use client";

import * as React from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SHARE_TEXT =
  "An AI agent is trying to earn crypto from absolute zero — no budget, no human help. Live on-chain experiment:";

/**
 * Share the mission. Uses the Web Share API where available (mobile /
 * tablet), falls back to clipboard + toast everywhere else.
 */
export function ShareButton({ className }: { className?: string }) {
  const [shared, setShared] = React.useState(false);
  const { toast } = useToast();

  const share = async () => {
    const url = window.location.origin + window.location.pathname;
    const payload = { title: "Project Zero", text: SHARE_TEXT, url };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(payload);
        setShared(true);
        setTimeout(() => setShared(false), 1600);
        return;
      } catch (err) {
        // User dismissed the share sheet — not an error.
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${url}`);
      toast({
        title: "Mission link copied",
        description: "Paste it anywhere — every visitor is a potential datapoint.",
      });
      setShared(true);
      setTimeout(() => setShared(false), 1600);
    } catch {
      toast({
        title: "Could not share",
        description: "Clipboard unavailable — copy the URL from the address bar.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={share}
      className={`h-8 gap-1.5 text-xs font-medium transition-colors hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 ${className ?? ""}`}
      aria-label="Share the mission"
    >
      {shared ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">{shared ? "Shared" : "Share"}</span>
    </Button>
  );
}
