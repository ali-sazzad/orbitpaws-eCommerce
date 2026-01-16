import type { Metadata } from "next";
import { products } from "@/data/products";
import { OrbitPageHeader } from "@/components/orbit/OrbitPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShopClient } from "@/components/orbit/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse vet-approved pet essentials with search, sorting, and a premium UI.",
};

export default function ShopPage() {
  return (
    <div className="space-y-10 pb-14 pt-6">
      <OrbitPageHeader
        title="Shop"
        subtitle="Vet-approved essentials with clear trust signals and real-world browsing UX."
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar placeholder (Filters come Sprint 2) */}
        <aside className="hidden lg:block">
          <Card className="rounded-2xl border-slate-200/70">
            <CardContent className="space-y-6 p-5">
              <div className="space-y-2">
                <p className="text-sm font-semibold">Filters</p>
                <p className="text-xs text-slate-600">
                  Category, type, price, rating, vet-approved.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-700">Category</p>
                  <Skeleton className="h-9 w-full rounded-lg" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-700">Product Type</p>
                  <Skeleton className="h-9 w-full rounded-lg" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-700">Price Range</p>
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-700">Rating</p>
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-700">Vet-approved</p>
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main */}
        <main>
          <ShopClient products={products} />
        </main>
      </div>
    </div>
  );
}
