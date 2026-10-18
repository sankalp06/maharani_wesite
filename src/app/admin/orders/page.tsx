"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp, Palette, Phone, Mail, MapPin } from "lucide-react";
import { formatPrice, ORDER_STATUSES, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatusType } from "@/lib/utils";

type OrderItem = {
  id: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  customDesignImage: string | null;
  customDesignDescription: string | null;
};

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string | null;
  address: string;
  city: string | null;
  state: string | null;
  pincode: string | null;
  notes: string | null;
  status: OrderStatusType;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | OrderStatusType>("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?status=${status}`);
      const data = await res.json();
      setOrders(data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  async function updateStatus(order: Order, status: OrderStatusType) {
    try {
      await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
      toast.success(`Order marked as ${ORDER_STATUS_LABELS[status]}`);
    } catch {
      toast.error("Failed to update status");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-serif text-2xl text-maroon">Orders</h1>
        <div className="flex gap-2 overflow-x-auto">
          {(["ALL", ...ORDER_STATUSES] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
                filter === status
                  ? "bg-maroon text-cream border-maroon"
                  : "border-gold/30 text-ink/60 hover:border-maroon"
              }`}
            >
              {status === "ALL" ? "All" : ORDER_STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-ink/50 text-sm">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="border border-dashed border-gold/40 rounded-xl p-10 text-center text-ink/50 text-sm">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isOpen = expanded === order.id;
            const hasCustom = order.items.some((i) => i.customDesignImage);
            return (
              <div key={order.id} className="bg-white rounded-xl border border-gold/20 overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="w-full flex items-center justify-between gap-4 p-4 text-left"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div>
                      <p className="font-sans text-sm font-semibold text-ink">{order.orderNumber}</p>
                      <p className="text-xs text-ink/50">
                        {order.customerName} · {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    {hasCustom && (
                      <span className="text-[10px] bg-gold/20 text-maroon-dark px-2 py-1 rounded-full flex items-center gap-1 shrink-0">
                        <Palette size={11} /> Custom Design
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-serif text-maroon">{formatPrice(order.totalAmount)}</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-gold/15 p-4 bg-blush/10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1 text-ink/70">
                        <p className="flex items-center gap-2"><Phone size={13} /> {order.phone}</p>
                        {order.email && <p className="flex items-center gap-2"><Mail size={13} /> {order.email}</p>}
                        <p className="flex items-start gap-2">
                          <MapPin size={13} className="mt-0.5" />
                          {order.address}
                          {order.city ? `, ${order.city}` : ""}
                          {order.state ? `, ${order.state}` : ""}
                          {order.pincode ? ` - ${order.pincode}` : ""}
                        </p>
                        {order.notes && <p className="italic text-ink/50">Note: {order.notes}</p>}
                      </div>

                      <div>
                        <span className="text-xs font-sans text-ink/50 mb-1.5 block">Update Status</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order, e.target.value as OrderStatusType)}
                          className="w-full rounded-lg border border-gold/30 p-2 text-sm bg-white"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {ORDER_STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-3 bg-white rounded-lg p-3 border border-gold/10">
                          {item.customDesignImage && (
                            <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden">
                              <Image src={item.customDesignImage} alt="Custom design reference" fill className="object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-ink">{item.productName}</span>
                              <span className="text-ink/70">{formatPrice(item.lineTotal)}</span>
                            </div>
                            <p className="text-xs text-ink/50">
                              Qty {item.quantity} × {formatPrice(item.unitPrice)}
                            </p>
                            {item.customDesignImage && (
                              <div className="mt-1 text-xs text-maroon-dark flex items-start gap-1">
                                <Palette size={12} className="mt-0.5 shrink-0" />
                                <span>{item.customDesignDescription || "Custom design requested — see reference image."}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
