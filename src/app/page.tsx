import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES } from '@/lib/constants';
import type { Product, Category } from '@/types';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartSidebar } from '@/components/layout/CartSidebar';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryTabs } from '@/components/home/CategoryTabs';
import { ProductGrid } from '@/components/home/ProductGrid';
import { ContactSection } from '@/components/home/ContactSection';

export const revalidate = 3600;

export default function HomePage() {
  const categories: Category[] = DEFAULT_CATEGORIES.map((cat, index) => ({
    id: `cat-${index}`,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    order: cat.order,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const products: Product[] = DEFAULT_PRODUCTS.map((p, index) => ({
    id: `prod-${index}`,
    name: p.name,
    price: p.price,
    weight: p.weight,
    description: p.description,
    imageUrl: p.image,
    categoryId: `cat-${DEFAULT_CATEGORIES.findIndex((c) => c.name === p.category)}`,
    categoryName: p.category,
    isActive: true,
    order: index,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const activeCategories = categories.filter((c) => c.isActive);
  const activeProducts = products.filter((p) => p.isActive);

  const categoryTabs = activeCategories.map((c) => ({
    name: c.name,
    slug: c.slug,
  }));

  return (
    <>
      <Header />
      <CartSidebar />

      <main className="flex-1">
        <HeroSection />

        <section id="menu" className="py-12">
          <CategoryTabs categories={categoryTabs} />

          <div className="max-w-7xl mx-auto px-4 mt-10">
            <ProductGrid products={activeProducts} categories={activeCategories} />
          </div>
        </section>

        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
