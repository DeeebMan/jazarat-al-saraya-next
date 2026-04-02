'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoGridOutline,
  IoListOutline,
  IoSettingsOutline,
  IoHomeOutline,
  IoLogOutOutline,
  IoMenuOutline,
  IoCloseOutline,
} from 'react-icons/io5';
import { useAuth } from '@/hooks/useAuth';
import { logoutAdmin } from '@/lib/firebase/auth';
import { Spinner } from '@/components/ui/Spinner';
import { showToast } from '@/components/ui/Toast';
import { SHOP_NAME } from '@/lib/constants';

const navLinks = [
  { href: '/admin/products', label: 'المنتجات', icon: IoGridOutline },
  { href: '/admin/categories', label: 'الفئات', icon: IoListOutline },
  { href: '/admin/settings', label: 'الإعدادات', icon: IoSettingsOutline },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router, pathname]);

  // If on login page, just render children without the layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-[#a0a0b0] text-sm">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      showToast('تم تسجيل الخروج بنجاح', 'success');
      router.push('/admin/login');
    } catch {
      showToast('حدث خطأ أثناء تسجيل الخروج', 'error');
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0a0a] flex">
      {/* Desktop Sidebar - Right side (RTL) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1a1a2e] border-l border-white/10 fixed right-0 top-0 bottom-0 z-40">
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-white/10">
          <div className="relative w-10 h-10 shrink-0">
            <Image
              src="/images/logo.png"
              alt={SHOP_NAME}
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#d4a574]">{SHOP_NAME}</h1>
            <p className="text-[10px] text-[#a0a0b0]">لوحة التحكم</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#d4a574]/10 text-[#d4a574] border border-[#d4a574]/20'
                    : 'text-[#a0a0b0] hover:bg-white/5 hover:text-white'
                }`}
              >
                <link.icon size={20} />
                <span>{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="mr-auto w-1.5 h-1.5 rounded-full bg-[#d4a574]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#a0a0b0] hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            <IoHomeOutline size={20} />
            <span>الصفحة الرئيسية</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full cursor-pointer"
          >
            <IoLogOutOutline size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#1a1a2e]/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image
                src="/images/logo.png"
                alt={SHOP_NAME}
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-sm font-bold text-[#d4a574]">{SHOP_NAME}</h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#a0a0b0] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <IoCloseOutline size={24} />
            ) : (
              <IoMenuOutline size={24} />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-white/10"
            >
              <nav className="p-3 space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-[#d4a574]/10 text-[#d4a574]'
                          : 'text-[#a0a0b0] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <link.icon size={20} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#a0a0b0] hover:bg-white/5 hover:text-white transition-all duration-200"
                >
                  <IoHomeOutline size={20} />
                  <span>الصفحة الرئيسية</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full cursor-pointer"
                >
                  <IoLogOutOutline size={20} />
                  <span>تسجيل الخروج</span>
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 lg:mr-64 min-h-screen">
        <div className="pt-16 lg:pt-0 p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
