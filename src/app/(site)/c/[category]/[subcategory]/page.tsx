import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { CategoryNav } from "@/components/CategoryNav";
import { getSubCategory, getNavCategories } from "@/lib/data";

export const revalidate = 60;

export default async function SubCategoryPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category: categorySlug, subcategory: subCategorySlug } = await params;
  const [data, navCategories] = await Promise.all([
    getSubCategory(categorySlug, subCategorySlug),
    getNavCategories(),
  ]);
  if (!data) notFound();

  const { category, subCategory, products } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Reveal>
        <nav className="text-xs text-ink/50 font-sans mb-4">
          <Link href="/" className="hover:text-maroon">Home</Link> /{" "}
          <Link href={`/c/${category.slug}`} className="hover:text-maroon">{category.name}</Link> /{" "}
          {subCategory.name}
        </nav>
        <h1 className="font-serif text-3xl sm:text-4xl text-maroon">{subCategory.name}</h1>
        <div className="gold-divider w-20 mt-4" />
      </Reveal>

      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        <CategoryNav
          categories={navCategories}
          activeCategorySlug={category.slug}
          activeSubCategorySlug={subCategory.slug}
        />

        <div className="flex-1 min-w-0">
          {products.length === 0 ? (
            <p className="text-ink/60 font-sans">No products here yet. Please check back soon.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
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
                    categorySlug: category.slug,
                    subCategorySlug: subCategory.slug,
                    allowsCustomDesign: category.hasCustomDesign,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
