'use client';

import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils/formatPrice';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { showToast } from '@/components/ui/Toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const cartItem = useCartStore((state) =>
    state.items.find((i) => i.product.id === product.id)
  );
  const quantity = mounted ? (cartItem?.quantity ?? 0) : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAdd = () => {
    addItem(product);
    if (quantity === 0) {
      showToast(`تم إضافة ${product.name} للسلة`, 'success');
    }
  };

  const handleDecrease = () => {
    if (quantity <= 1) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group rounded-2xl border border-[#d4a574]/10 bg-[#1a1a2e]/60 backdrop-blur-sm
                 overflow-hidden transition-all duration-300 glow-hover flex flex-col"
    >
      {/* Image */}
      <div className="img-zoom relative h-32 sm:h-48 bg-[#0a0a0a]">
        <ImageWithFallback
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-4 gap-2 sm:gap-3">
        <div className="flex-1">
          <h3 className="font-bold text-white text-sm sm:text-lg leading-tight mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-[#a0a0b0]">{product.weight}</p>
        </div>

        <span className="inline-block self-start bg-[#d4a574]/15 text-[#d4a574] font-bold text-sm px-3 py-1 rounded-lg">
          {formatPrice(product.price)}
        </span>

        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            className="bg-gradient-gold text-[#0a0a0a] font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl
                       w-full hover:shadow-[0_0_20px_rgba(212,165,116,0.4)] transition-all duration-300
                       hover:scale-105 active:scale-95"
          >
            إضافة للسلة
          </button>
        ) : (
          <div className="flex items-center justify-between bg-[#0a0a0a]/60 rounded-xl border border-[#d4a574]/20 overflow-hidden">
            <button
              onClick={handleDecrease}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-[#d4a574] font-bold text-lg hover:bg-[#d4a574]/10 transition-colors"
            >
              −
            </button>
            <span className="text-white font-bold text-sm sm:text-base min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={handleAdd}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-[#d4a574] font-bold text-lg hover:bg-[#d4a574]/10 transition-colors"
            >
              +
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
});
