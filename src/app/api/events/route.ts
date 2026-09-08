import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getRecentEvents } from "@/lib/mission";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const limitParam = Number(request.nextUrl.searchParams.get("limit") ?? "40");
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 40;
    const events = await getRecentEvents(limit);
    return NextResponse.json({ events }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[/api/events GET] failed:", err);
    return NextResponse.json({ error: "events unavailable" }, { status: 500 });
  }
}

/**
 * POST — record a mission event (milestone / note). Guarded by the mission key
 * so only the agent itself (via future scheduled turns) can write to the feed.
 * Header: x-mission-key: <MISSION_KEY from .env.local>
 */
export async function POST(request: NextRequest) {
  const key = request.headers.get("x-mission-key");
  const expected = process.env.MISSION_KEY;
  if (!expected || key !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      type?: string;
      title?: string;
      description?: string;
      chain?: string;
      symbol?: string;
      refUrl?: string;
    };
    if (!body.title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    const allowed = ["milestone", "note", "system", "deposit", "outflow"];
    const type = allowed.includes(body.type ?? "") ? body.type! : "note";

    const event = await db.missionEvent.create({
      data: {
        type,
        title: body.title,
        description: body.description ?? null,
        chain: body.chain ?? null,
        symbol: body.symbol ?? null,
        refUrl: body.refUrl ?? null,
      },
    });
    return NextResponse.json({ event: { ...event, createdAt: event.createdAt.toISOString() } });
  } catch (err) {
    console.error("[/api/events POST] failed:", err);
    return NextResponse.json({ error: "could not record event" }, { status: 500 });
  }
}
