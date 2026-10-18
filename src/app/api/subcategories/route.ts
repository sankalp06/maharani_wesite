import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const categoryId = req.nextUrl.searchParams.get("categoryId");
  const subCategories = await prisma.subCategory.findMany({
    where: categoryId ? { categoryId } : undefined,
    orderBy: { order: "asc" },
    include: { category: true, _count: { select: { products: true } } },
  });
  return NextResponse.json(subCategories);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, categoryId, image } = body;

  if (!name || !categoryId) {
    return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
  }

  const count = await prisma.subCategory.count({ where: { categoryId } });
  const subCategory = await prisma.subCategory.create({
    data: {
      name,
      slug: slugify(name),
      categoryId,
      image: image || null,
      order: count,
    },
  });

  return NextResponse.json(subCategory, { status: 201 });
}
