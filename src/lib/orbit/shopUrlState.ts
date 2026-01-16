// src/lib/orbit/shopUrlState.ts
import type { FiltersState } from "@/components/orbit/shop/types";

export type SortKey = "popular" | "price-asc" | "price-desc" | "rating";
export type ViewMode = "grid" | "list";

export type ShopUrlState = {
  q?: string;
  sort?: SortKey;
  view?: ViewMode;
  // filters
  c?: string; // categories: "cat,dog"
  t?: string; // types: "food,toy,grooming"
  p?: string; // price: "min-max"
  r?: string; // rating: "4" or "4.5"
  v?: string; // vet-approved: "1"
};

function splitCSV(v: string | null) {
  if (!v) return [];
  return v
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function parseShopStateFromSearchParams(
  sp: URLSearchParams,
  opts: { priceMin: number; priceMax: number }
) {
  const q = sp.get("q") ?? "";
  const sort = (sp.get("sort") as SortKey) ?? undefined;
  const view = (sp.get("view") as ViewMode) ?? undefined;

  const categories = splitCSV(sp.get("c")) as FiltersState["categories"];
  const types = splitCSV(sp.get("t")) as FiltersState["types"];

  const priceRaw = sp.get("p");
  let price: FiltersState["price"] = [opts.priceMin, opts.priceMax];
  if (priceRaw && priceRaw.includes("-")) {
    const [a, b] = priceRaw.split("-");
    const min = Number(a);
    const max = Number(b);
    if (!Number.isNaN(min) && !Number.isNaN(max)) {
      price = [min, max];
    }
  }

  const ratingRaw = sp.get("r");
  const minRating =
    ratingRaw === null || ratingRaw === ""
      ? null
      : Number.isNaN(Number(ratingRaw))
        ? null
        : Number(ratingRaw);

  const vetApprovedOnly = sp.get("v") === "1";

  return {
    q,
    sort,
    view,
    filters: {
      categories,
      types,
      price,
      minRating,
      vetApprovedOnly,
    } satisfies FiltersState,
  };
}

export function buildShopSearchParams(input: {
  q: string;
  sort: SortKey;
  view: ViewMode;
  filters: FiltersState;
  defaults: { priceMin: number; priceMax: number };
}) {
  const sp = new URLSearchParams();

  // q
  const q = input.q.trim();
  if (q) sp.set("q", q);

  // sort + view (always keep, makes URL explicit)
  sp.set("sort", input.sort);
  sp.set("view", input.view);

  // categories
  if (input.filters.categories.length) sp.set("c", input.filters.categories.join(","));

  // types
  if (input.filters.types.length) sp.set("t", input.filters.types.join(","));

  // price only if not default bounds
  const [pMin, pMax] = input.filters.price;
  if (pMin !== input.defaults.priceMin || pMax !== input.defaults.priceMax) {
    sp.set("p", `${pMin}-${pMax}`);
  }

  // rating
  if (input.filters.minRating != null) sp.set("r", String(input.filters.minRating));

  // vet
  if (input.filters.vetApprovedOnly) sp.set("v", "1");

  return sp;
}
