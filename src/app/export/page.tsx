"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Calendar, Download } from "lucide-react";

import { ExportSummaryBox } from "@/components/export-summary-box";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useClients, useLogs, useProjects, useTasks } from "@/lib/hooks";
import { getCurrentWeekNumber, getCurrentWeekRange } from "@/lib/date-utils";
import {
  downloadSummaryReportPdf,
  getExportSummary,
} from "@/lib/export-summary-pdf";
import { useTutorialStore } from "@/lib/tutorial-store";

export default function ExportPage() {
  const { clients } = useClients();
  const { logs } = useLogs();
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const selectedClient = clients[0];
  const clientName = selectedClient?.title ?? "Acme Inc.";
  const clientId = selectedClient?.id ?? "client-1";
  const tutorialStatus = useTutorialStore((state) => state.status);
  const completeFinalStep = useTutorialStore(
    (state) => state.completeFinalStep,
  );
  const [mounted, setMounted] = useState(false);
  const [weekFilterActive, setWeekFilterActive] = useState(true);
  const [clientFilterActive, setClientFilterActive] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const weekNumber = getCurrentWeekNumber();
  const { start, end, days } = getCurrentWeekRange();

  const summary = useMemo(
    () =>
      getExportSummary({
        clientName,
        weekNumber,
        timeframeStart: start,
        timeframeEnd: end,
        timeframeDays: days,
        logs,
        tasks,
        projects,
        clientId,
        weekFilterActive,
        clientFilterActive,
      }),
    [
      clientName,
      weekNumber,
      start,
      end,
      days,
      logs,
      tasks,
      projects,
      clientId,
      weekFilterActive,
      clientFilterActive,
    ],
  );

  const handleDownloadPdf = async () => {
    await downloadSummaryReportPdf({
      clientName,
      weekNumber,
      timeframeStart: start,
      timeframeEnd: end,
      timeframeDays: days,
      logs,
      tasks,
      projects,
      clientId,
      weekFilterActive,
      clientFilterActive,
    });
    completeFinalStep();
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b px-8 py-4">
        <h1 className="text-xl font-semibold">Export</h1>
        <Tooltip open={mounted && tutorialStatus === "active"}>
          <TooltipTrigger asChild>
            <Button size="lg" onClick={handleDownloadPdf}>
              <Download />
              Download PDF
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={8}>
            Click here to download your first timesheet as PDF
          </TooltipContent>
        </Tooltip>
      </header>
      <div className="flex gap-3 border-b px-8 py-4">
        {weekFilterActive && (
          <Button
            variant="neutral"
            hasClearIcon
            clearLabel={`Remove This week · W${weekNumber} filter`}
            onClear={() => setWeekFilterActive(false)}
          >
            <Calendar />
            {`This week · W${weekNumber}`}
          </Button>
        )}
        {clientFilterActive && (
          <Button
            variant="neutral"
            hasClearIcon
            clearLabel={`Remove Client is ${clientName} filter`}
            onClear={() => setClientFilterActive(false)}
          >
            <Building2 />
            {`Client is ${clientName}`}
          </Button>
        )}
      </div>
      <div className="px-8 py-6">
        <ExportSummaryBox summary={summary} />
      </div>
    </div>
  );
}
