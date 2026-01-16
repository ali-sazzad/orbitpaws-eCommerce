import { featuredProducts } from "@/data/products";
import { Orbit3DProductCard } from "@/components/orbit/Orbit3DProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-12 pb-14">
      {/* Hero */}
      <section className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <div className="max-w-2xl space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
            <span className="font-semibold">Vet-approved</span>
            <span className="text-slate-400">•</span>
            Safe ingredients, real trust signals
          </p>

          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Premium pet essentials, vetted by care standards — not hype.
          </h1>

          <p className="text-pretty text-slate-600 sm:text-lg">
            OrbitPaws is a mini storefront demo that proves real-world UI flows:
            discovery → product UX → cart → checkout — with performance and accessibility baked in.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="h-11 px-6" asChild>
              <a href="/shop">Shop vet-approved picks</a>
            </Button>
            <Button variant="outline" className="h-11 px-6" asChild>
              <a href="#spotlight">View featured spotlight</a>
            </Button>
          </div>

          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            {[
              { title: "Fast delivery", desc: "Sydney metro estimates shown" },
              { title: "30-day returns", desc: "Clear, simple policy UX" },
              { title: "Safe ingredients", desc: "Trust-first microcopy" },
            ].map((x) => (
              <Card key={x.title} className="border-slate-200/70">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold">{x.title}</p>
                  <p className="text-xs text-slate-600">{x.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Category shortcuts */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Shop by category</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Cat essentials", hint: "Sensitive stomach, indoor play, grooming" },
            { label: "Dog essentials", hint: "Dental, mobility, training toys" },
            { label: "Vet-approved only", hint: "Filter-ready trust signal" },
          ].map((c) => (
            <a
              key={c.label}
              href="/shop"
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              <p className="text-sm font-semibold">{c.label}</p>
              <p className="text-xs text-slate-600">{c.hint}</p>
              <p className="mt-3 text-xs text-slate-500 group-hover:text-slate-700">Explore →</p>
            </a>
          ))}
        </div>
      </section>

      {/* Featured 3D Spotlight */}
      <section id="spotlight" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">3D Product Spotlight</h2>
            <p className="text-sm text-slate-600">Premium hover depth, subtle glow, reduced-motion safe.</p>
          </div>
          <Button variant="outline" asChild>
            <a href="/shop">See all</a>
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((p) => (
            <Orbit3DProductCard
              key={p.id}
              title={p.name}
              price={p.price}
              image={p.image}
              rating={p.rating}
              vetApproved={p.vetApproved}
              stock={p.stock}
              tags={p.tags}
              href={`/product/${p.id}`}
            />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Trusted by pet owners (mock)</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              quote: "Finally a store that explains ingredients like a professional, not marketing fluff.",
              name: "Mia • Cat owner",
            },
            {
              quote: "Checkout flow feels real. Clear errors, clear confidence.",
              name: "Ravi • Dog owner",
            },
            {
              quote: "The UI feels premium, but still fast. No heavy animation lag.",
              name: "Sarah • Frontend reviewer",
            },
          ].map((t) => (
            <Card key={t.name} className="border-slate-200/70">
              <CardContent className="p-5">
                <p className="text-sm text-slate-700">“{t.quote}”</p>
                <p className="mt-3 text-xs font-semibold text-slate-600">{t.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}