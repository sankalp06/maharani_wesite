import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, description, image, hasCustomDesign, isActive, order } = body;

  const data: Record<string, unknown> = {};
  if (name !== undefined) {
    data.name = name;
    data.slug = slugify(name);
  }
  if (description !== undefined) data.description = description;
  if (image !== undefined) data.image = image;
  if (hasCustomDesign !== undefined) data.hasCustomDesign = Boolean(hasCustomDesign);
  if (isActive !== undefined) data.isActive = Boolean(isActive);
  if (order !== undefined) data.order = Number(order);

  const category = await prisma.category.update({ where: { id }, data });
  return NextResponse.json(category);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
