import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { CategoryNav } from "@/components/CategoryNav";
import { getCategoryBySlug, getNavCategories } from "@/lib/data";

export const revalidate = 60;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const [category, navCategories] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getNavCategories(),
  ]);
  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Reveal>
        <nav className="text-xs text-ink/50 font-sans mb-4">
          <Link href="/" className="hover:text-maroon">Home</Link> / {category.name}
        </nav>
        <h1 className="font-serif text-3xl sm:text-4xl text-maroon">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-ink/70 font-sans max-w-2xl">{category.description}</p>
        )}
        <div className="gold-divider w-20 mt-4" />
      </Reveal>

      <div className="mt-8 flex flex-col lg:flex-row gap-8">
        <CategoryNav categories={navCategories} activeCategorySlug={category.slug} />

        <div className="flex-1 min-w-0">
          {category.subCategories.length === 0 ? (
            <p className="text-ink/60 font-sans">New collections are on the way. Please check back soon.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.subCategories.map((sub, i) => (
                <Reveal key={sub.id} delay={i * 0.06}>
                  <Link
                    href={`/c/${category.slug}/${sub.slug}`}
                    className="group relative block aspect-[3/4] overflow-hidden rounded-xl bg-blush/40"
                  >
                    <Image
                      src={sub.image || "/placeholder-product.svg"}
                      alt={sub.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/75 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="font-serif text-lg text-cream">{sub.name}</h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
