"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { products } from "@/data/products";
import { useCart } from "@/lib/orbit/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

export function CartClient() {
  const { state, setQty, remove, clear, hydrated } = useCart();

  // Map lines -> product data
  const lines = state.lines
    .map((l) => {
      const p = products.find((x) => x.id === l.productId);
      if (!p) return null;
      return { line: l, product: p };
    })
    .filter(Boolean) as Array<{ line: (typeof state.lines)[number]; product: (typeof products)[number] }>;

  const subtotal = lines.reduce((sum, x) => sum + x.product.price * x.line.qty, 0);
  const shipping = subtotal >= 80 || subtotal === 0 ? 0 : 7.95;
  const total = subtotal + shipping;

  // avoid showing “0” flicker before localStorage hydration
  if (!hydrated) {
    return (
      <div className="space-y-6 pb-14">
        <h1 className="text-2xl font-semibold">Cart</h1>
        <Card className="rounded-2xl border-slate-200/70 bg-white/70 backdrop-blur supports-backdrop-filter:bg-white/55">
          <CardContent className="p-6 text-sm text-slate-600">Loading your cart…</CardContent>
        </Card>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="space-y-6 pb-14">
        <h1 className="text-2xl font-semibold">Cart</h1>
        <Card className="rounded-2xl border-slate-200/70 bg-white/70 backdrop-blur supports-backdrop-filter:bg-white/55">
          <CardContent className="space-y-3 p-8 text-center">
            <p className="text-sm font-semibold">Your cart is empty</p>
            <p className="text-sm text-slate-600">Browse vet-approved essentials and add something you trust.</p>
            <Button asChild variant="default">
              <Link href="/shop">Go to Shop</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 pb-14 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <h1 className="text-2xl font-semibold">Cart</h1>
          <Button
            variant="outline"
            onClick={() => {
              clear();
              toast.success("Cart cleared");
            }}
          >
            Clear
          </Button>
        </div>

        <div className="space-y-4">
          {lines.map(({ line, product }) => {
            const outOfStock = product.stock <= 0;
            const maxQty = Math.max(1, product.stock);

            return (
              <Card
                key={line.lineId}
                className="rounded-2xl border-slate-200/70 bg-white/70 backdrop-blur supports-backdrop-filter:bg-white/55"
              >
                <CardContent className="flex gap-4 p-4">
                  <div className="relative h-20 w-28 overflow-hidden rounded-xl">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{product.name}</p>
                        <p className="text-xs text-slate-600">
                          {line.variantId ? `Variant: ${line.variantId}` : "Standard"} • ★ {product.rating.toFixed(1)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">{money(product.price)}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQty(line.lineId, Math.max(1, line.qty - 1))}
                        >
                          −
                        </Button>
                        <span className="min-w-8 text-center text-sm font-semibold">{line.qty}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQty(line.lineId, Math.min(maxQty, line.qty + 1))}
                          disabled={outOfStock || line.qty >= maxQty}
                        >
                          +
                        </Button>
                        <span className="text-xs text-slate-500">
                          {outOfStock ? "Out of stock" : `${product.stock} available`}
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        onClick={() => {
                          remove(line.lineId);
                          toast("Removed from cart", { description: product.name });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <Card className="h-fit rounded-2xl border-slate-200/70 bg-white/70 backdrop-blur supports-backdrop-filter:bg-white/55">
        <CardContent className="space-y-4 p-5">
          <p className="text-sm font-semibold">Order summary</p>

          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{money(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span className="font-semibold">{shipping === 0 ? "Free" : money(shipping)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span>Total</span>
              <span className="text-base font-semibold">{money(total)}</span>
            </div>
          </div>

          <Button asChild variant="default" className="w-full">
            <Link href="/checkout">Continue to checkout</Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/shop">Continue shopping</Link>
          </Button>

          <p className="text-xs text-slate-500">
            Demo checkout — no payments. Built to show real UI flows + persistence.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
