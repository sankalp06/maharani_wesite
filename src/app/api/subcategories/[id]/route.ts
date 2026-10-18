import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, image, isActive, order } = body;

  const data: Record<string, unknown> = {};
  if (name !== undefined) {
    data.name = name;
    data.slug = slugify(name);
  }
  if (image !== undefined) data.image = image;
  if (isActive !== undefined) data.isActive = Boolean(isActive);
  if (order !== undefined) data.order = Number(order);

  const subCategory = await prisma.subCategory.update({ where: { id }, data });
  return NextResponse.json(subCategory);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.subCategory.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
