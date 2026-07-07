import type { ExportSummary } from "@/lib/export-summary-pdf";
import { exportSummarySections } from "@/lib/export-summary-pdf";

type ExportSummaryBoxProps = {
  summary: ExportSummary;
};

export function ExportSummaryBox({ summary }: ExportSummaryBoxProps) {
  return (
    <div className="w-full rounded-lg border border-border">
      <div className="grid grid-cols-4 divide-x divide-border  border-border ">
        {exportSummarySections.map(({ label, key }) => (
          <div key={key} className="px-4 py-3">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-base font-medium">
              {summary[key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
