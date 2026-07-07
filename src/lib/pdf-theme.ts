export const pdfTheme = {
  background: "#fcfbfd",
  foreground: "#1e1e28",
  muted: "#f4f2f7",
  mutedForeground: "#7a7a85",
  border: "#e9e6ef",
  radiusMm: 2.5,
} as const;

export function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}
