import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Export",
};

export default function ExportLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
