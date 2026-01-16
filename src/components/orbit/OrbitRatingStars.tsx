// src/components/orbit/OrbitRatingStars.tsx
import { cn } from "@/lib/utils";

export function OrbitRatingStars({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars = Array.from({ length: 5 }).map((_, i) => {
    const isFull = i < full;
    const isHalf = i === full && half;

    return (
      <span
        key={i}
        aria-hidden="true"
        className={cn(
          "text-slate-300",
          isFull && "text-slate-900",
          isHalf && "text-slate-600"
        )}
        title={`${rating.toFixed(1)} out of 5`}
      >
        ★
      </span>
    );
  });

  return (
    <div className={cn("flex items-center gap-1 text-xs", className)}>
      <span className="sr-only">{rating.toFixed(1)} out of 5</span>
      {stars}
      <span className="ml-1 text-slate-600">{rating.toFixed(1)}</span>
    </div>
  );
}
