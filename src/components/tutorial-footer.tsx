"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Check } from "lucide-react";

import { useTutorialStore } from "@/lib/tutorial-store";
import { cn } from "@/lib/utils";

const CLOSE_DELAY_MS = 1800;
const SLIDE_DURATION_MS = 500;

const steps = [
  {
    title: "Create a client",
    subtitle: "Who you work for",
  },
  {
    title: "Create a project",
    subtitle: "Group related work",
  },
  { title: "Create a task", subtitle: "Plan your work" },
  {
    title: "Time your work",
    subtitle: "Track your first entry",
  },
  {
    title: "Export a timesheet",
    subtitle: "To proof your work",
  },
];

function fireConfetti(originY: number) {
  const defaults = {
    startVelocity: 35,
    spread: 70,
    ticks: 120,
    gravity: 1.2,
    zIndex: 100,
    colors: ["#d8407a", "#e57cd8", "#5a3fb8", "#9b7be8"],
  };

  confetti({
    ...defaults,
    particleCount: 60,
    angle: 90,
    origin: { x: 0.5, y: originY },
  });
  confetti({
    ...defaults,
    particleCount: 40,
    angle: 60,
    origin: { x: 0.25, y: originY },
  });
  confetti({
    ...defaults,
    particleCount: 40,
    angle: 120,
    origin: { x: 0.75, y: originY },
  });
}

export function TutorialFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const tutorialStatus = useTutorialStore((state) => state.status);
  const [footerHeight, setFooterHeight] = useState(0);
  const [closed, setClosed] = useState(false);
  const [removed, setRemoved] = useState(false);

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const updateHeight = () => setFooterHeight(footer.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (tutorialStatus !== "done") return;

    const rect = footerRef.current?.getBoundingClientRect();
    const originY = rect ? rect.top / window.innerHeight : 0.9;
    fireConfetti(originY);

    const closeTimer = setTimeout(
      () => setClosed(true),
      CLOSE_DELAY_MS,
    );
    return () => clearTimeout(closeTimer);
  }, [tutorialStatus]);

  useEffect(() => {
    if (!closed) return;

    const removeTimer = setTimeout(
      () => setRemoved(true),
      SLIDE_DURATION_MS,
    );
    return () => clearTimeout(removeTimer);
  }, [closed]);

  const stepDone = (index: number) =>
    index < steps.length - 1 || tutorialStatus === "done";

  if (removed) return null;

  return (
    <div
      className="shrink-0 overflow-hidden transition-[height] ease-out"
      style={{
        height: closed ? 0 : footerHeight,
        transitionDuration: `${SLIDE_DURATION_MS}ms`,
      }}
    >
      <footer
        ref={footerRef}
        className={cn(
          "border-t bg-card px-8 py-4 transition-transform ease-out",
          closed && "translate-y-full",
        )}
        style={{ transitionDuration: `${SLIDE_DURATION_MS}ms` }}
      >
        <ol className="flex items-center justify-between gap-4">
          {steps.map((step, index) => {
            const done = stepDone(index);
            return (
              <li
                key={step.title}
                className="flex flex-1 items-center gap-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                      done
                        ? "border border-primary text-primary"
                        : "bg-primary text-primary-foreground",
                    )}
                  >
                    {done ? <Check className="size-4" /> : index + 1}
                  </span>
                  <span className="flex flex-col">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        done
                          ? "text-muted-foreground"
                          : "text-foreground",
                      )}
                    >
                      {step.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {step.subtitle}
                    </span>
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <span
                    className={cn(
                      "h-px flex-1",
                      done ? "bg-primary/40" : "bg-border",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </footer>
    </div>
  );
}
