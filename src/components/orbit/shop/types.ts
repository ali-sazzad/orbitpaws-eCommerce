// src/components/orbit/shop/types.ts
import type { PetCategory, ProductType } from "@/data/products";

export type FiltersState = {
  categories: Array<Exclude<PetCategory, "both">>;
  types: ProductType[];
  price: [number, number];
  minRating: number | null;
  vetApprovedOnly: boolean;
};
