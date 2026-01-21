import Link from "next/link";

export function OrbitHeader() {
  return (
    <header className="sticky mb-4 top-0 z-50 -mx-4 border-b border-white/40 bg-white/55 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/45">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
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
            className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Shop
          </Link>
          <Link
            href="/cart"
            className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Cart
          </Link>
        </nav>
      </div>
    </header>
  );
}
