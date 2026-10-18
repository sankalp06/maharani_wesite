export type CartCustomDesign = {
  image: string;
  description: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  subCategorySlug: string;
  categorySlug: string;
  customDesign?: CartCustomDesign | null;
  allowsCustomDesign: boolean;
};

export type ProductWithImages = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isTrending: boolean;
  isActive: boolean;
  images: { id: string; url: string; order: number }[];
  subCategoryId: string;
  subCategory?: {
    id: string;
    name: string;
    slug: string;
    category: { id: string; name: string; slug: string; hasCustomDesign: boolean };
  };
};
