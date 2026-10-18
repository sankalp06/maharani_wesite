import Link from "next/link";
import { LayoutGrid, Package, ClipboardList, Settings } from "lucide-react";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Admin | Maharani Boutique" };

const navItems = [
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#FAF7F3]">
      <aside className="w-64 bg-maroon text-cream flex flex-col shrink-0 hidden sm:flex">
        <div className="p-6 border-b border-cream/15">
          <Logo tone="light" />
          <span className="block mt-1 text-[10px] uppercase tracking-wide-xl text-cream/50">
            Admin Panel
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-sans text-cream/80 hover:bg-cream/10 hover:text-cream transition-colors"
            >
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-cream/15">
          <Link href="/" className="text-xs text-cream/50 hover:text-gold flex items-center gap-2">
            <LayoutGrid size={13} /> View Storefront
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="sm:hidden bg-maroon text-cream p-4 flex items-center justify-between">
          <Logo tone="light" />
        </div>
        <div className="sm:hidden flex overflow-x-auto bg-maroon-dark text-cream">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-1.5 px-4 py-2.5 text-xs whitespace-nowrap">
              <Icon size={13} /> {label}
            </Link>
          ))}
        </div>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
