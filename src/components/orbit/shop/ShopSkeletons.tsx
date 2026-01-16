// src/components/orbit/shop/ShopSkeletons.tsx
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function OrbitProductCardSkeleton({ layout = "grid" }: { layout?: "grid" | "list" }) {
  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200/70 bg-white">
      <CardContent className={cn("p-0", layout === "list" && "sm:flex")}>
        <div
          className={cn(
            "relative",
            layout === "grid" && "h-40 w-full",
            layout === "list" && "h-40 w-full sm:h-auto sm:w-64 sm:shrink-0"
          )}
        >
          <Skeleton className="h-full w-full" />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="space-y-2">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>

          <div className="mt-auto flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-16 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ShopResultsSkeleton({
  layout = "grid",
  count = 9,
}: {
  layout?: "grid" | "list";
  count?: number;
}) {
  const gridClass =
    layout === "grid"
      ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      : "grid gap-4";

  return (
    <div className={gridClass} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <OrbitProductCardSkeleton key={i} layout={layout} />
      ))}
    </div>
  );
}
