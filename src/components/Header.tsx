"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, ShoppingBag, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useCartStore } from "@/store/cart";

type NavCategory = {
  id: string;
  name: string;
  slug: string;
  subCategories: { id: string; name: string; slug: string }[];
};

export function Header({
  categories,
  phone,
}: {
  categories: NavCategory[];
  phone?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-gold/30">
      {phone ? (
        <div className="hidden sm:block bg-maroon text-cream text-xs">
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-end items-center gap-2">
            <Phone size={12} />
            <a href={`tel:${phone}`} className="hover:text-gold transition-colors">
              {phone}
            </a>
          </div>
        </div>
      ) : null}

      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 sm:h-20">
        <button
          className="lg:hidden p-2 -ml-2 text-ink"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        <Link href="/" className="flex-shrink-0">
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-8 mx-auto">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="relative py-8"
              onMouseEnter={() => setActiveCat(cat.id)}
              onMouseLeave={() => setActiveCat(null)}
            >
              <Link
                href={`/c/${cat.slug}`}
                className="text-sm font-sans font-medium uppercase tracking-wide text-ink hover:text-maroon transition-colors"
              >
                {cat.name}
              </Link>
              <AnimatePresence>
                {activeCat === cat.id && cat.subCategories.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full bg-white shadow-xl border border-gold/20 rounded-lg py-3 min-w-[200px]"
                  >
                    {cat.subCategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/c/${cat.slug}/${sub.slug}`}
                        className="block px-5 py-2 text-sm text-ink/80 hover:text-maroon hover:bg-blush/40 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <Link href="/cart" className="relative p-2 text-ink hover:text-maroon transition-colors">
          <ShoppingBag size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-maroon text-white text-[10px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center leading-none px-1">
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-cream z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-gold/20">
                <Logo />
                <button onClick={() => setOpen(false)} className="p-2 text-ink">
                  <X size={22} />
                </button>
              </div>
              <div className="p-4 space-y-5">
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <Link
                      href={`/c/${cat.slug}`}
                      onClick={() => setOpen(false)}
                      className="font-serif text-lg text-maroon"
                    >
                      {cat.name}
                    </Link>
                    <div className="mt-2 flex flex-col gap-1.5 pl-3">
                      {cat.subCategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/c/${cat.slug}/${sub.slug}`}
                          onClick={() => setOpen(false)}
                          className="text-sm text-ink/70"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
