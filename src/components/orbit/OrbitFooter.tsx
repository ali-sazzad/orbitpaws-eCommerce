// src/components/orbit/OrbitFooter.tsx
import { Separator } from "@/components/ui/separator";

export function OrbitFooter() {
  return (
    <footer className="py-8 text-sm text-slate-600">
      <Separator className="mb-6" />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} OrbitPaws. Built for a hiring-ready frontend portfolio.</p>
        <p className="text-xs">Safe ingredients • Fast delivery • 30-day returns</p>
      </div>
    </footer>
  );
}