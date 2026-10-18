"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const totalAmount = useCartStore((s) => s.totalAmount());
  const clear = useCartStore((s) => s.clear);
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!form.customerName || !form.phone || !form.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.name,
            unitPrice: i.price,
            quantity: i.quantity,
            customDesignImage: i.customDesign?.image || null,
            customDesignDescription: i.customDesign?.description || null,
          })),
          totalAmount,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      clear();
      router.push(`/order-confirmation/${data.orderNumber}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Reveal>
        <h1 className="font-serif text-3xl text-maroon">Checkout</h1>
        <div className="gold-divider w-20 mt-3 mb-8" />
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name *" value={form.customerName} onChange={(v) => update("customerName", v)} />
            <Field label="Phone Number *" value={form.phone} onChange={(v) => update("phone", v)} type="tel" />
          </div>
          <Field label="Email" value={form.email} onChange={(v) => update("email", v)} type="email" />
          <Field label="Delivery Address *" value={form.address} onChange={(v) => update("address", v)} textarea />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="City" value={form.city} onChange={(v) => update("city", v)} />
            <Field label="State" value={form.state} onChange={(v) => update("state", v)} />
            <Field label="Pincode" value={form.pincode} onChange={(v) => update("pincode", v)} />
          </div>
          <Field label="Order Notes" value={form.notes} onChange={(v) => update("notes", v)} textarea />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-maroon text-cream py-3 rounded-full text-sm font-sans hover:bg-maroon-dark disabled:opacity-50 transition-colors"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="border border-gold/30 rounded-xl p-6 h-fit bg-blush/20">
          <h2 className="font-serif text-lg text-maroon mb-4">Order Summary</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.key} className="flex justify-between text-sm text-ink/70">
                <span className="line-clamp-1 max-w-[65%]">{item.name} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="gold-divider my-4" />
          <div className="flex justify-between font-serif text-maroon text-lg">
            <span>Total</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-sans text-ink/60 mb-1 block">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gold/30 p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-maroon"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gold/30 p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-maroon"
        />
      )}
    </label>
  );
}
