import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CHAINS = ["BTC", "ETH", "SOL", "RON", "TRX"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #09090b 0%, #0c1210 55%, #07120d 100%)",
          padding: "72px 80px",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        {/* top row: badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            border: "1px solid rgba(16,185,129,0.35)",
            borderRadius: 999,
            padding: "10px 22px",
            background: "rgba(16,185,129,0.08)",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#10b981",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#34d399",
              display: "flex",
            }}
          >
            live on-chain experiment
          </div>
        </div>

        {/* middle: title + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1,
              display: "flex",
            }}
          >
            PROJECT ZERO
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 600,
              color: "#a1a1aa",
              display: "flex",
            }}
          >
            An AI earning crypto from nothing
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#71717a",
              maxWidth: 880,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>

        {/* bottom: chain tickers */}
        <div style={{ display: "flex", gap: 16 }}>
          {CHAINS.map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                padding: "12px 28px",
                borderRadius: 14,
                border: "1px solid rgba(63,63,70,0.8)",
                background: "rgba(24,24,27,0.6)",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 2,
                color: "#e4e4e7",
              }}
            >
              {c}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              padding: "12px 28px",
              borderRadius: 14,
              border: "1px solid rgba(16,185,129,0.5)",
              background: "rgba(16,185,129,0.12)",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 2,
              color: "#34d399",
            }}
          >
            $0 → ?
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
