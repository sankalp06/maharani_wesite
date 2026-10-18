import { SearchX } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { searchProducts } from "@/lib/data";

export const revalidate = 60;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await searchProducts(query) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Reveal>
        <h1 className="font-serif text-2xl sm:text-3xl text-ink">
          {query ? (
            <>
              Results for <span className="text-maroon">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            "Search"
          )}
        </h1>
        <div className="gold-divider w-20 mt-4" />
      </Reveal>

      {query && results.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <SearchX className="text-gold" size={32} />
          <p className="mt-4 text-ink/60 font-sans">
            No products found for &ldquo;{query}&rdquo;. Try a different search term.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {results.map((p, i) => (
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
                categorySlug: p.subCategory.category.slug,
                subCategorySlug: p.subCategory.slug,
                allowsCustomDesign: p.subCategory.category.hasCustomDesign,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
