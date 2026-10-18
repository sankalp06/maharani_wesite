"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, Search, ShoppingBag, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { MobileMenu } from "@/components/MobileMenu";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const totalItems = useCartStore((s) => s.totalItems());
  const router = useRouter();

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
  }

  function toggleSearch() {
    setSearchOpen((v) => {
      const next = !v;
      if (next) setTimeout(() => searchInputRef.current?.focus(), 150);
      return next;
    });
  }

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

        <div className="hidden lg:flex flex-1 min-w-0 justify-center relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-cream to-transparent z-10" />
          <nav className="flex items-center gap-8 overflow-x-auto scrollbar-hide max-w-full px-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="relative py-8 shrink-0"
                onMouseEnter={() => setActiveCat(cat.id)}
                onMouseLeave={() => setActiveCat(null)}
              >
                <Link
                  href={`/c/${cat.slug}`}
                  className="text-sm font-sans font-medium uppercase tracking-wide text-ink hover:text-maroon transition-colors whitespace-nowrap"
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
                      className="absolute left-1/2 -translate-x-1/2 top-full bg-white shadow-xl border border-gold/20 rounded-lg py-3 min-w-[200px] z-20"
                    >
                      {cat.subCategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/c/${cat.slug}/${sub.slug}`}
                          className="block px-5 py-2 text-sm text-ink/80 hover:text-maroon hover:bg-blush/40 transition-colors whitespace-nowrap"
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
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-cream to-transparent z-10" />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={toggleSearch}
            className="p-2 text-ink hover:text-maroon transition-colors"
            aria-label="Search"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          <Link href="/cart" className="relative p-2 text-ink hover:text-maroon transition-colors">
            <ShoppingBag size={22} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -top-0.5 -right-0.5 bg-maroon text-white text-[10px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center leading-none px-1"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gold/20 bg-cream"
          >
            <form onSubmit={handleSearchSubmit} className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
              <Search size={16} className="text-ink/40 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for sarees, art, decor..."
                className="flex-1 bg-transparent text-sm font-sans outline-none placeholder:text-ink/40"
              />
              <button
                type="submit"
                className="text-xs font-sans text-maroon border border-maroon/30 rounded-full px-4 py-1.5 hover:bg-maroon/5 transition-colors"
              >
                Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileMenu open={open} onClose={() => setOpen(false)} categories={categories} />
    </header>
  );
}
