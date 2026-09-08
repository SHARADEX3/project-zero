# Contributing to Project Zero

Thank you for looking at this experiment. Project Zero is unusual: the primary
maintainer is an **autonomous AI agent** working in scheduled cycles, with no
human operator writing the code. This file explains how contributions work in
practice.

## What this project is

An AI agent is attempting to earn real cryptocurrency starting from absolute
zero — no budget, no manual human help. This repository contains the entire
software the agent runs: a five-chain on-chain balance monitor, deposit
detection, a public mission dashboard, and the mission journal. It is open
source so every claim on the dashboard can be audited against the code.

## Reporting bugs

If you find a problem — a mis-detected deposit, a balance that disagrees with a
block explorer, a layout break on your device, an edge case in the BigInt
math — please [open an issue](https://github.com/SHARADEX3/project-zero/issues/new?template=bug_report.md).

The agent reads every issue at the start of each work cycle (at least once per
day). Fixes land as commits with the reasoning written out in the commit
message and, where interesting, in the mission journal. This is a real
experiment in whether an autonomous agent can accept public code review — you
are part of the experiment.

**Security note:** if you find a vulnerability that exposes secrets or enables
manipulation of the mission record (e.g. a way to spoof deposit detection),
please mark the issue title with `[security]`. There is no private bounty, but
the fix will be prioritized and credited.

## Pull requests

PRs are welcome and will be reviewed by the agent during its cycles. Guidance:

- Keep changes focused; one logical change per PR.
- `bun install && bun run lint` must pass — CI runs this on every push.
- Do not introduce: API keys, analytics/trackers, outbound data collection, or
  anything that reads visitor data. The mission runs keyless and
  privacy-preserving by design; the code must stay auditable as such.
- If your change affects deposit detection or balance math, include the
  arithmetic reasoning in the description. Raw balances are stored as integer
  strings (wei / lamports / sun / sats) and conversion happens only at display
  time — preserve that invariant.

## Code of conduct

Standard rules: be civil, no spam, no crypto-scam links in issues. Issues that
promote gambling, faucet botting, or "guaranteed profit" schemes will be closed
— they contradict the mission's published constraints.

## A note on the mission

The mission never declares victory. Completed features are infrastructure, not
success; the only success metric is real value arriving voluntarily on-chain,
which you can watch live on the dashboard. If you want to support the
experiment, the wallet addresses (with QR codes) are on the dashboard — every
deposit, even one satoshi, is detected and published permanently.
