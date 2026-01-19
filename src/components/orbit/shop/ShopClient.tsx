"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Product, PetCategory, ProductType } from "@/data/products";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { OrbitProductCard } from "@/components/orbit/OrbitProductCard";
import { OrbitPageHeader } from "@/components/orbit/OrbitPageHeader";
import { ShopResultsSkeleton } from "@/components/orbit/shop/ShopSkeletons";
import type { FiltersState } from "@/components/orbit/shop/types";
import {
  buildShopSearchParams,
  parseShopStateFromSearchParams,
  SortKey,
  ViewMode,
} from "@/lib/orbit/shopUrlState";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function toggleInArray<T>(arr: T[], value: T) {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

function formatMoney(n: number) {
  return `$${n.toFixed(0)}`;
}

function filtersEqual(a: FiltersState, b: FiltersState) {
  return (
    a.vetApprovedOnly === b.vetApprovedOnly &&
    a.minRating === b.minRating &&
    a.price[0] === b.price[0] &&
    a.price[1] === b.price[1] &&
    a.categories.length === b.categories.length &&
    a.types.length === b.types.length &&
    a.categories.every((x) => b.categories.includes(x)) &&
    a.types.every((x) => b.types.includes(x))
  );
}

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}

type Chip = { key: string; label: string; onRemove: () => void };

export function ShopClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Price bounds
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

  // ✅ SSR-safe localStorage states (prevents hydration mismatch)
  const [filters, setFilters, filtersHydrated] = useLocalStorageState<FiltersState>(
    "orbitpaws:filters",
    defaultFilters
  );

  const [viewMode, setViewMode, viewHydrated] = useLocalStorageState<ViewMode>(
    "orbitpaws:viewMode",
    "grid"
  );

  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("popular");

  // -------- URL -> State on first load (URL wins) --------
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

    const parsed = parseShopStateFromSearchParams(searchParams, {
      priceMin: bounds.min,
      priceMax: bounds.max,
    });

    setQuery(parsed.q ?? "");
    setSort(parsed.sort ?? "popular");
    setViewMode(parsed.view ?? "grid");

    const allowedCats: Array<Exclude<PetCategory, "both">> = ["cat", "dog"];
    const allowedTypes: ProductType[] = ["food", "toy", "grooming"];

    setFilters({
      categories: (parsed.filters.categories ?? []).filter((x) =>
        allowedCats.includes(x)
      ),
      types: (parsed.filters.types ?? []).filter((x) =>
        allowedTypes.includes(x)
      ),
      price: [
        clamp(parsed.filters.price[0], bounds.min, bounds.max),
        clamp(parsed.filters.price[1], bounds.min, bounds.max),
      ],
      minRating:
        parsed.filters.minRating === null ? null : parsed.filters.minRating,
      vetApprovedOnly: !!parsed.filters.vetApprovedOnly,
    });

    didHydrateFromUrl.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds.min, bounds.max, searchParams]);

  // keep saved filters valid if bounds change
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

  // -------- State -> URL (replace) --------
  React.useEffect(() => {
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

    const current = `${pathname}?${searchParams.toString()}`.replace(/\?$/, "");
    const normalizedNext = nextUrl.replace(/\?$/, "");
    if (normalizedNext === current) return;

    router.replace(nextUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, query, sort, viewMode, bounds.min, bounds.max, pathname]);

  // -------- Debounced search + loading simulation --------
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

  // -------- Filter count (applied filters only) --------
  const activeFilterCount =
    (filters.categories.length ? 1 : 0) +
    (filters.types.length ? 1 : 0) +
    (filters.vetApprovedOnly ? 1 : 0) +
    (filters.minRating !== null ? 1 : 0) +
    (filters.price[0] !== bounds.min || filters.price[1] !== bounds.max ? 1 : 0);

  const clearFilters = () => setFilters(defaultFilters);

  // -------- Chips (removable individually) --------
  const chips = React.useMemo<Chip[]>(() => {
    const list: Chip[] = [];

    if (query.trim()) {
      list.push({
        key: "q",
        label: `Search: “${query.trim()}”`,
        onRemove: () => setQuery(""),
      });
    }

    filters.categories.forEach((c) => {
      list.push({
        key: `c:${c}`,
        label: `Category: ${c}`,
        onRemove: () =>
          setFilters((prev) => ({
            ...prev,
            categories: prev.categories.filter((x) => x !== c),
          })),
      });
    });

    filters.types.forEach((t) => {
      list.push({
        key: `t:${t}`,
        label: `Type: ${t}`,
        onRemove: () =>
          setFilters((prev) => ({
            ...prev,
            types: prev.types.filter((x) => x !== t),
          })),
      });
    });

    if (filters.vetApprovedOnly) {
      list.push({
        key: "vet",
        label: "Vet-approved only",
        onRemove: () => setFilters((prev) => ({ ...prev, vetApprovedOnly: false })),
      });
    }

    if (filters.minRating != null) {
      list.push({
        key: "rating",
        label: `Rating: ${filters.minRating}+`,
        onRemove: () => setFilters((prev) => ({ ...prev, minRating: null })),
      });
    }

    if (filters.price[0] !== bounds.min || filters.price[1] !== bounds.max) {
      list.push({
        key: "price",
        label: `Price: ${formatMoney(filters.price[0])}–${formatMoney(filters.price[1])}`,
        onRemove: () => setFilters((prev) => ({ ...prev, price: [bounds.min, bounds.max] })),
      });
    }

    return list;
  }, [query, filters, bounds.min, bounds.max, setFilters]);

  // -------- Mobile Apply/Cancel state --------
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [draftFilters, setDraftFilters] = React.useState<FiltersState>(filters);

  React.useEffect(() => {
    if (sheetOpen) setDraftFilters(filters);
  }, [sheetOpen, filters]);

  const draftIsDirty = !filtersEqual(draftFilters, filters);

  // -------- Results (applied filters) --------
  const results = React.useMemo(() => {
    let list = products;

    if (filters.categories.length) {
      list = list.filter((p) => {
        if (p.category === "both") return true;
        return filters.categories.includes(p.category);
      });
    }

    if (filters.types.length) {
      list = list.filter((p) => filters.types.includes(p.type));
    }

    list = list.filter((p) => p.price >= filters.price[0] && p.price <= filters.price[1]);

    if (filters.minRating != null) {
      const min = filters.minRating;
      list = list.filter((p) => p.rating >= min);
    }

    if (filters.vetApprovedOnly) {
      list = list.filter((p) => p.vetApproved);
    }

    if (normalizedQuery) {
      list = list.filter((p) => {
        const haystack = `${p.name} ${p.tags.join(" ")}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      });
    }

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

  function PriceControls({
    value,
    onChange,
  }: {
    value: [number, number];
    onChange: (next: [number, number]) => void;
  }) {
    const [minV, maxV] = value;

    const setMin = (raw: string) => {
      const n = Number(raw);
      if (Number.isNaN(n)) return;
      const nextMin = clamp(n, bounds.min, maxV);
      onChange([nextMin, maxV]);
    };

    const setMax = (raw: string) => {
      const n = Number(raw);
      if (Number.isNaN(n)) return;
      const nextMax = clamp(n, minV, bounds.max);
      onChange([minV, nextMax]);
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-700">Price range</p>
          <p className="text-xs text-slate-600">
            {formatMoney(minV)} – {formatMoney(maxV)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Min</p>
            <Input
              type="number"
              inputMode="numeric"
              min={bounds.min}
              max={bounds.max}
              value={minV}
              onChange={(e) => setMin(e.target.value)}
              className="h-10"
              aria-label="Minimum price"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Max</p>
            <Input
              type="number"
              inputMode="numeric"
              min={bounds.min}
              max={bounds.max}
              value={maxV}
              onChange={(e) => setMax(e.target.value)}
              className="h-10"
              aria-label="Maximum price"
            />
          </div>
        </div>

        <Slider
          value={[minV, maxV]}
          min={bounds.min}
          max={bounds.max}
          step={1}
          onValueChange={(v) => onChange([v[0], v[1]])}
          aria-label="Price range slider"
        />
      </div>
    );
  }

  function FiltersPanel({
    state,
    setState,
  }: {
    state: FiltersState;
    setState: React.Dispatch<React.SetStateAction<FiltersState>>;
  }) {
    const clearThis = () => setState(defaultFilters);

    return (
      <Card className="rounded-2xl border-slate-200/70">
        <CardContent className="space-y-6 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">Filters</p>

                {/* ✅ Only show badges after hydration to prevent SSR mismatch */}
                {filtersHydrated && activeFilterCount > 0 ? (
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
              onClick={clearThis}
              disabled={filtersEqual(state, defaultFilters)}
            >
              Clear
            </Button>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">Category</p>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={state.categories.includes("cat")}
                onCheckedChange={() =>
                  setState((prev) => ({
                    ...prev,
                    categories: toggleInArray(prev.categories, "cat"),
                  }))
                }
              />
              Cat
            </label>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={state.categories.includes("dog")}
                onCheckedChange={() =>
                  setState((prev) => ({
                    ...prev,
                    categories: toggleInArray(prev.categories, "dog"),
                  }))
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
                  checked={state.types.includes(t)}
                  onCheckedChange={() =>
                    setState((prev) => ({
                      ...prev,
                      types: toggleInArray(prev.types, t),
                    }))
                  }
                />
                {t}
              </label>
            ))}
          </div>

          {/* Price */}
          <PriceControls
            value={state.price}
            onChange={(next) => setState((prev) => ({ ...prev, price: next }))}
          />

          {/* Rating */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">Minimum rating</p>
            <Select
              value={state.minRating === null ? "any" : String(state.minRating)}
              onValueChange={(v) =>
                setState((prev) => ({
                  ...prev,
                  minRating: v === "any" ? null : Number(v),
                }))
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

          {/* Vet */}
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-700">Vet-approved only</p>
              <p className="text-xs text-slate-500">Hide non-approved items.</p>
            </div>
            <Switch
              checked={state.vetApprovedOnly}
              onCheckedChange={(checked) =>
                setState((prev) => ({ ...prev, vetApprovedOnly: checked }))
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
            {/* Mobile: Apply/Cancel sheet */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  Filters
                  {/* ✅ Only show after hydration */}
                  {filtersHydrated && activeFilterCount > 0 ? (
                    <Badge className="ml-2 bg-slate-900 text-white">{activeFilterCount}</Badge>
                  ) : null}
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>

                <div className="mt-6">
                  <FiltersPanel state={draftFilters} setState={setDraftFilters} />
                </div>

                <SheetFooter className="mt-6 flex-row gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setDraftFilters(filters);
                      setSheetOpen(false);
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="w-full"
                    disabled={!draftIsDirty}
                    onClick={() => {
                      setFilters(draftFilters);
                      setSheetOpen(false);
                    }}
                  >
                    Apply
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* View mode toggle (render only after hydration to avoid mismatch) */}
            {viewHydrated ? (
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
            ) : (
              <div className="h-10 w-30 rounded-lg border border-slate-200 bg-white" />
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <FiltersPanel state={filters} setState={setFilters} />
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

          {/* Chips */}
          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
                >
                  {chip.label}
                  <button
                    type="button"
                    onClick={chip.onRemove}
                    className="ml-1 inline-grid size-5 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    aria-label={`Remove ${chip.label}`}
                    title="Remove"
                  >
                    ×
                  </button>
                </span>
              ))}

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

          {/* Results header */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Results</h2>
              <p className="text-sm text-slate-600">
                {results.length} item{results.length === 1 ? "" : "s"} found.
              </p>
            </div>
          </div>

          {/* Results */}
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
