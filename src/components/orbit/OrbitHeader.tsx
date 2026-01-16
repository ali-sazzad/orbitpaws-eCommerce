// src/components/orbit/OrbitHeader.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
];

export function OrbitHeader() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between py-5">
      <Link href="/" className="flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2">
        <div className="grid size-10 place-items-center rounded-xl bg-slate-900 text-white">
          OP
        </div>
        <div>
          <p className="text-sm font-semibold leading-none">OrbitPaws</p>
          <p className="text-xs text-slate-600">Vet-approved essentials</p>
        </div>
      </Link>

      <nav className="flex items-center gap-1 text-sm">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
                active && "bg-slate-900 text-white hover:bg-slate-900"
              )}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}