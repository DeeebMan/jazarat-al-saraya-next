'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoTrash, IoLogoWhatsapp } from 'react-icons/io5';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils/formatPrice';
import { sendWhatsAppOrder } from '@/lib/utils/buildWhatsAppUrl';
import { addOrder } from '@/lib/firebase/firestore';
import { showToast } from '@/components/ui/Toast';

export function CartSidebar() {
  const {
    items,
    isCartOpen,
    closeCart,
    customerInfo,
    setCustomerInfo,
    updateQuantity,
    removeItem,
    clearCart,
    getTotal,
  } = useCartStore();

  const total = getTotal();

  const handleCheckout = async () => {
    if (items.length === 0) {
      showToast('السلة فارغة!', 'error');
      return;
    }
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      showToast('برجاء إدخال الاسم والعنوان ورقم التليفون', 'error');
      return;
    }

    try {
      await addOrder({
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          weight: item.product.weight,
        })),
        totalAmount: total,
      });
    } catch (error) {
      console.error('Failed to save order:', error);
    }

    sendWhatsAppOrder(items, customerInfo, total);
    clearCart();
    showToast('تم إرسال الطلب عبر واتساب!');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-[#1a1a2e] border-l border-[#d4a574]/20 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-xl font-bold text-[#d4a574]">سلة الطلبات</h3>
              <button onClick={closeCart} className="p-2 rounded-lg hover:bg-white/10 text-[#a0a0b0] cursor-pointer">
                <IoClose size={24} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <p className="text-center text-[#a0a0b0] py-10">السلة فارغة</p>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-[#0a0a0a] border border-white/5"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{item.product.name}</h4>
                      <button onClick={() => removeItem(item.product.id)} className="text-red-400 hover:text-red-300 cursor-pointer">
                        <IoTrash size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-[#d4a574] mb-2">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-[#1a1a2e] text-[#d4a574] font-bold hover:bg-[#d4a574]/20 transition-colors cursor-pointer"
                      >-</button>
                      <span className="text-white font-semibold min-w-[2ch] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-[#1a1a2e] text-[#d4a574] font-bold hover:bg-[#d4a574]/20 transition-colors cursor-pointer"
                      >+</button>
                      <span className="mr-auto text-[#d4a574] font-bold">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 space-y-3 bg-[#16213e]">
              <Input
                placeholder="الاسم"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ name: e.target.value })}
              />
              <Input
                placeholder="العنوان"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ address: e.target.value })}
              />
              <Input
                placeholder="رقم التليفون"
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ phone: e.target.value })}
              />

              <div className="flex justify-between items-center text-lg font-bold pt-2">
                <span className="text-[#a0a0b0]">المجموع:</span>
                <span className="text-[#d4a574]">{formatPrice(total)}</span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                {items.length > 0 && (
                  <Button variant="danger" onClick={clearCart} size="sm">
                    <IoTrash /> تفريغ السلة
                  </Button>
                )}
                <Button variant="success" onClick={handleCheckout} size="lg">
                  <IoLogoWhatsapp size={22} /> إتمام الطلب عبر واتساب
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
