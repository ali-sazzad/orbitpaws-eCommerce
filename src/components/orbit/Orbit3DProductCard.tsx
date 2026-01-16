"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Orbit3DProductCardProps = {
  title: string;
  price: number;
  image: string;
  rating: number;
  vetApproved?: boolean;
  stock: number;
  tags?: string[];
  href?: string;
  className?: string;
};

type CSSVars = React.CSSProperties & {
  [key: `--${string}`]: string | number;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mql.matches);
    update();
    mql.addEventListener?.("change", update);
    return () => mql.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

export function Orbit3DProductCard(props: Orbit3DProductCardProps) {
  const { title, price, image, rating, vetApproved, stock, tags, href, className } = props;

  const reducedMotion = usePrefersReducedMotion();
  const wrapRef = React.useRef<HTMLDivElement | null>(null);

  const [tilt, setTilt] = React.useState({ rx: 0, ry: 0, px: 50, py: 50 });

  const onMove = (e: React.PointerEvent) => {
    if (reducedMotion) return;
    const el = wrapRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    const px = (x / r.width) * 100;
    const py = (y / r.height) * 100;

    const ry = ((px - 50) / 50) * 8;
    const rx = -((py - 50) / 50) * 8;

    setTilt({ rx, ry, px, py });
  };

  const onLeave = () => setTilt({ rx: 0, ry: 0, px: 50, py: 50 });

  const outOfStock = stock <= 0;

  const tiltStyle: CSSVars | undefined = reducedMotion
    ? undefined
    : {
        transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        "--mx": `${tilt.px}%`,
        "--my": `${tilt.py}%`,
      };

  const CardInner = (
    <div
      ref={wrapRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("group relative rounded-2xl", href && "cursor-pointer", className)}
      style={{ perspective: reducedMotion ? undefined : "900px" }}
    >
      {/* glow layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-0.5 rounded-2xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(56,189,248,0.18), transparent 45%), radial-gradient(600px circle at 20% 0%, rgba(99,102,241,0.14), transparent 40%)",
        }}
      />

      <div
        className={cn(
          "relative rounded-2xl transition-transform duration-200 will-change-transform",
          reducedMotion ? "transform-none" : ""
        )}
        style={tiltStyle}
      >
        <Card className="overflow-hidden rounded-2xl border-slate-200/60 bg-white/70 backdrop-blur supports-backdrop-filter:bg-white/50">
          <CardHeader className="relative p-0">
            <div className="relative aspect-4/3 w-full">
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={cn(
                  "object-cover transition-transform duration-300",
                  reducedMotion ? "" : "group-hover:scale-[1.03]"
                )}
                priority={false}
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-black/0 to-black/0" />

              <div className="absolute left-3 top-3 flex gap-2">
                {vetApproved ? <Badge className="bg-slate-900 text-white">Vet-approved</Badge> : null}
                {outOfStock ? <Badge variant="destructive">Out of stock</Badge> : null}
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center justify-between gap-3 text-white">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{title}</p>
                    <p className="text-xs opacity-90">Safe ingredients • 30-day returns</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold">${price.toFixed(2)}</p>
                    <p className="text-xs opacity-90">★ {rating.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 p-4">
            <div className="flex flex-wrap gap-2">
              {(tags ?? []).slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>{outOfStock ? "Notify me when available" : "Fast delivery (Sydney metro)"}</span>
              <span className="text-xs text-slate-500">{outOfStock ? "0 left" : `${stock} in stock`}</span>
            </div>
          </CardContent>
        </Card>

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/40" />
      </div>
    </div>
  );

  if (!href) return CardInner;

  return (
    <Link
      href={href}
      className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`Open ${title}`}
    >
      {CardInner}
    </Link>
  );
}