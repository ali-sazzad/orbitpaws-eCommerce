"use client";

import * as React from "react";
import Link from "next/link";
import { useCart } from "@/lib/orbit/cart/cart-context";

export function OrbitHeader() {
  const { totalItems, hydrated } = useCart();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full",
        "backdrop-blur-xl",
        "bg-white/40 supports-[backdrop-filter]:bg-white/25",
        "border-b border-white/25",
        "transition-all duration-200",
        scrolled ? "shadow-sm" : "shadow-none",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="OrbitPaws home"
        >
          <div className="h-9 w-9 rounded-xl bg-linear-to-br from-indigo-600 via-sky-500 to-pink-500" />
          <div className="leading-tight">
            <p className="text-sm font-semibold">OrbitPaws</p>
            <p className="text-xs text-muted-foreground">Vet-approved essentials</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-white/35 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-white/35 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Shop
          </Link>

          <Link
            href="/cart"
            className="relative rounded-lg px-3 py-2 text-muted-foreground hover:bg-white/35 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Cart
            {/* ✅ avoid hydration mismatch: only show after hydration */}
            {hydrated && totalItems > 0 ? (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-semibold text-white">
                {totalItems}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
