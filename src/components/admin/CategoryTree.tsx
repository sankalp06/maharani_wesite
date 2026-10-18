"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Palette, Plus } from "lucide-react";

type SubCategoryLite = {
  id: string;
  name: string;
  isActive: boolean;
};

type CategoryLite = {
  id: string;
  name: string;
  hasCustomDesign: boolean;
  isActive: boolean;
  subCategories: SubCategoryLite[];
};

export function CategoryTree({
  categories,
  selectedCategoryId,
  selectedSubCategoryId,
  onSelectCategory,
  onSelectSubCategory,
  onAddCategory,
  onAddSubCategory,
}: {
  categories: CategoryLite[];
  selectedCategoryId?: string | null;
  selectedSubCategoryId?: string | null;
  onSelectCategory: (categoryId: string) => void;
  onSelectSubCategory: (categoryId: string, subCategoryId: string) => void;
  onAddCategory: () => void;
  onAddSubCategory: (categoryId: string) => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selectedCategoryId) {
      setExpanded((prev) => ({ ...prev, [selectedCategoryId]: true }));
    }
  }, [selectedCategoryId]);

  function toggle(categoryId: string) {
    setExpanded((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  }

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white rounded-xl border border-gold/20 p-3 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
      <div className="flex items-center justify-between px-1 pb-2">
        <span className="text-xs font-sans uppercase tracking-wide text-ink/40">Catalog</span>
        <button
          onClick={onAddCategory}
          title="Add Category"
          className="p-1 rounded-full text-maroon hover:bg-blush/40"
        >
          <Plus size={15} />
        </button>
      </div>

      <div className="space-y-0.5">
        {categories.map((cat) => {
          const isOpen = !!expanded[cat.id];
          const isCatSelected = selectedCategoryId === cat.id && !selectedSubCategoryId;
          return (
            <div key={cat.id}>
              <div
                className={`group flex items-center gap-1 rounded-lg px-1.5 py-1.5 cursor-pointer ${
                  isCatSelected ? "bg-maroon text-cream" : "hover:bg-blush/30 text-ink"
                }`}
              >
                <button
                  onClick={() => toggle(cat.id)}
                  className={`p-0.5 shrink-0 ${isCatSelected ? "text-cream/80" : "text-ink/40"}`}
                >
                  {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </button>
                <button
                  onClick={() => onSelectCategory(cat.id)}
                  className="flex-1 flex items-center gap-1.5 text-left text-sm truncate min-w-0"
                >
                  <span className="truncate">{cat.name}</span>
                  {cat.hasCustomDesign && (
                    <Palette size={11} className={isCatSelected ? "text-gold-light" : "text-gold"} />
                  )}
                  {!cat.isActive && (
                    <span className="text-[9px] opacity-70 shrink-0">(hidden)</span>
                  )}
                </button>
                <button
                  onClick={() => onAddSubCategory(cat.id)}
                  title="Add sub-category"
                  className={`p-0.5 rounded-full shrink-0 opacity-0 group-hover:opacity-100 ${
                    isCatSelected ? "hover:bg-cream/20" : "hover:bg-blush/50"
                  }`}
                >
                  <Plus size={12} />
                </button>
              </div>

              {isOpen && (
                <div className="ml-5 border-l border-gold/15 pl-2 space-y-0.5 mb-1">
                  {cat.subCategories.length === 0 ? (
                    <p className="text-[11px] text-ink/35 px-1.5 py-1">No sub-categories</p>
                  ) : (
                    cat.subCategories.map((sub) => {
                      const isSubSelected = selectedSubCategoryId === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => onSelectSubCategory(cat.id, sub.id)}
                          className={`w-full text-left text-[13px] rounded-md px-2 py-1 truncate ${
                            isSubSelected
                              ? "bg-blush/60 text-maroon font-medium"
                              : "text-ink/70 hover:bg-blush/25"
                          }`}
                        >
                          {sub.name}
                          {!sub.isActive && <span className="text-[9px] opacity-60 ml-1">(hidden)</span>}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
