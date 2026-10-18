import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getNavCategories, getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [categories, settings] = await Promise.all([getNavCategories(), getSiteSettings()]);

  return (
    <>
      <Header categories={categories} phone={settings?.phone} />
      <main className="flex-1">{children}</main>
      <Footer
        phone={settings?.phone}
        email={settings?.email}
        instagram={settings?.instagram}
        facebook={settings?.facebook}
      />
    </>
  );
}
