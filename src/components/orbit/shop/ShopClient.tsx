// src/components/orbit/shop/ShopClient.tsx
"use client";

import * as React from "react";
import { Product, PetCategory, ProductType } from "@/data/products";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { OrbitProductCard } from "@/components/orbit/OrbitProductCard";
import { OrbitPageHeader } from "@/components/orbit/OrbitPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortKey = "popular" | "price-asc" | "price-desc" | "rating";

type FiltersState = {
  categories: Array<Exclude<PetCategory, "both">>; // user selects cat/dog
  types: ProductType[];
  price: [number, number]; // min..max
  minRating: number | null; // null = any
  vetApprovedOnly: boolean;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function toggleInArray<T>(arr: T[], value: T) {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

function formatMoney(n: number) {
  return `$${n.toFixed(0)}`;
}

export function ShopClient({ products }: { products: Product[] }) {
  // derive global price bounds (from product base price)
  const bounds = React.useMemo(() => {
    const prices = products.map((p) => p.price);
    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));
    return { min, max };
  }, [products]);

  const defaultFilters: FiltersState = React.useMemo(
    () => ({
      categories: [],
      types: [],
      price: [bounds.min, bounds.max],
      minRating: null,
      vetApprovedOnly: false,
    }),
    [bounds.min, bounds.max]
  );

  // Persist filters
  const [filters, setFilters] = useLocalStorageState<FiltersState>(
    "orbitpaws:filters",
    defaultFilters
  );

  // If product bounds change (rare), keep saved filters valid
  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      price: [
        clamp(prev.price[0], bounds.min, bounds.max),
        clamp(prev.price[1], bounds.min, bounds.max),
      ],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds.min, bounds.max]);

  // Persist view mode
  const [viewMode, setViewMode] = useLocalStorageState<"grid" | "list">(
    "orbitpaws:viewMode",
    "grid"
  );

  // Search + sort (not persisted)
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("popular");

  const normalizedQuery = query.trim().toLowerCase();

  const activeFilterCount =
    (filters.categories.length ? 1 : 0) +
    (filters.types.length ? 1 : 0) +
    (filters.vetApprovedOnly ? 1 : 0) +
    (filters.minRating !== null ? 1 : 0) +
    // price active only if user changed from default range
    (filters.price[0] !== bounds.min || filters.price[1] !== bounds.max ? 1 : 0);

  const clearFilters = () => setFilters(defaultFilters);

  const results = React.useMemo(() => {
    let list = products;

    // FILTERS
    // category: user selects cat/dog, product can be cat/dog/both
    if (filters.categories.length) {
      list = list.filter((p) => {
        if (p.category === "both") return true; // both matches any selected
        return filters.categories.includes(p.category);
      });
    }

    // type
    if (filters.types.length) {
      list = list.filter((p) => filters.types.includes(p.type));
    }

    // min rating
if (filters.minRating != null) {
  const min = filters.minRating; // now TS knows it's a number
  list = list.filter((p) => p.rating >= min);
}


    // vet-approved
    if (filters.vetApprovedOnly) {
      list = list.filter((p) => p.vetApproved);
    }

    // SEARCH (name + tags)
    if (normalizedQuery) {
      list = list.filter((p) => {
        const haystack = `${p.name} ${p.tags.join(" ")}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      });
    }

    // SORT
    list = list.slice().sort((a, b) => {
      if (sort === "popular") return b.popularity - a.popularity;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return 0;
    });

    return list;
  }, [products, filters, normalizedQuery, sort]);

  const gridClass =
    viewMode === "grid"
      ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      : "grid gap-4";

  function FiltersPanel({ compact }: { compact?: boolean }) {
    return (
      <Card className="rounded-2xl border-slate-200/70">
        <CardContent className="space-y-6 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold">Filters</p>
              <p className="text-xs text-slate-600">
                Vet-approved essentials with clean, realistic controls.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              disabled={activeFilterCount === 0}
              aria-disabled={activeFilterCount === 0}
            >
              Clear
            </Button>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">Category</p>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={filters.categories.includes("cat")}
                onCheckedChange={() =>
                  setFilters((prev) => ({ ...prev, categories: toggleInArray(prev.categories, "cat") }))
                }
              />
              Cat
            </label>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={filters.categories.includes("dog")}
                onCheckedChange={() =>
                  setFilters((prev) => ({ ...prev, categories: toggleInArray(prev.categories, "dog") }))
                }
              />
              Dog
            </label>

            <p className="text-xs text-slate-500">
              Note: products marked “both” will still appear for cat or dog.
            </p>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">Product type</p>

            {(["food", "toy", "grooming"] as ProductType[]).map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm capitalize">
                <Checkbox
                  checked={filters.types.includes(t)}
                  onCheckedChange={() =>
                    setFilters((prev) => ({ ...prev, types: toggleInArray(prev.types, t) }))
                  }
                />
                {t}
              </label>
            ))}
          </div>

          {/* Price */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-700">Price range</p>
              <p className="text-xs text-slate-600">
                {formatMoney(filters.price[0])} – {formatMoney(filters.price[1])}
              </p>
            </div>

            <Slider
              value={[filters.price[0], filters.price[1]]}
              min={bounds.min}
              max={bounds.max}
              step={1}
              onValueChange={(v) => setFilters((prev) => ({ ...prev, price: [v[0], v[1]] }))}
              aria-label="Price range"
            />

            {!compact && (
              <p className="text-xs text-slate-500">
                Keep ranges wide for better discovery; narrow down when comparing.
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">Minimum rating</p>
            <Select
              value={filters.minRating === null ? "any" : String(filters.minRating)}
              onValueChange={(v) =>
                setFilters((prev) => ({ ...prev, minRating: v === "any" ? null : Number(v) }))
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Any rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="3.5">3.5+</SelectItem>
                <SelectItem value="4">4.0+</SelectItem>
                <SelectItem value="4.5">4.5+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vet-approved */}
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-700">Vet-approved only</p>
              <p className="text-xs text-slate-500">Hide non-approved items.</p>
            </div>
            <Switch
              checked={filters.vetApprovedOnly}
              onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, vetApprovedOnly: checked }))}
              aria-label="Vet-approved only"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-10 pb-14 pt-6">
      <OrbitPageHeader
        title="Shop"
        subtitle="Browse vet-approved pet essentials with filters, sorting, and clean microcopy."
        right={
          <div className="flex items-center gap-2">
            {/* Mobile filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  Filters
                  {activeFilterCount > 0 ? (
                    <Badge className="ml-2 bg-slate-900 text-white">{activeFilterCount}</Badge>
                  ) : null}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersPanel compact />
                </div>
              </SheetContent>
            </Sheet>

            {/* View mode */}
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(v) => v && setViewMode(v as "grid" | "list")}
              aria-label="View mode"
            >
              <ToggleGroupItem value="grid" aria-label="Grid view">
                Grid
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                List
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <FiltersPanel />
        </aside>

        {/* Main content */}
        <main className="space-y-6">
          {/* Toolbar */}
          <Card className="rounded-2xl border-slate-200/70">
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products (salmon, shampoo, omega)…"
                  className="h-10 sm:max-w-md"
                  aria-label="Search products"
                />
                {query ? (
                  <Button variant="outline" className="h-10" onClick={() => setQuery("")}>
                    Clear
                  </Button>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                  <SelectTrigger className="h-10 w-47.5">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most popular</SelectItem>
                    <SelectItem value="rating">Top rated</SelectItem>
                    <SelectItem value="price-asc">Price: low to high</SelectItem>
                    <SelectItem value="price-desc">Price: high to low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Active filter chips */}
          {(activeFilterCount > 0 || query.trim()) && (
            <div className="flex flex-wrap items-center gap-2">
              {query.trim() ? (
                <Badge variant="secondary">Search: “{query.trim()}”</Badge>
              ) : null}

              {filters.categories.length ? (
                <Badge variant="secondary">Category: {filters.categories.join(", ")}</Badge>
              ) : null}

              {filters.types.length ? (
                <Badge variant="secondary">Type: {filters.types.join(", ")}</Badge>
              ) : null}

              {filters.vetApprovedOnly ? (
                <Badge className="bg-slate-900 text-white">Vet-approved only</Badge>
              ) : null}

              {filters.minRating !== null ? (
                <Badge variant="secondary">Rating: {filters.minRating}+</Badge>
              ) : null}

              {filters.price[0] !== bounds.min || filters.price[1] !== bounds.max ? (
                <Badge variant="secondary">
                  Price: {formatMoney(filters.price[0])}–{formatMoney(filters.price[1])}
                </Badge>
              ) : null}

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery("");
                  clearFilters();
                }}
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Results */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Results</h2>
              <p className="text-sm text-slate-600">
                {results.length} item{results.length === 1 ? "" : "s"} found.
              </p>
            </div>
          </div>

          {/* Empty state */}
          {results.length === 0 ? (
            <Card className="rounded-2xl border-slate-200/70">
              <CardContent className="space-y-2 p-8 text-center">
                <p className="text-sm font-semibold">No results</p>
                <p className="text-sm text-slate-600">
                  Try widening your filters or searching for “vet”, “omega”, or “shampoo”.
                </p>
                <div className="pt-2">
                  <Button variant="outline" onClick={() => { setQuery(""); clearFilters(); }}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className={gridClass}>
              {results.map((p) => (
                <OrbitProductCard key={p.id} product={p} layout={viewMode} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
