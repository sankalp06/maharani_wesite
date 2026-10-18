import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { InstagramIcon, FacebookIcon } from "@/components/icons/SocialIcons";

export function Footer({
  phone,
  email,
  instagram,
  facebook,
}: {
  phone?: string | null;
  email?: string | null;
  instagram?: string | null;
  facebook?: string | null;
}) {
  return (
    <footer className="bg-maroon text-cream mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <Logo tone="light" />
          <p className="mt-4 text-sm text-cream/70 max-w-xs">
            Timeless ethnic & custom couture, handcrafted with royal detail for every occasion.
          </p>
          <div className="flex gap-3 mt-4">
            {instagram && (
              <a href={instagram} target="_blank" rel="noreferrer" className="hover:text-gold">
                <InstagramIcon size={18} />
              </a>
            )}
            {facebook && (
              <a href={facebook} target="_blank" rel="noreferrer" className="hover:text-gold">
                <FacebookIcon size={18} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-serif text-gold text-lg mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><Link href="/" className="hover:text-gold">Home</Link></li>
            <li><Link href="/cart" className="hover:text-gold">My Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-gold text-lg mb-3">Contact Us</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            {phone && (
              <li className="flex items-center gap-2">
                <Phone size={14} /> <a href={`tel:${phone}`} className="hover:text-gold">{phone}</a>
              </li>
            )}
            {email && (
              <li className="flex items-center gap-2">
                <Mail size={14} /> <a href={`mailto:${email}`} className="hover:text-gold">{email}</a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/15 py-4 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} Maharani Boutique. All rights reserved.
      </div>
    </footer>
  );
}
