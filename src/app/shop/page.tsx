import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse vet-approved pet essentials with filters, search, and sorting.",
};

export default function ShopPage() {
  return (
    <div className="py-10 space-y-2">
      <h1 className="text-2xl font-semibold">Shop</h1>
      <p className="text-slate-600">Next sprint: filters, sort, search, skeleton states.</p>
    </div>
  );
}
