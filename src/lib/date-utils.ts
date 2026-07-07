const reportDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function getCurrentWeek(): Date[] {
  const today = new Date();
  // Monday-based offset: Sunday (0) belongs to the previous week
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });
}

export function getCurrentWeekRange(): {
  start: Date;
  end: Date;
  days: number;
} {
  const weekStart = getCurrentWeek()[0];
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  return { start: weekStart, end: weekEnd, days: 7 };
}

export function formatReportDate(date: Date): string {
  return reportDateFormatter.format(date);
}

export function formatFilterDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function formatTimeframeFilterLabel(
  start: Date,
  endExclusive: Date,
): string {
  const end = new Date(endExclusive.getTime() - 1);
  return `${formatFilterDate(start)} - ${formatFilterDate(end)}`;
}

export function getISOWeekNumber(date: Date = new Date()): number {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayNum = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - dayNum);
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

export function getCurrentWeekNumber(): number {
  return getISOWeekNumber(getCurrentWeek()[0]);
}
