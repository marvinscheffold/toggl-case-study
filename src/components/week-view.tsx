"use client";

import { useEffect, useRef } from "react";
import { Clock } from "lucide-react";

import { getCurrentWeek } from "@/lib/date-utils";
import { useLogs, useTasks } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import { cn, formatDuration } from "@/lib/utils";
import type { Log } from "@/lib/types";

const HOUR_HEIGHT_PX = 64;
const SCROLL_TO_HOUR = 7;
const MIN_ENTRY_HEIGHT_PX = 24;

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
});
const hours = Array.from({ length: 24 }, (_, i) => i);

function LogEntry({ log }: { log: Log }) {
  const { tasks } = useTasks();
  const task = tasks.find((t) => t.id === log.taskId);

  const startHours = log.start.getHours() + log.start.getMinutes() / 60;
  const durationHours =
    (log.end.getTime() - log.start.getTime()) / (60 * 60 * 1000);

  return (
    <div
      className="absolute inset-x-1 z-10 flex flex-col justify-between overflow-hidden rounded-md border-l-2 border-primary bg-primary/15 px-2 py-1.5"
      style={{
        top: startHours * HOUR_HEIGHT_PX,
        height: Math.max(durationHours * HOUR_HEIGHT_PX, MIN_ENTRY_HEIGHT_PX),
      }}
    >
      <span className="truncate text-xs font-medium text-foreground">
        {task?.title ?? "Unknown task"}
      </span>
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="size-3 shrink-0" />
        {formatDuration(log.end.getTime() - log.start.getTime())}
      </span>
    </div>
  );
}

export function WeekView() {
  const week = getCurrentWeek();
  const { logs } = useLogs();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const weekStart = getCurrentWeek()[0];
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const firstLog = [...useStore.getState().logs]
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .find((log) => log.start >= weekStart && log.start < weekEnd);

    // Scroll the first log of the week into view, slightly above center;
    // fall back to the start of the workday when there is nothing to show.
    const targetHour = firstLog
      ? firstLog.start.getHours() + firstLog.start.getMinutes() / 60 - 1
      : SCROLL_TO_HOUR;

    scrollRef.current?.scrollTo({
      top: Math.max(targetHour, 0) * HOUR_HEIGHT_PX,
    });
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Day header row */}
      <div className="grid shrink-0 grid-cols-[3.5rem_repeat(7,1fr)] border-b pr-[15px]">
        <div />
        {week.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "flex items-baseline justify-center gap-1.5 border-l px-2 py-3 text-sm",
              isToday(day)
                ? "font-semibold text-primary"
                : "text-muted-foreground",
            )}
          >
            <span className="text-base">{day.getDate()}</span>
            <span>{dayFormatter.format(day)}</span>
          </div>
        ))}
      </div>

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-[3.5rem_repeat(7,1fr)]">
          {/* Time gutter */}
          <div>
            {hours.map((hour) => (
              <div
                key={hour}
                className="relative text-right"
                style={{ height: HOUR_HEIGHT_PX }}
              >
                {hour > 0 && (
                  <span className="absolute -top-2 right-2 text-xs text-muted-foreground">
                    {formatHour(hour)}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {week.map((day) => (
            <div key={day.toISOString()} className="relative border-l">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="border-b"
                  style={{ height: HOUR_HEIGHT_PX }}
                />
              ))}
              {logs
                .filter((log) => isSameDay(log.start, day))
                .map((log) => (
                  <LogEntry key={log.id} log={log} />
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
