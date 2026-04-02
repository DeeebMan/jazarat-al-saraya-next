'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IoSaveOutline, IoStorefrontOutline } from 'react-icons/io5';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showToast } from '@/components/ui/Toast';
import {
  SHOP_NAME,
  SHOP_PHONE,
  WHATSAPP_NUMBER,
  SHOP_ADDRESS,
  CURRENCY,
} from '@/lib/constants';

const CURRENCIES = [
  { value: 'جنيه', label: 'جنيه مصري (EGP)' },
  { value: 'ريال', label: 'ريال سعودي (SAR)' },
  { value: 'درهم', label: 'درهم إماراتي (AED)' },
  { value: 'دينار', label: 'دينار كويتي (KWD)' },
  { value: 'دولار', label: 'دولار أمريكي (USD)' },
];

export default function AdminSettingsPage() {
  const [shopName, setShopName] = useState(SHOP_NAME);
  const [phone, setPhone] = useState(SHOP_PHONE);
  const [whatsapp, setWhatsapp] = useState(WHATSAPP_NUMBER);
  const [address, setAddress] = useState(SHOP_ADDRESS);
  const [currency, setCurrency] = useState(CURRENCY);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!shopName.trim()) {
      showToast('يرجى إدخال اسم المتجر', 'error');
      return;
    }

    setIsSaving(true);

    // Simulate save (replace with updateSiteSettings when Firebase is connected)
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSaving(false);
    showToast('تم حفظ الإعدادات بنجاح', 'success');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">إعدادات المتجر</h1>
        <p className="text-[#a0a0b0] text-sm mt-1">
          تعديل المعلومات الأساسية للمتجر
        </p>
      </div>

      {/* Settings card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a1a2e]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:p-8"
      >
        {/* Card header */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-[#d4a574]/10 flex items-center justify-center">
            <IoStorefrontOutline className="text-[#d4a574]" size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">معلومات المتجر</h2>
            <p className="text-[#a0a0b0] text-xs">
              البيانات الأساسية التي تظهر في الموقع
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <Input
            label="اسم المتجر"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="اسم المتجر"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="رقم الهاتف"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="رقم الهاتف"
              dir="ltr"
            />
            <Input
              label="رقم الواتساب"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="رقم الواتساب"
              dir="ltr"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#a0a0b0]">
              العنوان
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="عنوان المتجر..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border-2 border-white/10 text-white placeholder-[#a0a0b0]/50 focus:outline-none focus:border-[#d4a574] transition-colors duration-300 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#a0a0b0]">
              العملة
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border-2 border-white/10 text-white focus:outline-none focus:border-[#d4a574] transition-colors duration-300 cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Save button */}
          <div className="pt-4 border-t border-white/10">
            <Button
              onClick={handleSave}
              isLoading={isSaving}
              className="min-w-[160px]"
            >
              <IoSaveOutline size={18} />
              حفظ الإعدادات
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
