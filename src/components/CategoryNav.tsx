"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

type NavCategory = {
  id: string;
  name: string;
  slug: string;
  subCategories: { id: string; name: string; slug: string }[];
};

export function CategoryNav({
  categories,
  activeCategorySlug,
  activeSubCategorySlug,
}: {
  categories: NavCategory[];
  activeCategorySlug?: string;
  activeSubCategorySlug?: string;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    activeCategorySlug ? { [activeCategorySlug]: true } : {}
  );

  function toggle(slug: string) {
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));
  }

  return (
    <aside className="w-full lg:w-60 shrink-0 lg:sticky lg:top-24 lg:self-start">
      <div className="bg-white/70 rounded-xl border border-gold/20 p-4">
        <h3 className="font-serif text-sm uppercase tracking-wide text-maroon mb-3">
          Shop By Category
        </h3>
        <div className="space-y-0.5">
          {categories.map((cat) => {
            const isCatActive = cat.slug === activeCategorySlug;
            const isOpen = !!expanded[cat.slug];
            return (
              <div key={cat.id}>
                <div className="flex items-center gap-1">
                  {cat.subCategories.length > 0 ? (
                    <button
                      onClick={() => toggle(cat.slug)}
                      className="p-1 text-ink/40 hover:text-maroon shrink-0"
                    >
                      {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    </button>
                  ) : (
                    <span className="w-[22px] shrink-0" />
                  )}
                  <Link
                    href={`/c/${cat.slug}`}
                    className={`flex-1 text-sm py-1.5 truncate ${
                      isCatActive && !activeSubCategorySlug
                        ? "text-maroon font-semibold"
                        : "text-ink/80 hover:text-maroon"
                    }`}
                  >
                    {cat.name}
                  </Link>
                </div>
                {isOpen && cat.subCategories.length > 0 && (
                  <div className="ml-6 border-l border-gold/15 pl-3 space-y-0.5 mb-1">
                    {cat.subCategories.map((sub) => {
                      const isSubActive = isCatActive && sub.slug === activeSubCategorySlug;
                      return (
                        <Link
                          key={sub.id}
                          href={`/c/${cat.slug}/${sub.slug}`}
                          className={`block text-[13px] py-1 truncate ${
                            isSubActive
                              ? "text-maroon font-semibold"
                              : "text-ink/60 hover:text-maroon"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
