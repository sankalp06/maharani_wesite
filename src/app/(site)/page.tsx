import Link from "next/link";
import Image from "next/image";
import { Sparkles, Palette, Truck, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { getAllCategoriesFull, getLatestProducts, getTrendingProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [trending, latest, categories] = await Promise.all([
    getTrendingProducts(8),
    getLatestProducts(8),
    getAllCategoriesFull(),
  ]);

  const products = trending.length > 0 ? trending : latest;

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-blush/50 via-cream to-cream">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-28 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-wide-xl text-maroon/80 border border-maroon/20 rounded-full px-4 py-1.5">
              <Sparkles size={13} /> Royal craftsmanship, made for you
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-6 font-serif text-4xl sm:text-6xl shimmer-text leading-tight">
              Maharani Boutique
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-ink/70 max-w-xl mx-auto font-sans">
              Curated art, decor, and ethnic fashion — every piece finished with a touch of
              royalty. Bring your own design to life with our bespoke customisation.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="#shop"
                className="bg-maroon text-cream px-7 py-3 rounded-full font-sans text-sm tracking-wide hover:bg-maroon-dark transition-colors"
              >
                Shop the Collection
              </Link>
              <Link
                href="#custom"
                className="border border-maroon/30 text-maroon px-7 py-3 rounded-full font-sans text-sm tracking-wide hover:bg-maroon/5 transition-colors"
              >
                Design Something Custom
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="gold-divider" />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {[
          { icon: Truck, label: "Pan-India Delivery" },
          { icon: Palette, label: "Custom Design Orders" },
          { icon: ShieldCheck, label: "Handpicked Quality" },
          { icon: Sparkles, label: "New Drops Weekly" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 py-4">
            <Icon size={20} className="text-gold" />
            <span className="text-xs font-sans text-ink/70">{label}</span>
          </div>
        ))}
      </section>

      <section id="shop" className="max-w-7xl mx-auto px-4 py-14">
        <Reveal>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink text-center">Shop by Category</h2>
          <div className="gold-divider w-20 mx-auto mt-3" />
        </Reveal>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories
            .filter((c) => c.isActive)
            .map((cat, i) => (
              <Reveal key={cat.id} delay={i * 0.08}>
                <Link
                  href={`/c/${cat.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-blush/40"
                >
                  <Image
                    src={cat.image || "/placeholder-product.svg"}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/80 via-maroon-dark/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <h3 className="font-serif text-xl text-cream">{cat.name}</h3>
                    <span className="text-xs text-gold font-sans tracking-wide">Explore &rarr;</span>
                  </div>
                </Link>
              </Reveal>
            ))}
        </div>
      </section>

      {products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-14">
          <Reveal>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink text-center">
              {trending.length > 0 ? "Trending Now" : "New Arrivals"}
            </h2>
            <div className="gold-divider w-20 mx-auto mt-3" />
          </Reveal>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                index={i}
                product={{
                  id: p.id,
                  name: p.name,
                  slug: p.slug,
                  price: p.price,
                  compareAtPrice: p.compareAtPrice,
                  images: p.images,
                  categorySlug: "",
                  subCategorySlug: "",
                }}
              />
            ))}
          </div>
        </section>
      )}

      <section id="custom" className="bg-maroon text-cream">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <Reveal>
            <Palette className="mx-auto text-gold" size={28} />
            <h2 className="mt-4 font-serif text-2xl sm:text-3xl">Have a Design in Mind?</h2>
            <p className="mt-3 text-cream/75 max-w-xl mx-auto font-sans">
              Share a picture and a short brief while shopping select categories, and our artisans
              will bring your custom vision to life — tracked right from your order.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
