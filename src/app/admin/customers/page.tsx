'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IoSearchOutline,
  IoReceiptOutline,
  IoPeopleOutline,
  IoCashOutline,
  IoCartOutline,
  IoCallOutline,
  IoLocationOutline,
  IoCalendarOutline,
} from 'react-icons/io5';
import { Modal } from '@/components/ui/Modal';
import { showToast } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';
import { formatPrice } from '@/lib/utils/formatPrice';
import { onOrdersSnapshot } from '@/lib/firebase/firestore';
import { getCustomersSummary, getMostOrderedProducts, filterOrdersByMonth } from '@/lib/utils/orderAnalytics';
import type { Order, CustomerSummary } from '@/types';

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchPhone, setSearchPhone] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [activeTab, setActiveTab] = useState<'customers' | 'products'>('customers');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);

  useEffect(() => {
    const unsub = onOrdersSnapshot((data) => {
      setOrders(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Available months from order data
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    for (const order of orders) {
      if (order.createdAt) {
        const y = order.createdAt.getFullYear();
        const m = order.createdAt.getMonth();
        months.add(`${y}-${m}`);
      }
    }
    return Array.from(months)
      .sort()
      .reverse()
      .map((key) => {
        const [y, m] = key.split('-').map(Number);
        const label = new Date(y, m).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' });
        return { value: key, label };
      });
  }, [orders]);

  // Filtered orders by month
  const filteredOrders = useMemo(() => {
    if (selectedMonth === 'all') return orders;
    const [y, m] = selectedMonth.split('-').map(Number);
    return filterOrdersByMonth(orders, y, m);
  }, [orders, selectedMonth]);

  // Customer summaries with phone search
  const customers = useMemo(() => {
    const all = getCustomersSummary(filteredOrders);
    if (!searchPhone.trim()) return all;
    return all.filter((c) => c.customerPhone.includes(searchPhone.trim()));
  }, [filteredOrders, searchPhone]);

  // Most ordered products
  const topProducts = useMemo(() => {
    return getMostOrderedProducts(filteredOrders);
  }, [filteredOrders]);

  // Stats
  const totalOrders = filteredOrders.length;
  const totalCustomers = customers.length;
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Orders for selected customer
  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return filteredOrders
      .filter((o) => o.customerPhone === selectedCustomer.customerPhone)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [filteredOrders, selectedCustomer]);

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
      <div>
        <h1 className="text-2xl font-bold text-white">تقارير العملاء</h1>
        <p className="text-[#a0a0b0] text-sm mt-1">
          بيانات العملاء واجمالي الطلبات والاصناف الاكثر طلبا
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1a2e]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4a574]/10 flex items-center justify-center">
              <IoReceiptOutline className="text-[#d4a574]" size={22} />
            </div>
            <div>
              <p className="text-[#a0a0b0] text-xs">اجمالي الطلبات</p>
              <p className="text-2xl font-bold text-white">{totalOrders}</p>
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
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <IoPeopleOutline className="text-blue-400" size={22} />
            </div>
            <div>
              <p className="text-[#a0a0b0] text-xs">عدد العملاء</p>
              <p className="text-2xl font-bold text-white">{totalCustomers}</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1a1a2e]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <IoCashOutline className="text-green-400" size={22} />
            </div>
            <div>
              <p className="text-[#a0a0b0] text-xs">اجمالي الايرادات</p>
              <p className="text-2xl font-bold text-white">{formatPrice(totalRevenue)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0a0b0]">
            <IoSearchOutline size={20} />
          </span>
          <input
            type="text"
            placeholder="بحث برقم التليفون..."
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="w-full pr-12 pl-4 py-3 rounded-xl bg-[#1a1a2e] border border-white/10 text-white placeholder-[#a0a0b0]/50 focus:outline-none focus:border-[#d4a574] transition-colors duration-300"
            dir="ltr"
          />
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-3 rounded-xl bg-[#1a1a2e] border border-white/10 text-white focus:outline-none focus:border-[#d4a574] transition-colors duration-300 cursor-pointer min-w-[180px]"
        >
          <option value="all">جميع الشهور</option>
          {availableMonths.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
            activeTab === 'customers'
              ? 'bg-[#d4a574]/10 text-[#d4a574] border border-[#d4a574]/20'
              : 'text-[#a0a0b0] hover:bg-white/5 hover:text-white border border-transparent'
          }`}
        >
          <IoPeopleOutline className="inline-block ml-1.5" size={18} />
          العملاء
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
            activeTab === 'products'
              ? 'bg-[#d4a574]/10 text-[#d4a574] border border-[#d4a574]/20'
              : 'text-[#a0a0b0] hover:bg-white/5 hover:text-white border border-transparent'
          }`}
        >
          <IoCartOutline className="inline-block ml-1.5" size={18} />
          الاكثر طلبا
        </button>
      </div>

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <>
          <p className="text-[#a0a0b0] text-sm">
            عرض {customers.length} عميل
          </p>
          {customers.length === 0 ? (
            <div className="text-center py-16">
              <IoPeopleOutline size={48} className="text-[#a0a0b0]/30 mx-auto mb-4" />
              <p className="text-[#a0a0b0]">
                {orders.length === 0 ? 'لا توجد طلبات بعد' : 'لا توجد نتائج مطابقة'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((customer, index) => (
                <motion.div
                  key={customer.customerPhone}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setSelectedCustomer(customer)}
                  className="bg-[#1a1a2e]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-[#d4a574]/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#d4a574]/10 flex items-center justify-center shrink-0">
                      <IoPeopleOutline className="text-[#d4a574]" size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-sm truncate">{customer.customerName}</h3>
                      <p className="text-[#a0a0b0] text-xs flex items-center gap-1 mt-0.5" dir="ltr">
                        <IoCallOutline size={12} />
                        {customer.customerPhone}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0a0a0a] rounded-xl p-3 text-center">
                      <p className="text-[#a0a0b0] text-[10px] mb-1">عدد الطلبات</p>
                      <p className="text-white font-bold">{customer.totalOrders}</p>
                    </div>
                    <div className="bg-[#0a0a0a] rounded-xl p-3 text-center">
                      <p className="text-[#a0a0b0] text-[10px] mb-1">الاجمالي</p>
                      <p className="text-[#d4a574] font-bold text-sm">{formatPrice(customer.totalAmount)}</p>
                    </div>
                  </div>
                  <p className="text-[#a0a0b0] text-[10px] mt-3 flex items-center gap-1">
                    <IoCalendarOutline size={11} />
                    اخر طلب: {customer.lastOrderDate?.toLocaleDateString('ar-EG')}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <>
          <p className="text-[#a0a0b0] text-sm">
            {topProducts.length} صنف تم طلبه
          </p>
          {topProducts.length === 0 ? (
            <div className="text-center py-16">
              <IoCartOutline size={48} className="text-[#a0a0b0]/30 mx-auto mb-4" />
              <p className="text-[#a0a0b0]">لا توجد طلبات بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <motion.div
                  key={product.productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-[#1a1a2e]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#d4a574]/10 flex items-center justify-center shrink-0">
                    <span className="text-[#d4a574] font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">{product.productName}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                      <span className="text-[#a0a0b0] text-xs">
                        الكمية: <span className="text-white font-semibold">{product.totalQuantity}</span>
                      </span>
                      <span className="text-[#a0a0b0] text-xs">
                        الطلبات: <span className="text-white font-semibold">{product.orderCount}</span>
                      </span>
                      <span className="text-[#a0a0b0] text-xs">
                        الايراد: <span className="text-[#d4a574] font-semibold">{formatPrice(product.totalRevenue)}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Customer Detail Modal */}
      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.customerName || ''}
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2 text-sm">
              <p className="text-[#a0a0b0] flex items-center gap-2" dir="ltr">
                <IoCallOutline size={16} className="text-[#d4a574]" />
                {selectedCustomer.customerPhone}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0a0a0a] rounded-xl p-3 text-center">
                <p className="text-[#a0a0b0] text-xs mb-1">عدد الطلبات</p>
                <p className="text-white font-bold text-lg">{selectedCustomer.totalOrders}</p>
              </div>
              <div className="bg-[#0a0a0a] rounded-xl p-3 text-center">
                <p className="text-[#a0a0b0] text-xs mb-1">اجمالي المبلغ</p>
                <p className="text-[#d4a574] font-bold text-lg">{formatPrice(selectedCustomer.totalAmount)}</p>
              </div>
            </div>

            <h4 className="text-white font-bold text-sm pt-2">سجل الطلبات</h4>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {customerOrders.map((order) => (
                <div key={order.id} className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#a0a0b0] text-xs flex items-center gap-1">
                      <IoCalendarOutline size={12} />
                      {order.createdAt?.toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-[#d4a574] font-bold text-sm">{formatPrice(order.totalAmount)}</span>
                  </div>
                  {order.customerAddress && (
                    <p className="text-[#a0a0b0] text-xs flex items-center gap-1 mb-2">
                      <IoLocationOutline size={12} />
                      {order.customerAddress}
                    </p>
                  )}
                  <div className="space-y-1.5">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-white">
                          {item.productName}
                          <span className="text-[#a0a0b0] mr-1">x{item.quantity}</span>
                          <span className="text-[#a0a0b0] mr-1">({item.weight})</span>
                        </span>
                        <span className="text-[#a0a0b0]">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
