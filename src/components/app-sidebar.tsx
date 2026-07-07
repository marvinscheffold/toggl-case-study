"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Timer,
  Download,
  SquareCheck,
  PowerIcon,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTutorialStore } from "@/lib/tutorial-store";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "TRACK",
    items: [{ label: "Timer", href: "/", icon: Timer }],
  },
  {
    label: "PROOF",
    items: [{ label: "Export", href: "/export", icon: Download }],
  },
  {
    label: "PLAN",
    items: [{ label: "Tasks", href: "/tasks", icon: SquareCheck }],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const tutorialStatus = useTutorialStore((state) => state.status);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-5 py-6">
        <span className="flex size-8 items-center justify-center rounded-full bg-toggl-pink">
          <PowerIcon className="size-4 text-sidebar-primary-foreground" />
        </span>
        <span className="text-lg font-bold tracking-tight">
          toggl <span className="font-normal">track</span>
        </span>
      </div>
      <nav className="flex flex-col gap-6 px-3">
        {navGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <span className="px-3 text-xs font-semibold tracking-wider text-sidebar-foreground/50">
              {group.label}
            </span>
            {group.items.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;
              const link = (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              );

              if (href === "/export") {
                const showTourTip =
                  mounted &&
                  tutorialStatus === "active" &&
                  pathname !== "/export";
                return (
                  <Tooltip key={href} open={showTourTip}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      Click here to open the export page
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return link;
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
