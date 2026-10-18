"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: { url: string }[];
  categorySlug: string;
  subCategorySlug: string;
  allowsCustomDesign?: boolean;
};

export function ProductCard({ product, index = 0 }: { product: ProductCardData; index?: number }) {
  const image = product.images[0]?.url ?? "/placeholder-product.svg";
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-blush/30">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            onLoad={() => setLoaded(true)}
            className={`object-cover transition-all duration-500 group-hover:scale-105 ${
              loaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
            }`}
          />
          {discount && (
            <span className="absolute top-3 left-3 bg-maroon text-cream text-xs font-semibold px-2 py-1 rounded-full">
              {discount}% OFF
            </span>
          )}
          {product.allowsCustomDesign && (
            <span className="absolute top-3 right-3 bg-gold text-maroon-dark text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <Palette size={11} /> Customisable
            </span>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-sans text-ink/90 line-clamp-1 group-hover:text-maroon transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-serif text-base text-maroon">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-ink/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
