// src/components/orbit/OrbitContainer.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

type OrbitContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: "default" | "wide";
};

export function OrbitContainer({
  className,
  size = "default",
  ...props
}: OrbitContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4",
        size === "default" && "max-w-6xl",
        size === "wide" && "max-w-7xl",
        className
      )}
      {...props}
    />
  );
}
