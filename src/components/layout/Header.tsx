'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCartOutline, IoMenuOutline, IoCloseOutline } from 'react-icons/io5';
import { useCartStore } from '@/store/cartStore';
import { SHOP_NAME } from '@/lib/constants';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, getItemCount } = useCartStore();
  const itemCount = mounted ? getItemCount() : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: '#home', label: 'الرئيسية' },
    { href: '#menu', label: 'المنتجات' },
    { href: '#contact', label: 'اتصل بنا' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-[#d4a574]/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt={SHOP_NAME} width={45} height={45} priority className="rounded-lg" />
            <span className="text-xl font-bold text-gradient">{SHOP_NAME}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#a0a0b0] hover:text-[#d4a574] transition-colors font-semibold"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleCart}
              className="relative p-2.5 rounded-xl bg-[#1a1a2e] border border-[#d4a574]/20 hover:border-[#d4a574]/50 transition-colors cursor-pointer"
            >
              <IoCartOutline size={22} className="text-[#d4a574]" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-[#1a1a2e] border border-[#d4a574]/20 text-[#d4a574] cursor-pointer"
            >
              {isMobileMenuOpen ? <IoCloseOutline size={22} /> : <IoMenuOutline size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[73px] inset-x-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#d4a574]/10 md:hidden"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-[#a0a0b0] hover:text-[#d4a574] hover:bg-[#1a1a2e] transition-all font-semibold text-center"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
