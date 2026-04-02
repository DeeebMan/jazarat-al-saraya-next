'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { IoLockClosedOutline } from 'react-icons/io5';
import { loginAdmin } from '@/lib/firebase/auth';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';
import { SHOP_NAME } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/admin/products');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      showToast('يرجى إدخال كلمة المرور', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await loginAdmin('admin@alsaraya.com', password);
      showToast('تم تسجيل الدخول بنجاح', 'success');
      router.push('/admin/products');
    } catch (error: unknown) {
      const message =
        error instanceof Error && error.message.includes('auth/')
          ? 'كلمة المرور غير صحيحة'
          : 'حدث خطأ أثناء تسجيل الدخول';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#d4a574]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#16213e]/40 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' as const }}
        className="relative w-full max-w-md"
      >
        {/* Glass card */}
        <div className="bg-[#1a1a2e]/80 backdrop-blur-xl rounded-3xl border border-[#d4a574]/20 shadow-2xl shadow-black/50 p-8">
          {/* Logo & shop name */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative w-24 h-24 mb-4"
            >
              <Image
                src="/images/logo.png"
                alt={SHOP_NAME}
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(212,165,116,0.3)]"
              />
            </motion.div>
            <h1 className="text-2xl font-bold text-[#d4a574]">{SHOP_NAME}</h1>
            <p className="text-[#a0a0b0] text-sm mt-1">لوحة تحكم الإدارة</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#a0a0b0]">
                كلمة المرور
              </label>
              <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0a0b0]">
                  <IoLockClosedOutline size={20} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-12 pl-4 py-3 rounded-xl bg-[#0a0a0a] border-2 border-white/10 text-white placeholder-[#a0a0b0]/50 focus:outline-none focus:border-[#d4a574] transition-colors duration-300"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full text-lg py-3"
            >
              تسجيل الدخول
            </Button>
          </form>
        </div>

        {/* Bottom note */}
        <p className="text-center text-[#a0a0b0]/50 text-xs mt-6">
          {SHOP_NAME} &copy; {new Date().getFullYear()} - جميع الحقوق محفوظة
        </p>
      </motion.div>
    </div>
  );
}
