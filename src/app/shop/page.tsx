import type { Metadata } from "next";
import { products } from "@/data/products";
import { ShopClient } from "@/components/orbit/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse vet-approved pet essentials with filters, search, sorting, and a premium UI.",
};

export default function ShopPage() {
  return <ShopClient products={products} />;
}
