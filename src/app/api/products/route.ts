import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const subCategoryId = req.nextUrl.searchParams.get("subCategoryId");
  const products = await prisma.product.findMany({
    where: subCategoryId ? { subCategoryId } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { order: "asc" } },
      subCategory: { include: { category: true } },
    },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    name,
    description,
    price,
    compareAtPrice,
    stock,
    subCategoryId,
    images,
    isTrending,
    isActive,
  } = body;

  if (!name || !description || price === undefined || !subCategoryId) {
    return NextResponse.json(
      { error: "Name, description, price and sub-category are required" },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug: `${slugify(name)}-${Math.random().toString(36).slice(2, 7)}`,
      description,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      stock: stock !== undefined ? Number(stock) : 0,
      subCategoryId,
      isTrending: Boolean(isTrending),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      images: {
        create: (images || []).map((url: string, i: number) => ({ url, order: i })),
      },
    },
    include: { images: true },
  });

  return NextResponse.json(product, { status: 201 });
}
