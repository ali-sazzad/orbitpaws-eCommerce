// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { OrbitHeader } from "@/components/orbit/OrbitHeader";
import { OrbitFooter } from "@/components/orbit/OrbitFooter";
import { BackToTop } from "@/components/orbit/BackToTop";
import { OrbitProviders } from "@/components/orbit/OrbitProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://orbitpaws.vercel.app"),
  title: {
    default: "OrbitPaws — Vet-approved pet products",
    template: "%s • OrbitPaws",
  },
  description:
    "Premium, vet-approved pet essentials. Safe ingredients, fast delivery, and 30-day returns.",
  openGraph: {
    title: "OrbitPaws — Vet-approved pet products",
    description:
      "Premium, vet-approved pet essentials. Safe ingredients, fast delivery, and 30-day returns.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full orbit-app-bg`}>
        <OrbitProviders>
          {/* ✅ truly full-width header */}
          <OrbitHeader />

          {/* page content stays constrained */}
          <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4">
            <main className="flex-1 pt-6">{children}</main>
            <OrbitFooter />
          </div>

          <BackToTop />
        </OrbitProviders>
      </body>
    </html>
  );
}
