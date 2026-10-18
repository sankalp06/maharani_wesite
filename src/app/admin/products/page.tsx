"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, ChevronRight, Palette, TrendingUp } from "lucide-react";
import { Modal } from "@/components/admin/Modal";
import { ImageUploader } from "@/components/ImageUploader";
import { formatPrice } from "@/lib/utils";

type SubCategoryLite = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  isActive: boolean;
  _count?: { products: number };
};

type CategoryLite = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  hasCustomDesign: boolean;
  isActive: boolean;
  subCategories: SubCategoryLite[];
};

type ProductLite = {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isTrending: boolean;
  isActive: boolean;
  images: { id: string; url: string }[];
};

export default function AdminProductsPage() {
  const [categories, setCategories] = useState<CategoryLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryLite | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryLite | null>(null);
  const [products, setProducts] = useState<ProductLite[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const [categoryModal, setCategoryModal] = useState<{ open: boolean; editing: CategoryLite | null }>({
    open: false,
    editing: null,
  });
  const [subCategoryModal, setSubCategoryModal] = useState<{ open: boolean; editing: SubCategoryLite | null }>({
    open: false,
    editing: null,
  });
  const [productModal, setProductModal] = useState<{ open: boolean; editing: ProductLite | null }>({
    open: false,
    editing: null,
  });

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProducts = useCallback(async (subCategoryId: string) => {
    setProductsLoading(true);
    try {
      const res = await fetch(`/api/products?subCategoryId=${subCategoryId}`);
      const data = await res.json();
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (selectedSubCategory) loadProducts(selectedSubCategory.id);
  }, [selectedSubCategory, loadProducts]);

  // Keep selectedCategory in sync with refreshed categories list
  useEffect(() => {
    if (selectedCategory) {
      const fresh = categories.find((c) => c.id === selectedCategory.id);
      if (fresh) setSelectedCategory(fresh);
    }
  }, [categories, selectedCategory?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function deleteCategory(cat: CategoryLite) {
    if (!confirm(`Delete category "${cat.name}"? This removes all its sub-categories and products.`)) return;
    await fetch(`/api/categories/${cat.id}`, { method: "DELETE" });
    toast.success("Category deleted");
    setSelectedCategory(null);
    loadCategories();
  }

  async function deleteSubCategory(sub: SubCategoryLite) {
    if (!confirm(`Delete sub-category "${sub.name}"? This removes its products.`)) return;
    await fetch(`/api/subcategories/${sub.id}`, { method: "DELETE" });
    toast.success("Sub-category deleted");
    setSelectedSubCategory(null);
    loadCategories();
  }

  async function deleteProduct(product: ProductLite) {
    if (!confirm(`Delete product "${product.name}"?`)) return;
    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    toast.success("Product deleted");
    if (selectedSubCategory) loadProducts(selectedSubCategory.id);
  }

  return (
    <div>
      <Breadcrumb
        category={selectedCategory}
        subCategory={selectedSubCategory}
        onHome={() => {
          setSelectedCategory(null);
          setSelectedSubCategory(null);
        }}
        onCategory={() => setSelectedSubCategory(null)}
      />

      {!selectedCategory && (
        <Section
          title="Categories"
          onAdd={() => setCategoryModal({ open: true, editing: null })}
          addLabel="Add Category"
        >
          {loading ? (
            <p className="text-ink/50 text-sm">Loading...</p>
          ) : categories.length === 0 ? (
            <EmptyState text="No categories yet. Create your first one to get started." />
          ) : (
            <Grid>
              {categories.map((cat) => (
                <Card
                  key={cat.id}
                  title={cat.name}
                  image={cat.image}
                  badge={cat.hasCustomDesign ? "Custom Design" : undefined}
                  subtitle={`${cat.subCategories.length} sub-categories`}
                  onClick={() => setSelectedCategory(cat)}
                  onEdit={() => setCategoryModal({ open: true, editing: cat })}
                  onDelete={() => deleteCategory(cat)}
                />
              ))}
            </Grid>
          )}
        </Section>
      )}

      {selectedCategory && !selectedSubCategory && (
        <Section
          title={`${selectedCategory.name} — Sub-categories`}
          onAdd={() => setSubCategoryModal({ open: true, editing: null })}
          addLabel="Add Sub-category"
        >
          {selectedCategory.subCategories.length === 0 ? (
            <EmptyState text="No sub-categories yet." />
          ) : (
            <Grid>
              {selectedCategory.subCategories.map((sub) => (
                <Card
                  key={sub.id}
                  title={sub.name}
                  image={sub.image}
                  subtitle={`${sub._count?.products ?? 0} products`}
                  onClick={() => setSelectedSubCategory(sub)}
                  onEdit={() => setSubCategoryModal({ open: true, editing: sub })}
                  onDelete={() => deleteSubCategory(sub)}
                />
              ))}
            </Grid>
          )}
        </Section>
      )}

      {selectedSubCategory && (
        <Section
          title={`${selectedSubCategory.name} — Products`}
          onAdd={() => setProductModal({ open: true, editing: null })}
          addLabel="Add Product"
        >
          {productsLoading ? (
            <p className="text-ink/50 text-sm">Loading...</p>
          ) : products.length === 0 ? (
            <EmptyState text="No products yet." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gold/20 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blush/30 text-left text-ink/60 text-xs uppercase">
                    <th className="p-3">Image</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Flags</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t border-gold/10">
                      <td className="p-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-blush/30">
                          <Image
                            src={p.images[0]?.url || "/placeholder-product.svg"}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-3 font-medium text-ink max-w-[220px] truncate">{p.name}</td>
                      <td className="p-3 text-maroon">{formatPrice(p.price)}</td>
                      <td className="p-3">{p.stock}</td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {p.isTrending && (
                            <span className="text-[10px] bg-gold/20 text-maroon-dark px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <TrendingUp size={10} /> Trending
                            </span>
                          )}
                          {!p.isActive && (
                            <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">
                              Hidden
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setProductModal({ open: true, editing: p })}
                          className="p-1.5 text-ink/50 hover:text-maroon"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => deleteProduct(p)}
                          className="p-1.5 text-ink/50 hover:text-rose-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      )}

      <CategoryModal
        state={categoryModal}
        onClose={() => setCategoryModal({ open: false, editing: null })}
        onSaved={loadCategories}
      />
      <SubCategoryModal
        state={subCategoryModal}
        categoryId={selectedCategory?.id}
        onClose={() => setSubCategoryModal({ open: false, editing: null })}
        onSaved={loadCategories}
      />
      <ProductModal
        state={productModal}
        subCategoryId={selectedSubCategory?.id}
        onClose={() => setProductModal({ open: false, editing: null })}
        onSaved={() => selectedSubCategory && loadProducts(selectedSubCategory.id)}
      />
    </div>
  );
}

function Breadcrumb({
  category,
  subCategory,
  onHome,
  onCategory,
}: {
  category: CategoryLite | null;
  subCategory: SubCategoryLite | null;
  onHome: () => void;
  onCategory: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5 text-sm font-sans text-ink/60 mb-6">
      <button onClick={onHome} className={!category ? "text-maroon font-medium" : "hover:text-maroon"}>
        Categories
      </button>
      {category && (
        <>
          <ChevronRight size={14} />
          <button onClick={onCategory} className={!subCategory ? "text-maroon font-medium" : "hover:text-maroon"}>
            {category.name}
          </button>
        </>
      )}
      {subCategory && (
        <>
          <ChevronRight size={14} />
          <span className="text-maroon font-medium">{subCategory.name}</span>
        </>
      )}
    </div>
  );
}

function Section({
  title,
  onAdd,
  addLabel,
  children,
}: {
  title: string;
  onAdd: () => void;
  addLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-serif text-2xl text-maroon">{title}</h1>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 bg-maroon text-cream px-4 py-2 rounded-full text-sm hover:bg-maroon-dark transition-colors"
        >
          <Plus size={15} /> {addLabel}
        </button>
      </div>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">{children}</div>;
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-gold/40 rounded-xl p-10 text-center text-ink/50 text-sm">
      {text}
    </div>
  );
}

function Card({
  title,
  subtitle,
  image,
  badge,
  onClick,
  onEdit,
  onDelete,
}: {
  title: string;
  subtitle: string;
  image: string | null;
  badge?: string;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group relative bg-white rounded-xl border border-gold/20 overflow-hidden hover:shadow-md transition-shadow">
      <button onClick={onClick} className="block w-full text-left">
        <div className="relative aspect-square bg-blush/30">
          <Image src={image || "/placeholder-product.svg"} alt="" fill className="object-cover" />
          {badge && (
            <span className="absolute top-2 left-2 bg-gold text-maroon-dark text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Palette size={10} /> {badge}
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-sans text-sm font-medium text-ink truncate">{title}</h3>
          <p className="text-xs text-ink/50">{subtitle}</p>
        </div>
      </button>
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="bg-white/90 p-1.5 rounded-full text-ink/60 hover:text-maroon shadow">
          <Pencil size={13} />
        </button>
        <button onClick={onDelete} className="bg-white/90 p-1.5 rounded-full text-ink/60 hover:text-rose-600 shadow">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

function CategoryModal({
  state,
  onClose,
  onSaved,
}: {
  state: { open: boolean; editing: CategoryLite | null };
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string[]>([]);
  const [hasCustomDesign, setHasCustomDesign] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (state.open) {
      setName(state.editing?.name ?? "");
      setDescription(state.editing?.description ?? "");
      setImage(state.editing?.image ? [state.editing.image] : []);
      setHasCustomDesign(state.editing?.hasCustomDesign ?? false);
    }
  }, [state.open, state.editing]);

  async function save() {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = { name, description, image: image[0] || null, hasCustomDesign };
      const res = state.editing
        ? await fetch(`/api/categories/${state.editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(state.editing ? "Category updated" : "Category created");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={state.open} onClose={onClose} title={state.editing ? "Edit Category" : "Add Category"}>
      <div className="space-y-4">
        <LabeledInput label="Name *" value={name} onChange={setName} placeholder="e.g. Fashion" />
        <LabeledTextarea label="Description" value={description} onChange={setDescription} />
        <div>
          <span className="text-xs font-sans text-ink/60 mb-1.5 block">Cover Image</span>
          <ImageUploader images={image} onChange={setImage} max={1} />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasCustomDesign}
            onChange={(e) => setHasCustomDesign(e.target.checked)}
            className="accent-maroon h-4 w-4"
          />
          <span className="text-sm text-ink/80">
            Allow customers to request a custom design for products in this category
          </span>
        </label>
        <button
          onClick={save}
          disabled={saving}
          className="w-full bg-maroon text-cream py-2.5 rounded-full text-sm hover:bg-maroon-dark disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Category"}
        </button>
      </div>
    </Modal>
  );
}

function SubCategoryModal({
  state,
  categoryId,
  onClose,
  onSaved,
}: {
  state: { open: boolean; editing: SubCategoryLite | null };
  categoryId?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [image, setImage] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (state.open) {
      setName(state.editing?.name ?? "");
      setImage(state.editing?.image ? [state.editing.image] : []);
    }
  }, [state.open, state.editing]);

  async function save() {
    if (!name.trim()) {
      toast.error("Sub-category name is required");
      return;
    }
    if (!state.editing && !categoryId) return;
    setSaving(true);
    try {
      const payload = { name, image: image[0] || null, categoryId };
      const res = state.editing
        ? await fetch(`/api/subcategories/${state.editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/subcategories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(state.editing ? "Sub-category updated" : "Sub-category created");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={state.open} onClose={onClose} title={state.editing ? "Edit Sub-category" : "Add Sub-category"}>
      <div className="space-y-4">
        <LabeledInput label="Name *" value={name} onChange={setName} placeholder="e.g. Sarees" />
        <div>
          <span className="text-xs font-sans text-ink/60 mb-1.5 block">Cover Image</span>
          <ImageUploader images={image} onChange={setImage} max={1} />
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="w-full bg-maroon text-cream py-2.5 rounded-full text-sm hover:bg-maroon-dark disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Sub-category"}
        </button>
      </div>
    </Modal>
  );
}

function ProductModal({
  state,
  subCategoryId,
  onClose,
  onSaved,
}: {
  state: { open: boolean; editing: ProductLite | null };
  subCategoryId?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [images, setImages] = useState<string[]>([]);
  const [isTrending, setIsTrending] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (state.open) {
      setName(state.editing?.name ?? "");
      setDescription(state.editing?.description ?? "");
      setPrice(state.editing?.price?.toString() ?? "");
      setCompareAtPrice(state.editing?.compareAtPrice?.toString() ?? "");
      setStock(state.editing?.stock?.toString() ?? "0");
      setImages(state.editing?.images.map((i) => i.url) ?? []);
      setIsTrending(state.editing?.isTrending ?? false);
      setIsActive(state.editing?.isActive ?? true);
    }
  }, [state.open, state.editing]);

  async function save() {
    if (!name.trim() || !description.trim() || !price) {
      toast.error("Name, description and price are required");
      return;
    }
    if (!state.editing && !subCategoryId) return;
    setSaving(true);
    try {
      const payload = {
        name,
        description,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        stock: Number(stock),
        images,
        isTrending,
        isActive,
        subCategoryId,
      };
      const res = state.editing
        ? await fetch(`/api/products/${state.editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(state.editing ? "Product updated" : "Product created");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={state.open} onClose={onClose} title={state.editing ? "Edit Product" : "Add Product"}>
      <div className="space-y-4">
        <LabeledInput label="Name *" value={name} onChange={setName} placeholder="e.g. Embroidered Silk Saree" />
        <LabeledTextarea label="Description *" value={description} onChange={setDescription} rows={4} />
        <div className="grid grid-cols-2 gap-4">
          <LabeledInput label="Price (₹) *" value={price} onChange={setPrice} type="number" />
          <LabeledInput label="Compare-at Price (₹)" value={compareAtPrice} onChange={setCompareAtPrice} type="number" />
        </div>
        <LabeledInput label="Stock Quantity" value={stock} onChange={setStock} type="number" />
        <div>
          <span className="text-xs font-sans text-ink/60 mb-1.5 block">Product Images</span>
          <ImageUploader images={images} onChange={setImages} max={6} />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="accent-maroon h-4 w-4" />
            <span className="text-sm text-ink/80">Mark as Trending</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-maroon h-4 w-4" />
            <span className="text-sm text-ink/80">Visible on storefront</span>
          </label>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="w-full bg-maroon text-cream py-2.5 rounded-full text-sm hover:bg-maroon-dark disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Product"}
        </button>
      </div>
    </Modal>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-sans text-ink/60 mb-1.5 block">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gold/30 p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-maroon"
      />
    </label>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-sans text-ink/60 mb-1.5 block">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gold/30 p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-maroon"
      />
    </label>
  );
}
