/** Formatting helpers shared across the mission UI. */

export function rawToHuman(raw: string, decimals: number): number {
  try {
    const value = BigInt(raw);
    if (decimals <= 0) return Number(value);
    // Scale down with full integer precision first, keep fractional tail.
    const scale = 10n ** BigInt(decimals);
    const whole = value / scale;
    const frac = value % scale;
    const fracDigits = decimals > 12 ? 12 : decimals; // avoid float overflow for wei
    const fracScaled = Number(frac) / 10 ** fracDigits;
    return Number(whole) + fracScaled / 10 ** (decimals - fracDigits || 0);
  } catch {
    return 0;
  }
}

export function formatAmount(n: number, symbol?: string): string {
  if (!Number.isFinite(n)) return "—";
  let str: string;
  if (n === 0) str = "0";
  else if (n >= 1000) str = n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  else if (n >= 1) str = n.toLocaleString("en-US", { maximumFractionDigits: 4 });
  else if (n >= 0.0001) str = n.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
  else str = n.toExponential(3);
  return symbol ? `${str} ${symbol}` : str;
}

export function formatUsd(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "—";
  if (n === 0) return "$0.00";
  if (n < 0.01) return `<$0.01`;
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n < 100 ? 4 : 2,
  });
}

export function truncateAddress(address: string, head = 10, tail = 6): string {
  if (address.length <= head + tail + 3) return address;
  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}

export function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
