// src/components/orbit/OrbitProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrbitRatingStars } from "@/components/orbit/OrbitRatingStars";

type Props = {
  product: Product;
  layout?: "grid" | "list";
};

export function OrbitProductCard({ product, layout = "grid" }: Props) {
  const outOfStock = product.stock <= 0;

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200/70 bg-white">
      <CardContent className={cn("p-0", layout === "list" && "sm:flex")}>
        {/* Image */}
        <div
          className={cn(
            "relative",
            layout === "grid" && "aspect-4/3 w-full",
            layout === "list" && "aspect-4/3 w-full sm:h-full sm:w-64 sm:shrink-0"
          )}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes={layout === "grid" ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 260px"}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-black/0 to-black/0" />

          <div className="absolute left-3 top-3 flex gap-2">
            {product.vetApproved ? (
              <Badge className="bg-slate-900 text-white">Vet-approved</Badge>
            ) : (
              <Badge variant="secondary">Standard</Badge>
            )}
            {outOfStock ? <Badge variant="destructive">Out of stock</Badge> : null}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="space-y-1">
            <Link
              href={`/product/${product.id}`}
              className="line-clamp-2 text-sm font-semibold leading-snug hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              {product.name}
            </Link>

            <div className="flex items-center justify-between gap-3">
              <OrbitRatingStars rating={product.rating} />
              <p className="text-sm font-semibold">${product.price.toFixed(2)}</p>
            </div>

            <p className="text-xs text-slate-600">
              Safe ingredients • Fast delivery • 30-day returns
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              {outOfStock ? "0 available" : `${product.stock} in stock`}
            </p>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/product/${product.id}`}>View</Link>
              </Button>

              {/* Cart comes Sprint 3. Keep button real but disabled. */}
              <Button size="sm" disabled title="Cart comes in Sprint 3">
                Add to cart
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
