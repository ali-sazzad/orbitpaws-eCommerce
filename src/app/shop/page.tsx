import type { Metadata } from "next";
import { OrbitPageHeader } from "@/components/orbit/OrbitPageHeader";
import { OrbitSection } from "@/components/orbit/OrbitSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse vet-approved pet essentials with filters, search, and sorting.",
};

export default function ShopPage() {
  return (
    <div className="space-y-10 pb-14 pt-6">
      <OrbitPageHeader
        title="Shop"
        subtitle="Vet-approved essentials with clear trust signals and real-world browsing UX."
        right={
          <div className="flex items-center gap-2">
            <Button variant="outline">Sort</Button>
            <Button variant="outline">Filters</Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar (desktop) */}
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

              <Button className="w-full" disabled>
                Apply (Sprint 2)
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Main content */}
        <main className="space-y-6">
          {/* Toolbar */}
          <Card className="rounded-2xl border-slate-200/70">
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <Skeleton className="h-10 w-full rounded-lg sm:max-w-md" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-24 rounded-lg" />
                <Skeleton className="h-10 w-24 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          {/* Grid */}
          <OrbitSection
            title="Results"
            description="Skeleton grid now. In Sprint 4 we render product cards here."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <Card key={i} className="overflow-hidden rounded-2xl border-slate-200/70">
                  <CardContent className="space-y-4 p-0">
                    <Skeleton className="h-40 w-full" />
                    <div className="space-y-3 p-5">
                      <Skeleton className="h-5 w-4/5" />
                      <Skeleton className="h-4 w-2/5" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-14 rounded-full" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-9 w-24 rounded-lg" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </OrbitSection>
        </main>
      </div>
    </div>
  );
}
