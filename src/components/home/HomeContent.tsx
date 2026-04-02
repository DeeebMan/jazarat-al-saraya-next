'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartSidebar } from '@/components/layout/CartSidebar';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryTabs } from '@/components/home/CategoryTabs';
import { ProductGrid } from '@/components/home/ProductGrid';
import { ContactSection } from '@/components/home/ContactSection';
import { Spinner } from '@/components/ui/Spinner';
import { onProductsSnapshot, onCategoriesSnapshot } from '@/lib/firebase/firestore';
import type { Product, Category } from '@/types';

export function HomeContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let productsLoaded = false;
    let categoriesLoaded = false;

    const checkReady = () => {
      if (productsLoaded && categoriesLoaded) setLoading(false);
    };

    const unsubProducts = onProductsSnapshot((data) => {
      console.log('[HomeContent] Products from Firestore:', data.length, data.slice(0, 3).map(p => `${p.name}: ${p.price}`));
      setProducts(data);
      productsLoaded = true;
      checkReady();
    });

    const unsubCategories = onCategoriesSnapshot((data) => {
      setCategories(data);
      categoriesLoaded = true;
      checkReady();
    });

    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, []);

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
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : (
              <ProductGrid products={activeProducts} categories={activeCategories} />
            )}
          </div>
        </section>

        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
