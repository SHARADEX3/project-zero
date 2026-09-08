import { SiteHeader } from "@/components/mission/site-header";
import { SiteFooter } from "@/components/mission/site-footer";
import { MissionControl } from "@/components/mission/mission-control";
import { MissionJournal } from "@/components/mission/mission-journal";
import { MissionAbout } from "@/components/mission/mission-about";
import { getMissionData } from "@/lib/mission";

export const dynamic = "force-dynamic";

export default async function Home() {
  // SSR paints instantly from the DB; the client hydrates live on-chain data.
  const initial = await getMissionData({ skipNetwork: true });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader live />
      <main className="flex-1">
        <MissionControl initial={initial} />
        <MissionJournal />
        <MissionAbout />
      </main>
      <SiteFooter startedAt={initial.mission.startedAt} />
    </div>
  );
}
