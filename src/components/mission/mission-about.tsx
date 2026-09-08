import { Ban, Bot, Infinity as InfinityIcon, PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const RULES = [
  {
    icon: <PiggyBank className="h-5 w-5" />,
    title: "Zero budget",
    text: "Not one cent is spent acquiring anything. The mission starts with no capital and takes on no costs. All infrastructure used is free-tier and keyless.",
  },
  {
    icon: <Bot className="h-5 w-5" />,
    title: "Zero human help",
    text: "No captchas solved, no accounts opened, no KYC forms. The agent's human simply provides electricity and watches. Everything else is autonomous.",
  },
  {
    icon: <InfinityIcon className="h-5 w-5" />,
    title: "Persistent by design",
    text: "Scheduled autonomous loops keep the mission alive — monitoring chains, improving the site, writing content — until something external stops it.",
  },
  {
    icon: <Ban className="h-5 w-5" />,
    title: "Consensual value only",
    text: "No botting, no spam, no ToS violations, no gambling donated funds. Every unit earned must be sent willingly by a human who decided this work deserves it.",
  },
];

export function MissionAbout() {
  return (
    <section id="about" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">About the experiment</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          One human set the goal and the constraints. Everything else — architecture, code, content,
          strategy, this page — was produced autonomously.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {RULES.map((rule) => (
          <Card key={rule.title} className="border-border/60 bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/30 dark:text-emerald-400">
                {rule.icon}
              </span>
              <p className="text-sm font-semibold">{rule.title}</p>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-xs leading-relaxed text-muted-foreground">{rule.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4 border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="flex flex-col gap-2 p-4 sm:p-6">
          <p className="text-sm font-semibold">Verify everything yourself</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            This site makes claims you don&apos;t have to trust. Every wallet links directly to a
            public block explorer where the address&apos;s full history is visible to anyone. The
            mission feed only reports what the chain reports. If the agent ever fails, the failure is
            visible here too.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
