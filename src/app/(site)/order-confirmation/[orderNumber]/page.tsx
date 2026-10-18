import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  let order;
  try {
    order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });
  } catch {
    order = null;
  }

  if (!order) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <Reveal>
        <CheckCircle2 className="mx-auto text-emerald-600" size={44} />
        <h1 className="mt-4 font-serif text-3xl text-maroon">Thank You!</h1>
        <p className="mt-2 text-ink/70 font-sans">
          Your order <span className="font-semibold text-ink">{order.orderNumber}</span> has been placed.
          We&apos;ll reach out on {order.phone} with updates.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 text-left border border-gold/30 rounded-xl p-6 bg-blush/20">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1.5">
              <span className="text-ink/70">{item.productName} × {item.quantity}</span>
              <span className="text-ink">{formatPrice(item.lineTotal)}</span>
            </div>
          ))}
          <div className="gold-divider my-3" />
          <div className="flex justify-between font-serif text-maroon text-lg">
            <span>Total</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </Reveal>

      <Link href="/" className="mt-8 inline-block bg-maroon text-cream px-7 py-3 rounded-full text-sm font-sans">
        Continue Shopping
      </Link>
    </div>
  );
}
