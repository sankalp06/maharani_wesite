import { prisma } from "@/lib/prisma";

export async function getNavCategories() {
  try {
    return await prisma.category.findMany({
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
    });
  } catch {
    return [];
  }
}

export async function getSiteSettings() {
  try {
    return await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  } catch {
    return null;
  }
}

export async function getAllCategoriesFull() {
  try {
    return await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        subCategories: {
          orderBy: { order: "asc" },
          include: { _count: { select: { products: true } } },
        },
      },
    });
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug },
      include: {
        subCategories: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function getSubCategory(categorySlug: string, subCategorySlug: string) {
  try {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) return null;
    const subCategory = await prisma.subCategory.findFirst({
      where: { slug: subCategorySlug, categoryId: category.id },
    });
    if (!subCategory) return null;
    const products = await prisma.product.findMany({
      where: { subCategoryId: subCategory.id, isActive: true },
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
    return { category, subCategory, products };
  } catch {
    return null;
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        images: { orderBy: { order: "asc" } },
        subCategory: { include: { category: true } },
      },
    });
  } catch {
    return null;
  }
}

export async function getTrendingProducts(limit = 8) {
  try {
    return await prisma.product.findMany({
      where: { isActive: true, isTrending: true },
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getLatestProducts(limit = 8) {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}
