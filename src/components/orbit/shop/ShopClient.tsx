// src/components/orbit/shop/ShopClient.tsx
"use client";

import * as React from "react";
import { Product } from "@/data/products";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { OrbitProductCard } from "@/components/orbit/OrbitProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type SortKey = "popular" | "price-asc" | "price-desc" | "rating";

export function ShopClient({ products }: { products: Product[] }) {
  const [viewMode, setViewMode] = useLocalStorageState<"grid" | "list">(
    "orbitpaws:viewMode",
    "grid"
  );

  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("popular");

  const normalizedQuery = query.trim().toLowerCase();

  const results = React.useMemo(() => {
    let list = products;

    // Search (name + tags)
    if (normalizedQuery) {
      list = list.filter((p) => {
        const haystack = `${p.name} ${p.tags.join(" ")}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      });
    }

    // Sort
    list = list.slice().sort((a, b) => {
      if (sort === "popular") return b.popularity - a.popularity;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return 0;
    });

    return list;
  }, [products, normalizedQuery, sort]);

  const gridClass =
    viewMode === "grid"
      ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      : "grid gap-4";

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card className="rounded-2xl border-slate-200/70">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products (e.g. salmon, shampoo, omega)…"
              className="h-10 sm:max-w-md"
              aria-label="Search products"
            />
            {query ? (
              <Button variant="outline" className="h-10" onClick={() => setQuery("")}>
                Clear
              </Button>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="h-10 w-full sm:w-45">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most popular</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
              </SelectContent>
            </Select>

            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(v) => v && setViewMode(v as "grid" | "list")}
              className="justify-start"
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
        </CardContent>
      </Card>

      {/* Results header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Results</h2>
          <p className="text-sm text-slate-600">
            {results.length} item{results.length === 1 ? "" : "s"} found
            {normalizedQuery ? ` for “${query.trim()}”` : ""}.
          </p>
        </div>

        {/* Filters button is coming Sprint 2 */}
        <Button variant="outline" disabled title="Filters come in Sprint 2">
          Filters (Sprint 2)
        </Button>
      </div>

      {/* Empty state */}
      {results.length === 0 ? (
        <Card className="rounded-2xl border-slate-200/70">
          <CardContent className="space-y-2 p-8 text-center">
            <p className="text-sm font-semibold">No results found</p>
            <p className="text-sm text-slate-600">
              Try a different keyword like <span className="font-medium">“vet”</span>,{" "}
              <span className="font-medium">“omega”</span>, or{" "}
              <span className="font-medium">“shampoo”</span>.
            </p>
            <div className="pt-2">
              <Button variant="outline" onClick={() => setQuery("")}>
                Reset search
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
    </div>
  );
}
