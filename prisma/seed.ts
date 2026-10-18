import { PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

const PLACEHOLDER = "/placeholder-product.svg";

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      phone: "+91 98765 43210",
      email: "hello@maharaniboutique.com",
      address: "Maharani Boutique, MG Road, Bengaluru, Karnataka",
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
    },
  });

  const categoryDefs = [
    {
      name: "Fashion",
      description: "Ethnic wear, sarees, lehengas and accessories — ready to wear or made to order.",
      hasCustomDesign: true,
      subCategories: [
        {
          name: "Sarees",
          products: [
            { name: "Banarasi Silk Saree", price: 6499, compareAtPrice: 7999, isTrending: true },
            { name: "Chiffon Printed Saree", price: 2499, compareAtPrice: null, isTrending: false },
          ],
        },
        {
          name: "Lehengas",
          products: [
            { name: "Bridal Embroidered Lehenga", price: 15999, compareAtPrice: 18999, isTrending: true },
          ],
        },
        {
          name: "Accessories",
          products: [
            { name: "Kundan Jewellery Set", price: 1899, compareAtPrice: null, isTrending: false },
          ],
        },
      ],
    },
    {
      name: "Decor",
      description: "Hand-picked home decor pieces with a royal, artisanal touch.",
      hasCustomDesign: false,
      subCategories: [
        {
          name: "Wall Hangings",
          products: [
            { name: "Brass Mandala Wall Art", price: 2299, compareAtPrice: null, isTrending: true },
          ],
        },
        {
          name: "Candles & Lanterns",
          products: [
            { name: "Hand-painted Lantern Set", price: 1499, compareAtPrice: 1799, isTrending: false },
          ],
        },
      ],
    },
    {
      name: "Art Work",
      description: "Original and custom artwork, paintings and illustrations made to order.",
      hasCustomDesign: true,
      subCategories: [
        {
          name: "Paintings",
          products: [
            { name: "Madhubani Canvas Painting", price: 3499, compareAtPrice: null, isTrending: true },
          ],
        },
        {
          name: "Portraits",
          products: [
            { name: "Custom Hand-painted Portrait", price: 2999, compareAtPrice: null, isTrending: false },
          ],
        },
      ],
    },
  ];

  for (let ci = 0; ci < categoryDefs.length; ci++) {
    const c = categoryDefs[ci];
    const category = await prisma.category.create({
      data: {
        name: c.name,
        slug: slugify(c.name),
        description: c.description,
        hasCustomDesign: c.hasCustomDesign,
        image: PLACEHOLDER,
        order: ci,
      },
    });

    for (let si = 0; si < c.subCategories.length; si++) {
      const s = c.subCategories[si];
      const subCategory = await prisma.subCategory.create({
        data: {
          name: s.name,
          slug: slugify(s.name),
          categoryId: category.id,
          image: PLACEHOLDER,
          order: si,
        },
      });

      for (const p of s.products) {
        await prisma.product.create({
          data: {
            name: p.name,
            slug: `${slugify(p.name)}-${Math.random().toString(36).slice(2, 7)}`,
            description: `${p.name} — a beautiful handpicked piece from Maharani Boutique's ${c.name} collection. Crafted with care and attention to detail.`,
            price: p.price,
            compareAtPrice: p.compareAtPrice,
            stock: 25,
            isTrending: p.isTrending,
            subCategoryId: subCategory.id,
            images: { create: [{ url: PLACEHOLDER, order: 0 }] },
          },
        });
      }
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
