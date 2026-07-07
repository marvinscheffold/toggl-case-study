import type { Metadata } from "next";
import { Play, SquareCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WeekView } from "@/components/week-view";

export const metadata: Metadata = {
  title: {
    absolute: "Toggl - Timer",
  },
};

export default function TimerPage() {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b px-8 py-4">
        <Button variant="dashed" className="rounded-full">
          <SquareCheck />
          Select task
        </Button>
        <div className="flex items-center gap-8">
          <span className="text-xl font-semibold text-muted-foreground">
            0:00:00
          </span>
          <Button
            size="icon-lg"
            className="rounded-full"
            aria-label="Start timer"
          >
            <Play className="size-4 fill-current" />
          </Button>
        </div>
      </header>
      <WeekView />
    </div>
  );
}
