import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { phone, email, address, instagram, facebook } = body;

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { phone, email, address, instagram, facebook },
    create: { id: "singleton", phone, email, address, instagram, facebook },
  });

  return NextResponse.json(settings);
}
