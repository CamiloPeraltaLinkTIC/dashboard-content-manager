import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "CNE Colombia — Tablero de Narrativa",
  description:
    "Tablero de gestion de contenidos y narrativa para el Consejo Nacional Electoral de Colombia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${dmSans.variable} ${dmSerif.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col h-screen overflow-hidden">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="flex flex-col overflow-hidden">
            <AppHeader />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
