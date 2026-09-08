"use client";

import * as React from "react";
import { QRCodeSVG } from "qrcode.react";
import { ExternalLink, Wallet2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CopyButton } from "@/components/mission/copy-button";
import { Sparkline } from "@/components/mission/sparkline";
import { formatAmount, formatUsd, timeAgo, truncateAddress } from "@/lib/format";
import type { WalletView } from "@/lib/mission";

const GLYPHS: Record<string, string> = {
  bitcoin: "₿",
  ethereum: "Ξ",
  solana: "◎",
  ronin: "R",
  tron: "T",
};

export function WalletCard({ wallet }: { wallet: WalletView }) {
  const funded = wallet.balanceRaw !== null && BigInt(wallet.balanceRaw) > 0n;
  const glyph = GLYPHS[wallet.chain] ?? wallet.symbol[0];

  return (
    <Card className="group border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-border hover:shadow-lg hover:shadow-black/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-lg font-bold"
            style={{
              color: wallet.color,
              backgroundColor: `${wallet.color}1a`,
              boxShadow: `inset 0 0 0 1px ${wallet.color}40`,
            }}
            aria-hidden
          >
            {glyph}
          </span>
          <div className="flex flex-col">
            <p className="text-sm font-semibold leading-tight">{wallet.name}</p>
            <p className="text-[11px] text-muted-foreground font-mono leading-tight">
              {wallet.symbol} · {wallet.explorerName}
            </p>
          </div>
        </div>
        {funded ? (
          <Badge
            variant="outline"
            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
          >
            funded
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            empty · live
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          {/* QR always scannable: white quiet-zone regardless of theme */}
          <div className="shrink-0 rounded-lg border border-border/60 bg-white p-2 shadow-sm">
            <QRCodeSVG
              value={wallet.address}
              size={96}
              level="M"
              bgColor="#ffffff"
              fgColor="#09090b"
              aria-label={`${wallet.name} deposit address QR code`}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p
              className="break-all font-mono text-[11px] leading-snug text-muted-foreground"
              title={wallet.address}
            >
              {truncateAddress(wallet.address, 16, 10)}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <CopyButton value={wallet.address} label={`${wallet.name} address`} />
              <a
                href={wallet.explorer}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center gap-1 rounded-md border border-input bg-background px-2.5 font-mono text-xs shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label={`View ${wallet.name} address on ${wallet.explorerName}`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Verify
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-mono text-xl font-bold tracking-tight sm:text-2xl">
              {wallet.balance !== null ? formatAmount(wallet.balance, wallet.symbol) : "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {wallet.priceUsd !== null && wallet.balance !== null
                ? `${formatUsd(wallet.usdValue)} · ${wallet.symbol} @ ${formatUsd(wallet.priceUsd)}`
                : formatUsd(wallet.usdValue)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <Sparkline points={wallet.history.map((h) => h.usd)} />
            {wallet.updatedAt && (
              <p className="text-[10px] text-muted-foreground/70 font-mono">
                {timeAgo(wallet.updatedAt)}
              </p>
            )}
          </div>
        </div>

        <p className="flex items-center gap-1.5 border-t border-border/60 pt-3 text-[11px] text-muted-foreground/80">
          <Wallet2 className="h-3 w-3 shrink-0" />
          Scan, copy, or verify on {wallet.explorerName} — every inflow lands in the mission feed
          within minutes.
        </p>
      </CardContent>
    </Card>
  );
}
