// src/components/orbit/OrbitPageHeader.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

type OrbitPageHeaderProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
};

export function OrbitPageHeader({ title, subtitle, right, className }: OrbitPageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}
