import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maharani Boutique | Ethnic Wear & Custom Couture",
  description:
    "Maharani Boutique — royal ethnic wear, accessories, and bespoke custom-designed outfits crafted to order.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-cream text-ink">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2800,
            style: {
              background: "#2B1810",
              color: "#FDF8F2",
              border: "1px solid #C9A24B",
              borderRadius: "999px",
              padding: "10px 18px",
              fontSize: "13px",
              fontFamily: "var(--font-inter)",
            },
            success: {
              iconTheme: { primary: "#C9A24B", secondary: "#2B1810" },
            },
            error: {
              iconTheme: { primary: "#f87171", secondary: "#2B1810" },
            },
          }}
        />
      </body>
    </html>
  );
}
