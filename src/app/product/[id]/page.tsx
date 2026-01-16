import Image from "next/image";
import { notFound } from "next/navigation";
import { products } from "@/data/products";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  if (!product) return notFound();

  return (
    <div className="space-y-6 pb-14 pt-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-slate-600">
          {product.vetApproved ? "Vet-approved" : "Standard"} • ★ {product.rating.toFixed(1)} • ${product.price.toFixed(2)}
        </p>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
      </div>

      <p className="text-slate-700">
        Placeholder Product page. Next sprint: gallery, variants, Add to Cart, ingredients, reviews.
      </p>
    </div>
  );
}
