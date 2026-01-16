import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review items, update quantities, and proceed to checkout.",
};

export default function CartPage() {
  return (
    <div className="py-10 space-y-2">
      <h1 className="text-2xl font-semibold">Cart</h1>
      <p className="text-slate-600">Next sprint: cart items, totals, persistence.</p>
    </div>
  );
}
