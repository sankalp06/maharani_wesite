"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, Palette, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalAmount = useCartStore((s) => s.totalAmount());

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="mx-auto text-gold" size={36} />
        <h1 className="mt-4 font-serif text-2xl text-maroon">Your cart is empty</h1>
        <p className="mt-2 text-ink/60 font-sans text-sm">
          Explore our collections and add something beautiful.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-maroon text-cream px-6 py-3 rounded-full text-sm font-sans"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Reveal>
        <h1 className="font-serif text-3xl text-maroon">Your Cart</h1>
        <div className="gold-divider w-20 mt-3 mb-8" />
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-5">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex gap-4 border border-gold/20 rounded-xl p-4 bg-white/60"
            >
              <div className="relative h-24 w-20 shrink-0 rounded-lg overflow-hidden bg-blush/30">
                <Image
                  src={item.customDesign?.image || item.image || "/placeholder-product.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-sans text-sm font-medium text-ink line-clamp-2">{item.name}</h3>
                  <button onClick={() => removeItem(item.key)} className="text-ink/40 hover:text-rose-600 shrink-0">
                    <Trash2 size={15} />
                  </button>
                </div>
                <span className="font-serif text-maroon text-sm">{formatPrice(item.price)}</span>

                {item.customDesign && (
                  <div className="mt-1.5 flex items-center gap-1 text-[11px] text-gold-light bg-maroon/90 text-cream px-2 py-1 rounded-full w-fit">
                    <Palette size={11} /> Custom design requested
                  </div>
                )}
                {item.customDesign?.description && (
                  <p className="mt-1 text-xs text-ink/50 line-clamp-2">
                    “{item.customDesign.description}”
                  </p>
                )}

                <div className="mt-2 flex items-center border border-gold/40 rounded-full w-fit">
                  <button
                    onClick={() => updateQuantity(item.key, item.quantity - 1)}
                    className="p-1.5 text-ink/60 hover:text-maroon"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="px-3 text-xs font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.key, item.quantity + 1)}
                    className="p-1.5 text-ink/60 hover:text-maroon"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-gold/30 rounded-xl p-6 h-fit bg-blush/20">
          <h2 className="font-serif text-lg text-maroon mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm font-sans text-ink/70 mb-2">
            <span>Subtotal</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm font-sans text-ink/50 mb-4">
            <span>Shipping</span>
            <span>Calculated at confirmation</span>
          </div>
          <div className="gold-divider mb-4" />
          <div className="flex justify-between font-serif text-maroon text-lg mb-6">
            <span>Total</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
          <Link
            href="/checkout"
            className="block text-center bg-maroon text-cream py-3 rounded-full text-sm font-sans hover:bg-maroon-dark transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
