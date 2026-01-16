// src/components/orbit/shop/ShopClient.tsx
"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Product, PetCategory, ProductType } from "@/data/products";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { OrbitProductCard } from "@/components/orbit/OrbitProductCard";
import { OrbitPageHeader } from "@/components/orbit/OrbitPageHeader";
import { ShopResultsSkeleton } from "@/components/orbit/shop/ShopSkeletons";
import type { FiltersState } from "@/components/orbit/shop/types";
import { buildShopSearchParams, parseShopStateFromSearchParams, SortKey, ViewMode } from "@/lib/orbit/shopUrlState";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function toggleInArray<T>(arr: T[], value: T) {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

function formatMoney(n: number) {
  return `$${n.toFixed(0)}`;
}

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}

export function ShopClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // derive global price bounds
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

  // localStorage (still useful if user comes without URL)
  const [filters, setFilters] = useLocalStorageState<FiltersState>("orbitpaws:filters", defaultFilters);
  const [viewMode, setViewMode] = useLocalStorageState<ViewMode>("orbitpaws:viewMode", "grid");

  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("popular");

  // --- URL -> State on first load (URL wins) ---
  const didHydrateFromUrl = React.useRef(false);

  React.useEffect(() => {
    if (didHydrateFromUrl.current) return;

    const hasAnyUrlState =
      searchParams.has("q") ||
      searchParams.has("sort") ||
      searchParams.has("view") ||
      searchParams.has("c") ||
      searchParams.has("t") ||
      searchParams.has("p") ||
      searchParams.has("r") ||
      searchParams.has("v");

    if (!hasAnyUrlState) {
      didHydrateFromUrl.current = true;
      return;
    }

    const parsed = parseShopStateFromSearchParams(searchParams, { priceMin: bounds.min, priceMax: bounds.max });

    setQuery(parsed.q ?? "");
    setSort(parsed.sort ?? "popular");
    setViewMode(parsed.view ?? "grid");

    // sanitize categories/types to allowed values
    const allowedCats: Array<Exclude<PetCategory, "both">> = ["cat", "dog"];
    const allowedTypes: ProductType[] = ["food", "toy", "grooming"];

    setFilters({
      categories: (parsed.filters.categories ?? []).filter((x) => allowedCats.includes(x)),
      types: (parsed.filters.types ?? []).filter((x) => allowedTypes.includes(x)),
      price: [
        clamp(parsed.filters.price[0], bounds.min, bounds.max),
        clamp(parsed.filters.price[1], bounds.min, bounds.max),
      ],
      minRating: parsed.filters.minRating === null ? null : parsed.filters.minRating,
      vetApprovedOnly: !!parsed.filters.vetApprovedOnly,
    });

    didHydrateFromUrl.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds.min, bounds.max, searchParams]);

  // keep saved filters valid if bounds change
  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      price: [clamp(prev.price[0], bounds.min, bounds.max), clamp(prev.price[1], bounds.min, bounds.max)],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds.min, bounds.max]);

  // --- State -> URL (replace; no history spam) ---
  const didWriteUrlOnce = React.useRef(false);

  React.useEffect(() => {
    // don’t write until hydration decision is done
    if (!didHydrateFromUrl.current) return;

    const sp = buildShopSearchParams({
      q: query,
      sort,
      view: viewMode,
      filters,
      defaults: { priceMin: bounds.min, priceMax: bounds.max },
    });

    const qs = sp.toString();
    const nextUrl = qs ? `${pathname}?${qs}` : pathname;

    // Avoid constant replace if identical
    const current = `${pathname}?${searchParams.toString()}`.replace(/\?$/, "");
    const normalizedNext = nextUrl.replace(/\?$/, "");

    if (normalizedNext === current) return;

    // First write should be replace too (clean)
    router.replace(nextUrl);
    didWriteUrlOnce.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, query, sort, viewMode, bounds.min, bounds.max, pathname]);

  // --- Debounced search + loading simulation ---
  const debouncedQuery = useDebouncedValue(query, 250);
  const normalizedQuery = debouncedQuery.trim().toLowerCase();

  const [isLoading, setIsLoading] = React.useState(false);
  const first = React.useRef(true);

  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setIsLoading(true);
    const id = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(id);
  }, [filters, sort, normalizedQuery, viewMode]);

  const activeFilterCount =
    (filters.categories.length ? 1 : 0) +
    (filters.types.length ? 1 : 0) +
    (filters.vetApprovedOnly ? 1 : 0) +
    (filters.minRating !== null ? 1 : 0) +
    (filters.price[0] !== bounds.min || filters.price[1] !== bounds.max ? 1 : 0);

  const clearFilters = () => setFilters(defaultFilters);

  const results = React.useMemo(() => {
    let list = products;

    // category: cat/dog selected; product can be cat/dog/both
    if (filters.categories.length) {
      list = list.filter((p) => {
        if (p.category === "both") return true;
        return filters.categories.includes(p.category);
      });
    }

    // type
    if (filters.types.length) {
      list = list.filter((p) => filters.types.includes(p.type));
    }

    // price range
    list = list.filter((p) => p.price >= filters.price[0] && p.price <= filters.price[1]);

    // min rating (safe null handling)
    if (filters.minRating != null) {
      const min = filters.minRating;
      list = list.filter((p) => p.rating >= min);
    }

    // vet
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
    viewMode === "grid" ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3" : "grid gap-4";

  function FiltersPanel({ compact }: { compact?: boolean }) {
    return (
      <Card className="rounded-2xl border-slate-200/70">
        <CardContent className="space-y-6 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">Filters</p>
                {activeFilterCount > 0 ? (
                  <Badge className="bg-slate-900 text-white">{activeFilterCount}</Badge>
                ) : null}
              </div>
              <p className="text-xs text-slate-600">
                Category, type, price, rating, vet-approved.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              disabled={activeFilterCount === 0}
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
              Products marked “both” match cat or dog.
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

            {!compact ? (
              <p className="text-xs text-slate-500">Narrow ranges when comparing similar products.</p>
            ) : null}
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
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, vetApprovedOnly: checked }))
              }
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
        subtitle="Filters + sorting + shareable URLs — built like a real storefront."
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
              onValueChange={(v) => v && setViewMode(v as ViewMode)}
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
        <aside className="hidden lg:block">
          <FiltersPanel />
        </aside>

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
                  <SelectTrigger className="h-10 w-[190px]">
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

          {/* Active chips */}
          {(activeFilterCount > 0 || query.trim()) && (
            <div className="flex flex-wrap items-center gap-2">
              {query.trim() ? <Badge variant="secondary">Search: “{query.trim()}”</Badge> : null}
              {filters.categories.length ? <Badge variant="secondary">Category: {filters.categories.join(", ")}</Badge> : null}
              {filters.types.length ? <Badge variant="secondary">Type: {filters.types.join(", ")}</Badge> : null}
              {filters.vetApprovedOnly ? <Badge className="bg-slate-900 text-white">Vet-approved only</Badge> : null}
              {filters.minRating !== null ? <Badge variant="secondary">Rating: {filters.minRating}+</Badge> : null}
              {filters.price[0] !== bounds.min || filters.price[1] !== bounds.max ? (
                <Badge variant="secondary">Price: {formatMoney(filters.price[0])}–{formatMoney(filters.price[1])}</Badge>
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

          {isLoading ? (
            <ShopResultsSkeleton layout={viewMode} count={9} />
          ) : results.length === 0 ? (
            <Card className="rounded-2xl border-slate-200/70">
              <CardContent className="space-y-2 p-8 text-center">
                <p className="text-sm font-semibold">No results</p>
                <p className="text-sm text-slate-600">
                  Try widening filters or searching for “vet”, “omega”, or “shampoo”.
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuery("");
                      clearFilters();
                    }}
                  >
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
