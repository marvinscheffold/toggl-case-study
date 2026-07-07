import type { jsPDF } from "jspdf";

const FONT_REGULAR = "Geist-Regular.ttf";
const FONT_MEDIUM = "Geist-Medium.ttf";

let regularFontBase64: string | null = null;
let mediumFontBase64: string | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function getFontBase64(): Promise<{
  regular: string;
  medium: string;
}> {
  if (regularFontBase64 && mediumFontBase64) {
    return { regular: regularFontBase64, medium: mediumFontBase64 };
  }

  const [regularResponse, mediumResponse] = await Promise.all([
    fetch(`/fonts/${FONT_REGULAR}`),
    fetch(`/fonts/${FONT_MEDIUM}`),
  ]);

  if (!regularResponse.ok || !mediumResponse.ok) {
    throw new Error("Failed to load Geist fonts for PDF export");
  }

  regularFontBase64 = arrayBufferToBase64(await regularResponse.arrayBuffer());
  mediumFontBase64 = arrayBufferToBase64(await mediumResponse.arrayBuffer());

  return { regular: regularFontBase64, medium: mediumFontBase64 };
}

export async function loadPdfFonts(doc: jsPDF): Promise<void> {
  const { regular, medium } = await getFontBase64();

  doc.addFileToVFS(FONT_REGULAR, regular);
  doc.addFont(FONT_REGULAR, "Geist", "normal");
  doc.addFileToVFS(FONT_MEDIUM, medium);
  doc.addFont(FONT_MEDIUM, "GeistMedium", "normal");
  doc.setFont("Geist", "normal");
}

export function setPdfFont(
  doc: jsPDF,
  weight: "regular" | "medium",
): void {
  doc.setFont(weight === "medium" ? "GeistMedium" : "Geist", "normal");
}
