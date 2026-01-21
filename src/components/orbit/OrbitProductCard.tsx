"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/orbit/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  product: Product;
  layout?: "grid" | "list";
};

export function OrbitProductCard({ product, layout = "grid" }: Props) {
  const { add } = useCart();
  const outOfStock = product.stock <= 0;

  const onAdd = () => {
    if (outOfStock) {
      toast.error("Out of stock", { description: "This item will be restocked soon." });
      return;
    }
    add({ productId: product.id, qty: 1 });
    toast.success("Added to cart", { description: product.name });
  };

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200/70 bg-white/70 backdrop-blur supports-backdrop-filter:bg-white/55">
      <CardContent className={cn("p-4", layout === "list" && "sm:flex sm:gap-4")}>
        <Link
          href={`/product/${product.id}`}
          className={cn(
            "block overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring",
            layout === "list" ? "sm:w-55" : ""
          )}
        >
          <div className={cn("relative", layout === "list" ? "aspect-4/3" : "aspect-4/3")}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        </Link>

        <div className={cn("mt-4 space-y-3", layout === "list" && "sm:mt-0 sm:flex-1")}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={`/product/${product.id}`} className="block">
                <p className="truncate text-sm font-semibold">{product.name}</p>
              </Link>
              <p className="text-xs text-slate-600">Safe ingredients • 30-day returns</p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold">${product.price.toFixed(2)}</p>
              <p className="text-xs text-slate-600">★ {product.rating.toFixed(1)}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.vetApproved ? <Badge className="bg-slate-900 text-white">Vet-approved</Badge> : null}
            {outOfStock ? <Badge variant="destructive">Out of stock</Badge> : null}
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-slate-600">{outOfStock ? "0 left" : `${product.stock} in stock`}</p>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/product/${product.id}`}>View</Link>
              </Button>
              <Button variant="default" size="sm" onClick={onAdd} disabled={outOfStock}>
                Add
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
