import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { ProductGallery } from "@/components/ProductGallery";
import { AddToCartPanel } from "@/components/AddToCartPanel";
import { getProductBySlug } from "@/lib/data";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = product.subCategory.category;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <nav className="text-xs text-ink/50 font-sans mb-6">
        <Link href="/" className="hover:text-maroon">Home</Link> /{" "}
        <Link href={`/c/${category.slug}`} className="hover:text-maroon">{category.name}</Link> /{" "}
        <Link href={`/c/${category.slug}/${product.subCategory.slug}`} className="hover:text-maroon">
          {product.subCategory.name}
        </Link>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Reveal>
          <ProductGallery images={product.images.map((i) => i.url)} name={product.name} />
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif text-3xl text-ink">{product.name}</h1>
          <div className="gold-divider w-16 mt-3 mb-6" />
          <AddToCartPanel
            allowsCustomDesign={category.hasCustomDesign}
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0]?.url ?? null,
              categorySlug: category.slug,
              subCategorySlug: product.subCategory.slug,
              stock: product.stock,
            }}
          />
          <div className="mt-8">
            <h2 className="font-serif text-lg text-maroon mb-2">Description</h2>
            <p className="text-sm text-ink/70 font-sans whitespace-pre-line leading-relaxed">
              {product.description}
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
