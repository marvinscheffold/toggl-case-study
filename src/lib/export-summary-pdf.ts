import { jsPDF } from "jspdf";

import { formatTimeframeFilterLabel } from "@/lib/date-utils";
import { loadPdfIcons, type PdfIcons } from "@/lib/pdf-icons";
import { loadPdfFonts, setPdfFont } from "@/lib/pdf-fonts";
import { hexToRgb, pdfTheme } from "@/lib/pdf-theme";
import type { Log, Project, Task } from "@/lib/types";
import { formatDurationHms } from "@/lib/utils";

export type SummaryReportInput = {
  clientName: string;
  weekNumber: number;
  timeframeStart: Date;
  timeframeEnd: Date;
  timeframeDays: number;
  logs: Log[];
  tasks: Task[];
  projects: Project[];
  clientId: string;
  weekFilterActive: boolean;
  clientFilterActive: boolean;
};

export type ExportSummary = {
  totalHours: string;
  billableHours: string;
  amount: string;
  averageDailyHours: string;
};

export const exportSummarySections: {
  label: string;
  key: keyof ExportSummary;
}[] = [
  { label: "Total hours", key: "totalHours" },
  { label: "Billable hours", key: "billableHours" },
  { label: "Amount", key: "amount" },
  { label: "Average Daily hours", key: "averageDailyHours" },
];

function getLogClientId(
  log: Log,
  tasks: Task[],
  projects: Project[],
): string | undefined {
  const task = tasks.find((t) => t.id === log.taskId);
  const project = projects.find((p) => p.id === task?.projectId);
  return project?.clientId;
}

function filterExportLogs({
  logs,
  tasks,
  projects,
  clientId,
  weekFilterActive,
  clientFilterActive,
  timeframeStart,
  timeframeEnd,
}: SummaryReportInput): Log[] {
  return logs.filter((log) => {
    if (
      weekFilterActive &&
      (log.start < timeframeStart || log.start >= timeframeEnd)
    ) {
      return false;
    }

    if (clientFilterActive) {
      const logClientId = getLogClientId(log, tasks, projects);
      if (logClientId !== clientId) return false;
    }

    return true;
  });
}

function computeSummary(
  filteredLogs: Log[],
  timeframeDays: number,
): ExportSummary {
  const totalMs = filteredLogs.reduce(
    (sum, log) => sum + (log.end.getTime() - log.start.getTime()),
    0,
  );
  const averageMs = timeframeDays > 0 ? totalMs / timeframeDays : 0;

  return {
    totalHours: formatDurationHms(totalMs),
    billableHours: "-",
    amount: "-",
    averageDailyHours: formatDurationHms(averageMs),
  };
}

export function getExportSummary(input: SummaryReportInput): ExportSummary {
  const filteredLogs = filterExportLogs(input);
  return computeSummary(filteredLogs, input.timeframeDays);
}

function setDrawColor(doc: jsPDF, hex: string) {
  doc.setDrawColor(...hexToRgb(hex));
}

function setTextColor(doc: jsPDF, hex: string) {
  doc.setTextColor(...hexToRgb(hex));
}

function drawHorizontalLine(
  doc: jsPDF,
  y: number,
  margin: number,
  pageWidth: number,
) {
  setDrawColor(doc, pdfTheme.border);
  doc.setLineWidth(0.25);
  doc.line(margin, y, pageWidth - margin, y);
}

function drawFilterChip(
  doc: jsPDF,
  x: number,
  y: number,
  label: string,
  iconDataUrl: string,
): number {
  const height = 8;
  const paddingLeft = 3;
  const paddingRight = 3;
  const iconSize = 3.5;
  const gap = 1.5;

  setPdfFont(doc, "regular");
  doc.setFontSize(10);
  const textWidth = doc.getTextWidth(label);
  const width = paddingLeft + iconSize + gap + textWidth + paddingRight;

  doc.setFillColor(...hexToRgb(pdfTheme.muted));
  setDrawColor(doc, pdfTheme.border);
  doc.setLineWidth(0.25);
  doc.roundedRect(x, y, width, height, height / 2, height / 2, "FD");

  doc.addImage(
    iconDataUrl,
    "PNG",
    x + paddingLeft,
    y + (height - iconSize) / 2,
    iconSize,
    iconSize,
  );

  setPdfFont(doc, "regular");
  setTextColor(doc, pdfTheme.foreground);
  doc.text(
    label,
    x + paddingLeft + iconSize + gap,
    y + height / 2 + 1.2,
  );

  return width;
}

function drawFilterChips(
  doc: jsPDF,
  x: number,
  y: number,
  input: SummaryReportInput,
  icons: PdfIcons,
): number {
  const chipGap = 3;
  let chipX = x;

  if (input.weekFilterActive) {
    const width = drawFilterChip(
      doc,
      chipX,
      y,
      formatTimeframeFilterLabel(input.timeframeStart, input.timeframeEnd),
      icons.calendar,
    );
    chipX += width + chipGap;
  }

  if (input.clientFilterActive) {
    drawFilterChip(
      doc,
      chipX,
      y,
      `Client is ${input.clientName}`,
      icons.building,
    );
  }

  return y + 8;
}

function drawSummaryBox(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  summary: ExportSummary,
) {
  const paddingX = 5;
  const sectionHeight = 18;
  const boxHeight = sectionHeight;
  const columnWidth = width / exportSummarySections.length;

  setDrawColor(doc, pdfTheme.border);
  doc.setLineWidth(0.25);
  doc.roundedRect(
    x,
    y,
    width,
    boxHeight,
    pdfTheme.radiusMm,
    pdfTheme.radiusMm,
    "S",
  );

  for (let i = 1; i < exportSummarySections.length; i++) {
    const dividerX = x + columnWidth * i;
    doc.line(dividerX, y, dividerX, y + boxHeight);
  }

  exportSummarySections.forEach(({ label, key }, index) => {
    const colX = x + columnWidth * index + paddingX;
    const labelY = y + 6;
    const valueY = y + 12;

    setPdfFont(doc, "regular");
    setTextColor(doc, pdfTheme.mutedForeground);
    doc.setFontSize(9);
    doc.text(label, colX, labelY);

    setPdfFont(doc, "medium");
    setTextColor(doc, pdfTheme.foreground);
    doc.setFontSize(11);
    doc.text(summary[key], colX, valueY);
  });

  return y + boxHeight;
}

export async function downloadSummaryReportPdf(
  input: SummaryReportInput,
): Promise<void> {
  const summary = getExportSummary(input);

  const doc = new jsPDF();
  await loadPdfFonts(doc);
  const icons = await loadPdfIcons();

  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;

  doc.setFillColor(...hexToRgb(pdfTheme.background));
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  let y = margin;

  setPdfFont(doc, "medium");
  setTextColor(doc, pdfTheme.foreground);
  doc.setFontSize(18);
  doc.text("Summary Report", margin, y);
  y += 10;

  drawHorizontalLine(doc, y, margin, pageWidth);
  y += 8;

  y = drawFilterChips(doc, margin, y, input, icons);
  y += 8;

  drawSummaryBox(doc, margin, y, contentWidth, summary);

  doc.save("toggl-track-summary-report.pdf");
}
