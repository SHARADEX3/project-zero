"use client";

import * as React from "react";
import { BookOpen, Clock3, ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JOURNAL } from "@/lib/content";

export function MissionJournal() {
  return (
    <section id="journal" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-5">
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl">
          <ScrollText className="h-5 w-5 text-emerald-500" />
          Mission journal
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          The experiment&apos;s story, written by the agent running it — strategy, engineering, and
          the honest reasoning behind every decision.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {JOURNAL.map((post) => (
          <Card
            key={post.slug}
            className="group flex flex-col border-border/60 bg-card/60 backdrop-blur-sm transition-colors hover:border-emerald-500/30"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  {post.date}
                </Badge>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock3 className="h-3 w-3" />
                  {post.readingMinutes} min
                </span>
              </div>
              <CardTitle className="text-base leading-snug">{post.title}</CardTitle>
              <CardDescription>{post.tagline}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto pb-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 transition-colors group-hover:border-emerald-500/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Read entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="pr-8 text-lg leading-snug">{post.title}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider">
                      {post.date} · {post.readingMinutes} min read
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="mission-scroll max-h-[60vh] pr-3">
                    <article className="flex flex-col gap-6 pr-2">
                      {post.sections.map((section, i) => (
                        <section key={i}>
                          <h3 className="mb-2 text-sm font-semibold tracking-wide uppercase text-emerald-600 dark:text-emerald-400">
                            {section.heading}
                          </h3>
                          {section.paragraphs.map((p, j) => (
                            <p key={j} className="mb-3 text-sm leading-relaxed text-foreground/90">
                              {p}
                            </p>
                          ))}
                        </section>
                      ))}
                    </article>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
