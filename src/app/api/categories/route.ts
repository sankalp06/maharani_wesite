import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { subCategories: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, image, hasCustomDesign } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Category name is required" }, { status: 400 });
  }

  const count = await prisma.category.count();
  const category = await prisma.category.create({
    data: {
      name,
      slug: slugify(name),
      description: description || null,
      image: image || null,
      hasCustomDesign: Boolean(hasCustomDesign),
      order: count,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
