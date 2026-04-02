'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartSidebar } from '@/components/layout/CartSidebar';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryTabs } from '@/components/home/CategoryTabs';
import { ProductGrid } from '@/components/home/ProductGrid';
import { ContactSection } from '@/components/home/ContactSection';
import { onProductsSnapshot, onCategoriesSnapshot } from '@/lib/firebase/firestore';
import { SHOP_NAME } from '@/lib/constants';
import type { Product, Category } from '@/types';

export function HomeContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dataReady, setDataReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    let productsLoaded = false;
    let categoriesLoaded = false;

    const checkReady = () => {
      if (productsLoaded && categoriesLoaded) setDataReady(true);
    };

    const unsubProducts = onProductsSnapshot((data) => {
      setProducts(data);
      productsLoaded = true;
      checkReady();
    });

    const unsubCategories = onCategoriesSnapshot((data) => {
      setCategories(data);
      categoriesLoaded = true;
      checkReady();
    });

    const timer = setTimeout(() => setShowSplash(false), 3000);

    return () => {
      unsubProducts();
      unsubCategories();
      clearTimeout(timer);
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
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center gap-6"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative w-32 h-32"
            >
              <Image
                src="/images/logo.png"
                alt={SHOP_NAME}
                fill
                className="object-contain drop-shadow-[0_0_30px_rgba(212,165,116,0.4)]"
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-3xl font-bold text-[#d4a574]"
            >
              {SHOP_NAME}
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <Header />
      <CartSidebar />

      <main className="flex-1">
        <HeroSection />

        <section id="menu" className="py-12">
          <CategoryTabs categories={categoryTabs} />

          <div className="max-w-7xl mx-auto px-4 mt-10">
            {!dataReady ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-3 border-[#d4a574] border-t-transparent rounded-full animate-spin" />
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
