import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Explicit payload types below work around a type-inference gap between
// @prisma/extension-accelerate and Prisma's `include`/`select` generics —
// the extended client's query methods lose the shape of nested relations,
// so we pin the expected shape manually instead of relying on inference.

type NavCategoryPayload = Prisma.CategoryGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    subCategories: { select: { id: true; name: true; slug: true } };
  };
}>;

export const getNavCategories = cache(async (): Promise<NavCategoryPayload[]> => {
  try {
    return (await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        subCategories: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          select: { id: true, name: true, slug: true },
        },
      },
    })) as unknown as NavCategoryPayload[];
  } catch {
    return [];
  }
});

export async function getSiteSettings() {
  try {
    return await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  } catch {
    return null;
  }
}

type CategoryFullPayload = Prisma.CategoryGetPayload<{
  include: {
    subCategories: { include: { _count: { select: { products: true } } } };
  };
}>;

export async function getAllCategoriesFull(): Promise<CategoryFullPayload[]> {
  try {
    return (await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        subCategories: {
          orderBy: { order: "asc" },
          include: { _count: { select: { products: true } } },
        },
      },
    })) as CategoryFullPayload[];
  } catch {
    return [];
  }
}

type CategoryWithSubCategoriesPayload = Prisma.CategoryGetPayload<{
  include: { subCategories: true };
}>;

export async function getCategoryBySlug(slug: string): Promise<CategoryWithSubCategoriesPayload | null> {
  try {
    return (await prisma.category.findUnique({
      where: { slug },
      include: {
        subCategories: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    })) as CategoryWithSubCategoriesPayload | null;
  } catch {
    return null;
  }
}

type ProductWithImagesPayload = Prisma.ProductGetPayload<{
  include: { images: true };
}>;

export async function getSubCategory(categorySlug: string, subCategorySlug: string) {
  try {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) return null;
    const subCategory = await prisma.subCategory.findFirst({
      where: { slug: subCategorySlug, categoryId: category.id },
    });
    if (!subCategory) return null;
    const products = (await prisma.product.findMany({
      where: { subCategoryId: subCategory.id, isActive: true },
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    })) as ProductWithImagesPayload[];
    return { category, subCategory, products };
  } catch {
    return null;
  }
}

type ProductWithCategoryPayload = Prisma.ProductGetPayload<{
  include: {
    images: true;
    subCategory: { include: { category: true } };
  };
}>;

export async function getProductBySlug(slug: string): Promise<ProductWithCategoryPayload | null> {
  try {
    return (await prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        images: { orderBy: { order: "asc" } },
        subCategory: { include: { category: true } },
      },
    })) as ProductWithCategoryPayload | null;
  } catch {
    return null;
  }
}

export async function getTrendingProducts(limit = 8): Promise<ProductWithImagesPayload[]> {
  try {
    return (await prisma.product.findMany({
      where: { isActive: true, isTrending: true },
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    })) as ProductWithImagesPayload[];
  } catch {
    return [];
  }
}

export async function getLatestProducts(limit = 8): Promise<ProductWithImagesPayload[]> {
  try {
    return (await prisma.product.findMany({
      where: { isActive: true },
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    })) as ProductWithImagesPayload[];
  } catch {
    return [];
  }
}

export async function searchProducts(query: string): Promise<ProductWithCategoryPayload[]> {
  if (!query.trim()) return [];
  try {
    return (await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        images: { orderBy: { order: "asc" } },
        subCategory: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 40,
    })) as ProductWithCategoryPayload[];
  } catch {
    return [];
  }
}
