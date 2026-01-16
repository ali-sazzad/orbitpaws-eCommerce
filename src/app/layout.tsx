// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
      <body className={`${inter.className} min-h-full bg-linear-to-b from-slate-50 to-white text-slate-900`}>
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4">
          <header className="flex items-center justify-between py-5">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-slate-900 text-white">
                OP
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">OrbitPaws</p>
                <p className="text-xs text-slate-600">Vet-approved essentials</p>
              </div>
            </div>

            <nav className="flex items-center gap-2 text-sm">
              <a className="rounded-lg px-3 py-2 hover:bg-slate-100" href="#">
                Home
              </a>
              <a className="rounded-lg px-3 py-2 hover:bg-slate-100" href="#">
                Shop
              </a>
              <a className="rounded-lg px-3 py-2 hover:bg-slate-100" href="#">
                Cart
              </a>
            </nav>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-slate-200 py-8 text-sm text-slate-600">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} OrbitPaws. Built for a hiring-ready frontend portfolio.</p>
              <p className="text-xs">Safe ingredients • Fast delivery • 30-day returns</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
