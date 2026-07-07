import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AppSidebar } from "@/components/app-sidebar";
import { SmallScreenNotice } from "@/components/small-screen-notice";
import { TutorialFooter } from "@/components/tutorial-footer";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "Toggl - %s",
    default: "Toggl",
  },
  description: "Time tracking case study app",
  icons: {
    icon: {
      url: "https://focus.toggl.com/focus-v2-inactive.svg",
      type: "image/svg+xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-dvh overflow-hidden">
        <div className="flex h-full w-full md:hidden">
          <SmallScreenNotice />
        </div>
        <div className="hidden h-full flex-col md:flex">
          <TooltipProvider>
            <div className="flex min-h-0 flex-1">
              <AppSidebar />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
            <TutorialFooter />
          </TooltipProvider>
        </div>
      </body>
    </html>
  );
}
