"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Logo } from "@/components/Logo";

type NavCategory = {
  id: string;
  name: string;
  slug: string;
  subCategories: { id: string; name: string; slug: string }[];
};

export function MobileMenu({
  open,
  onClose,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  categories: NavCategory[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed top-0 left-0 h-dvh w-[85%] max-w-sm bg-cream z-[101] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-gold/20">
              <Logo />
              <button onClick={onClose} className="p-2 text-ink" aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <div className="p-4 space-y-5">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <Link
                    href={`/c/${cat.slug}`}
                    onClick={onClose}
                    className="font-serif text-lg text-maroon"
                  >
                    {cat.name}
                  </Link>
                  <div className="mt-2 flex flex-col gap-1.5 pl-3">
                    {cat.subCategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/c/${cat.slug}/${sub.slug}`}
                        onClick={onClose}
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
    </AnimatePresence>,
    document.body
  );
}
