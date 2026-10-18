import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } }, subCategory: { include: { category: true } } },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  const data: Record<string, unknown> = {};
  if (name !== undefined) {
    data.name = name;
    data.slug = `${slugify(name)}-${Math.random().toString(36).slice(2, 7)}`;
  }
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = Number(price);
  if (compareAtPrice !== undefined) data.compareAtPrice = compareAtPrice ? Number(compareAtPrice) : null;
  if (stock !== undefined) data.stock = Number(stock);
  if (subCategoryId !== undefined) data.subCategoryId = subCategoryId;
  if (isTrending !== undefined) data.isTrending = Boolean(isTrending);
  if (isActive !== undefined) data.isActive = Boolean(isActive);

  if (Array.isArray(images)) {
    await prisma.productImage.deleteMany({ where: { productId: id } });
    data.images = { create: images.map((url: string, i: number) => ({ url, order: i })) };
  }

  const product = await prisma.product.update({
    where: { id },
    data,
    include: { images: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
