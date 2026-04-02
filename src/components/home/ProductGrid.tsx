'use client';

import { motion } from 'framer-motion';
import type { Product, Category } from '@/types';
import { ProductCard } from '@/components/home/ProductCard';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export function ProductGrid({ products, categories }: ProductGridProps) {
  return (
    <div className="flex flex-col gap-16">
      {categories.map((category) => {
        const categoryProducts = products.filter(
          (p) => p.categoryName === category.name
        );

        if (categoryProducts.length === 0) return null;

        return (
          <section key={category.id} id={category.slug}>
            <h3 className="text-gradient text-2xl sm:text-3xl font-bold mb-8">
              {category.name}
            </h3>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
            >
              {categoryProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        );
      })}
    </div>
  );
}
