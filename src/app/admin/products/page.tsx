'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { motion } from 'framer-motion';
import {
  IoAddOutline,
  IoSearchOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoImageOutline,
  IoGridOutline,
  IoCheckmarkCircle,
} from 'react-icons/io5';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { showToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/utils/formatPrice';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import {
  onProductsSnapshot,
  onCategoriesSnapshot,
  addProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/firebase/firestore';
import type { Product, Category } from '@/types';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formWeight, setFormWeight] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImagePreview, setFormImagePreview] = useState('');

  // Real-time Firestore listeners
  useEffect(() => {
    const unsubProducts = onProductsSnapshot((data) => {
      setProducts(data);
      setLoading(false);
    });
    const unsubCategories = onCategoriesSnapshot((data) => {
      setCategories(data);
    });
    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, []);

  const categoryNames = categories.map((c) => c.name);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name.includes(searchQuery) ||
        p.description.includes(searchQuery);
      const matchCategory = !categoryFilter || p.categoryName === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;

  const resetForm = () => {
    setFormName('');
    setFormPrice('');
    setFormWeight('');
    setFormCategory('');
    setFormDescription('');
    setFormImagePreview('');
  };

  const openAddModal = () => {
    setEditingProduct(null);
    resetForm();
    setFormCategory(categoryNames[0] || '');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormPrice(product.price.toString());
    setFormWeight(product.weight);
    setFormCategory(product.categoryName);
    setFormDescription(product.description);
    setFormImagePreview(product.imageUrl);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      showToast('يرجى إدخال اسم المنتج', 'error');
      return;
    }
    if (!formPrice.trim() || isNaN(Number(formPrice))) {
      showToast('يرجى إدخال سعر صحيح', 'error');
      return;
    }
    if (!formWeight.trim()) {
      showToast('يرجى إدخال الوزن', 'error');
      return;
    }

    setSaving(true);
    try {
      const categoryObj = categories.find((c) => c.name === formCategory);
      const productData = {
        name: formName,
        price: Number(formPrice),
        weight: formWeight,
        description: formDescription,
        imageUrl: formImagePreview || PLACEHOLDER_IMAGE,
        categoryId: categoryObj?.id || '',
        categoryName: formCategory,
        isActive: true,
        order: editingProduct?.order ?? products.length + 1,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        showToast('تم تحديث المنتج بنجاح', 'success');
      } else {
        await addProduct(productData);
        showToast('تم إضافة المنتج بنجاح', 'success');
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      showToast('حدث خطأ أثناء الحفظ', 'error');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      showToast('تم حذف المنتج بنجاح', 'success');
    } catch (error) {
      showToast('حدث خطأ أثناء الحذف', 'error');
      console.error(error);
    }
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">إدارة المنتجات</h1>
          <p className="text-[#a0a0b0] text-sm mt-1">
            إضافة وتعديل وحذف المنتجات
          </p>
        </div>
        <Button onClick={openAddModal}>
          <IoAddOutline size={20} />
          إضافة منتج جديد
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1a2e]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4a574]/10 flex items-center justify-center">
              <IoGridOutline className="text-[#d4a574]" size={22} />
            </div>
            <div>
              <p className="text-[#a0a0b0] text-xs">إجمالي المنتجات</p>
              <p className="text-2xl font-bold text-white">{totalProducts}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1a1a2e]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <IoCheckmarkCircle className="text-green-400" size={22} />
            </div>
            <div>
              <p className="text-[#a0a0b0] text-xs">المنتجات النشطة</p>
              <p className="text-2xl font-bold text-white">{activeProducts}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0a0b0]">
            <IoSearchOutline size={20} />
          </span>
          <input
            type="text"
            placeholder="بحث عن منتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-12 pl-4 py-3 rounded-xl bg-[#1a1a2e] border border-white/10 text-white placeholder-[#a0a0b0]/50 focus:outline-none focus:border-[#d4a574] transition-colors duration-300"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-[#1a1a2e] border border-white/10 text-white focus:outline-none focus:border-[#d4a574] transition-colors duration-300 cursor-pointer min-w-[180px]"
        >
          <option value="">جميع الفئات</option>
          {categoryNames.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <p className="text-[#a0a0b0] text-sm">
        عرض {filteredProducts.length} من {totalProducts} منتج
      </p>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <IoGridOutline size={48} className="text-[#a0a0b0]/30 mx-auto mb-4" />
          <p className="text-[#a0a0b0]">لا توجد منتجات مطابقة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-[#1a1a2e]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group hover:border-[#d4a574]/30 transition-all duration-300"
            >
              <div className="relative h-40 bg-[#0a0a0a] overflow-hidden">
                <ImageWithFallback
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-[#d4a574]/90 text-[#0a0a0a] text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {product.categoryName}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-white text-sm truncate">{product.name}</h3>
                <p className="text-[#a0a0b0] text-xs mt-1 truncate">{product.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[#d4a574] font-bold text-sm">{formatPrice(product.price)}</span>
                  <span className="text-[#a0a0b0] text-xs">{product.weight}</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#d4a574]/10 text-[#d4a574] hover:bg-[#d4a574]/20 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <IoCreateOutline size={16} />
                    تعديل
                  </button>
                  <button
                    onClick={() => setDeleteTarget(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <IoTrashOutline size={16} />
                    حذف
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
      >
        <div className="space-y-4">
          <Input label="اسم المنتج" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="مثال: ريب آي ستيك" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="السعر (جنيه)" type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="0" dir="ltr" />
            <Input label="الوزن" value={formWeight} onChange={(e) => setFormWeight(e.target.value)} placeholder="1 كيلو" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#a0a0b0]">الفئة</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border-2 border-white/10 text-white focus:outline-none focus:border-[#d4a574] transition-colors duration-300 cursor-pointer"
            >
              {categoryNames.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#a0a0b0]">الوصف</label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="وصف المنتج..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border-2 border-white/10 text-white placeholder-[#a0a0b0]/50 focus:outline-none focus:border-[#d4a574] transition-colors duration-300 resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#a0a0b0]">صورة المنتج</label>
            <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-white/10 hover:border-[#d4a574]/30 bg-[#0a0a0a] cursor-pointer transition-colors duration-300">
              {formImagePreview ? (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <Image src={formImagePreview} alt="معاينة" fill sizes="96px" className="object-cover" />
                </div>
              ) : (
                <IoImageOutline size={32} className="text-[#a0a0b0]" />
              )}
              <span className="text-xs text-[#a0a0b0]">اضغط لاختيار صورة</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} isLoading={saving} className="flex-1">
              {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
            </Button>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              إلغاء
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="حذف المنتج"
        message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="تأكيد الحذف"
      />
    </div>
  );
}
