"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Palette, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { ImageUploader } from "@/components/ImageUploader";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export function AddToCartPanel({
  product,
  allowsCustomDesign,
}: {
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    categorySlug: string;
    subCategorySlug: string;
    stock: number;
  };
  allowsCustomDesign: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [wantsCustom, setWantsCustom] = useState(false);
  const [designImage, setDesignImage] = useState<string[]>([]);
  const [designDescription, setDesignDescription] = useState("");
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  const outOfStock = product.stock <= 0;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleAddToCart() {
    if (wantsCustom && designImage.length === 0) {
      toast.error("Please upload a reference image for your custom design");
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      categorySlug: product.categorySlug,
      subCategorySlug: product.subCategorySlug,
      allowsCustomDesign,
      customDesign:
        wantsCustom && designImage[0]
          ? { image: designImage[0], description: designDescription }
          : null,
    });
    toast.success("Added to cart");
  }

  function handleBuyNow() {
    handleAddToCart();
    router.push("/cart");
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="font-serif text-3xl text-maroon">{formatPrice(product.price)}</span>
        {outOfStock && <span className="ml-3 text-sm text-rose-600 font-sans">Out of stock</span>}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-sans text-ink/70">Quantity</span>
        <div className="flex items-center border border-gold/40 rounded-full">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 text-ink/60 hover:text-maroon"
          >
            <Minus size={14} />
          </button>
          <span className="px-3 text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2 text-ink/60 hover:text-maroon"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {allowsCustomDesign && (
        <div className="border border-gold/30 rounded-xl p-4 bg-blush/20">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={wantsCustom}
              onChange={(e) => setWantsCustom(e.target.checked)}
              className="accent-maroon h-4 w-4"
            />
            <span className="flex items-center gap-1.5 text-sm font-medium text-maroon">
              <Palette size={15} /> I want a custom design for this item
            </span>
          </label>

          {wantsCustom && (
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs font-sans text-ink/60 mb-2">Upload your reference image</p>
                <ImageUploader images={designImage} onChange={setDesignImage} max={1} />
              </div>
              <div>
                <p className="text-xs font-sans text-ink/60 mb-2">Describe what you&apos;d like</p>
                <textarea
                  value={designDescription}
                  onChange={(e) => setDesignDescription(e.target.value)}
                  rows={3}
                  placeholder="Colours, sizing, motifs, or any special instructions..."
                  className="w-full rounded-lg border border-gold/30 p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-maroon"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div ref={ctaRef} className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="flex-1 flex items-center justify-center gap-2 border border-maroon text-maroon py-3 rounded-full text-sm font-medium hover:bg-maroon/5 disabled:opacity-40 transition-colors"
        >
          <ShoppingBag size={16} /> Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="flex-1 bg-maroon text-cream py-3 rounded-full text-sm font-medium hover:bg-maroon-dark disabled:opacity-40 transition-colors"
        >
          Buy Now
        </button>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {showStickyBar && (
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gold/30 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
              >
                <span className="font-serif text-lg text-maroon shrink-0">{formatPrice(product.price)}</span>
                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className="flex-1 border border-maroon text-maroon py-2.5 rounded-full text-sm font-medium disabled:opacity-40"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={outOfStock}
                  className="flex-1 bg-maroon text-cream py-2.5 rounded-full text-sm font-medium disabled:opacity-40"
                >
                  Buy Now
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
