import { NextResponse } from "next/server";
import { getMissionData } from "@/lib/mission";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getMissionData();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[/api/wallets] failed:", err);
    return NextResponse.json({ error: "mission data unavailable" }, { status: 500 });
  }
}
