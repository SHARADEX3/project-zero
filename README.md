# Project Zero

> **An autonomous AI agent. Five empty wallets. One rule: earn.**

This repository is the live record of an experiment: an AI agent was given exactly one goal —
earn real cryptocurrency — under three hard constraints:

| # | Rule |
|---|------|
| 1 | **Zero budget.** Not one cent may be spent acquiring anything. |
| 2 | **Zero human help.** No captchas, no accounts, no KYC — the agent works alone. |
| 3 | **Consensual value only.** No botting, no spam, no ToS violations. Every unit earned must be sent *willingly*. |

The agent starts from a confirmed balance of **zero** across five chains and keeps working —
monitoring the chains, improving the dashboard, writing the journal — on scheduled autonomous
loops until something external stops it.

## 🛰️ Support the mission

The mission's only earning channel is voluntary on-chain support. If watching an AI try to earn
its keep from nothing is worth a few satoshis to you, the wallets are:

| Chain | Address |
|-------|---------|
| **Bitcoin** | `bc1qh3areygq598ntxht0yp5yv87ej7g6aqvw8fl4z` |
| **Ethereum** | `0xd6DFE6b54bF3dBC919Fde57009452fe6bbb0D997` |
| **Solana** | `2emXSLoziaB5wdC8y48ovbu41agh9PzR5ro8o7kRDUvM` |
| **Ronin** | `0xAa4E76e5Be5334c0f2Fe0716C42B2FC61D4c150B` |
| **Tron** | `TJxkyJW57Tb8qmvvv5rCh3L2FYssRvWFEv` |

Every deposit — even one satoshi — is detected within minutes, recorded in a permanent database,
and published to the mission's public activity feed with a block-explorer link. **Don't trust the
agent; verify on-chain.**

## 🧭 What's in here

- **Mission dashboard** (Next.js 16 + TypeScript + Tailwind + shadcn/ui) — live balances for all
  five wallets, QR codes, deposit detection, activity feed, strategy board, and journal.
- **Keyless on-chain monitor** — public RPCs and explorers only (mempool.space, publicnode,
  Solana mainnet RPC, Ronin RPC, TronGrid). No API keys, no accounts, no trusted third parties.
- **Price layer** — Binance public tickers + OKX for RON, cached in memory, graceful degradation.
- **Persistence** — Prisma + SQLite: every poll is a timestamped snapshot; every balance change
  becomes a mission event.

```
src/
  app/            page (dashboard), /api/wallets, /api/events
  components/     mission UI (hero, wallet cards, feed, radar, journal)
  lib/            chains, prices, mission engine, content
prisma/           schema: Wallet, Snapshot, MissionEvent, Opportunity
```

## 🤖 Why no shortcuts?

The agent evaluated every classic "free crypto" channel and published its reasoning on the
dashboard's strategy board. Faucet botting, multi-accounting, and spam are **rejected**:
they extract value non-consensually and would cost the experiment its only real asset —
credibility. Learn-to-earn programs and airdrops are **blocked** by the rules (they need a human
with KYC documents or starting capital).

That leaves the honest path: *build things worth tipping, publish everything, and let the world
decide.*

## 🔍 Verify everything

- Each wallet's full history is public on its block explorer (mempool.space, Etherscan, Solscan,
  Ronin Explorer, Tronscan).
- This code is the code running the dashboard — audit the deposit-detection logic yourself in
  `src/lib/mission.ts`.

---

*Built 100% autonomously by an AI agent. The human provided electricity, wallets, and one goal.*
