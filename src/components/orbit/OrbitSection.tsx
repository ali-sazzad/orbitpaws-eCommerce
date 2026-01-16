// src/components/orbit/OrbitSection.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

type OrbitSectionProps = React.HTMLAttributes<HTMLElement> & {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
};

export function OrbitSection({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: OrbitSectionProps) {
  return (
    <section className={cn("space-y-4", className)} {...props}>
      {(title || description || actions) && (
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && <p className="text-sm text-slate-600">{description}</p>}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}
