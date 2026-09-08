"use client";

import * as React from "react";

interface SparklineProps {
  points: number[];
  className?: string;
  height?: number;
}

/** Minimal dependency-free SVG sparkline for USD value history. */
export function Sparkline({ points, className, height = 28 }: SparklineProps) {
  if (points.length < 2) {
    return (
      <div
        className="flex items-center text-[10px] leading-none text-muted-foreground/70 font-mono"
        style={{ height }}
      >
        collecting history…
      </div>
    );
  }

  const w = 100;
  const h = height;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const up = points[points.length - 1] >= points[0];
  const stroke = up ? "#10b981" : "#f43f5e";

  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - 2 - ((p - min) / range) * (h - 4);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={className ?? "w-full"}
      style={{ height }}
      role="img"
      aria-label="balance history"
    >
      <polyline
        points={path}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        opacity="0.9"
      />
    </svg>
  );
}
