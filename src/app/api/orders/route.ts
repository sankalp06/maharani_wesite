import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const orders = await prisma.order.findMany({
    where: status && status !== "ALL" ? { status: status as never } : undefined,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    customerName,
    phone,
    email,
    address,
    city,
    state,
    pincode,
    notes,
    items,
    totalAmount,
  } = body;

  if (!customerName || !phone || !address || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Missing required order details" }, { status: 400 });
  }

  let orderNumber = generateOrderNumber();
  for (let i = 0; i < 3; i++) {
    const existing = await prisma.order.findUnique({ where: { orderNumber } });
    if (!existing) break;
    orderNumber = generateOrderNumber();
  }

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName,
      phone,
      email: email || null,
      address,
      city: city || null,
      state: state || null,
      pincode: pincode || null,
      notes: notes || null,
      totalAmount: Number(totalAmount),
      items: {
        create: items.map(
          (item: {
            productId?: string;
            productName: string;
            unitPrice: number;
            quantity: number;
            customDesignImage?: string | null;
            customDesignDescription?: string | null;
          }) => ({
            productId: item.productId || null,
            productName: item.productName,
            unitPrice: Number(item.unitPrice),
            quantity: Number(item.quantity),
            lineTotal: Number(item.unitPrice) * Number(item.quantity),
            customDesignImage: item.customDesignImage || null,
            customDesignDescription: item.customDesignDescription || null,
          })
        ),
      },
    },
    include: { items: true },
  });

  return NextResponse.json(order, { status: 201 });
}
