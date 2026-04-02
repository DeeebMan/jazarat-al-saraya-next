'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IoAddOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoListOutline,
  IoLayersOutline,
} from 'react-icons/io5';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { showToast } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';
import {
  onCategoriesSnapshot,
  onProductsSnapshot,
  addCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/firebase/firestore';
import type { Category, Product } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formOrder, setFormOrder] = useState('');

  useEffect(() => {
    const unsubCats = onCategoriesSnapshot((data) => {
      setCategories(data);
      setLoading(false);
    });
    const unsubProds = onProductsSnapshot((data) => {
      setProducts(data);
    });
    return () => {
      unsubCats();
      unsubProds();
    };
  }, []);

  // Count products per category
  const productCountMap: Record<string, number> = {};
  products.forEach((p) => {
    productCountMap[p.categoryName] = (productCountMap[p.categoryName] || 0) + 1;
  });

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormOrder('');
  };

  const openAddModal = () => {
    setEditingCategory(null);
    resetForm();
    setFormOrder(String(categories.length + 1));
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormDescription(category.description);
    setFormOrder(category.order.toString());
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      showToast('يرجى إدخال اسم الفئة', 'error');
      return;
    }

    setSaving(true);
    try {
      const slug = formName.replace(/\s+/g, '-').toLowerCase();
      const data = {
        name: formName,
        slug,
        description: formDescription,
        order: Number(formOrder) || categories.length + 1,
        isActive: true,
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        showToast('تم تحديث الفئة بنجاح', 'success');
      } else {
        await addCategory(data);
        showToast('تم إضافة الفئة بنجاح', 'success');
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
      await deleteCategory(deleteTarget.id);
      showToast('تم حذف الفئة بنجاح', 'success');
    } catch (error) {
      showToast('حدث خطأ أثناء الحذف', 'error');
      console.error(error);
    }
    setDeleteTarget(null);
  };

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

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
          <h1 className="text-2xl font-bold text-white">إدارة الفئات</h1>
          <p className="text-[#a0a0b0] text-sm mt-1">تنظيم فئات المنتجات وترتيبها</p>
        </div>
        <Button onClick={openAddModal}>
          <IoAddOutline size={20} />
          إضافة فئة جديدة
        </Button>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#1a1a2e]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 inline-flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-[#d4a574]/10 flex items-center justify-center">
          <IoLayersOutline className="text-[#d4a574]" size={22} />
        </div>
        <div>
          <p className="text-[#a0a0b0] text-xs">إجمالي الفئات</p>
          <p className="text-2xl font-bold text-white">{categories.length}</p>
        </div>
      </motion.div>

      {/* Categories Grid */}
      {sortedCategories.length === 0 ? (
        <div className="text-center py-16">
          <IoListOutline size={48} className="text-[#a0a0b0]/30 mx-auto mb-4" />
          <p className="text-[#a0a0b0]">لا توجد فئات بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#1a1a2e]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 group hover:border-[#d4a574]/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4a574]/20 to-[#d4a574]/5 flex items-center justify-center text-[#d4a574] font-bold text-sm border border-[#d4a574]/20">
                    {category.order}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{category.name}</h3>
                    <p className="text-[#a0a0b0] text-xs mt-0.5">{category.description || 'بدون وصف'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 bg-[#0a0a0a]/50 rounded-lg px-3 py-2">
                <IoLayersOutline size={14} className="text-[#a0a0b0]" />
                <span className="text-xs text-[#a0a0b0]">{productCountMap[category.name] || 0} منتج</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(category)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#d4a574]/10 text-[#d4a574] hover:bg-[#d4a574]/20 text-xs font-medium transition-colors cursor-pointer"
                >
                  <IoCreateOutline size={16} />
                  تعديل
                </button>
                <button
                  onClick={() => setDeleteTarget(category)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-colors cursor-pointer"
                >
                  <IoTrashOutline size={16} />
                  حذف
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
      >
        <div className="space-y-4">
          <Input label="اسم الفئة" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="مثال: قطعيات فاخرة" />
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[#a0a0b0]">الوصف</label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="وصف مختصر للفئة..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-[#0a0a0a] border-2 border-white/10 text-white placeholder-[#a0a0b0]/50 focus:outline-none focus:border-[#d4a574] transition-colors duration-300 resize-none"
            />
          </div>
          <Input label="الترتيب" type="number" value={formOrder} onChange={(e) => setFormOrder(e.target.value)} placeholder="1" dir="ltr" />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} isLoading={saving} className="flex-1">
              {editingCategory ? 'حفظ التعديلات' : 'إضافة الفئة'}
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
        title="حذف الفئة"
        message={`هل أنت متأكد من حذف فئة "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="تأكيد الحذف"
      />
    </div>
  );
}
