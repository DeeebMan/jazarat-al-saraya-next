import { CartItem, CustomerInfo } from '@/types';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export function buildWhatsAppMessage(
  items: CartItem[],
  customer: CustomerInfo,
  total: number,
  currency: string = 'جنيه'
): string {
  const lines: string[] = [];

  lines.push('*\u{1F969} طلب جديد - جزارة السرايا \u{1F969}*');
  lines.push('');
  lines.push('\u{1F6D2} *المنتجات:*');
  lines.push('');

  items.forEach((item, index) => {
    const itemTotal = item.product.price * item.quantity;
    lines.push(`${index + 1}. ${item.product.name}`);
    lines.push(`   ${item.product.weight} x ${item.quantity} = ${item.quantity} ${item.product.weight}`);
    lines.push(`   ${item.product.price} ${currency} x ${item.quantity} = *${itemTotal} ${currency}*`);
    lines.push('');
  });

  lines.push(`\u{1F4B0} *الاجمالي: ${total} ${currency}*`);
  lines.push('');
  lines.push('\u{1F464} *بيانات العميل:*');
  lines.push(`\u{1F4CD} الاسم: ${customer.name}`);
  lines.push(`\u{1F4DE} الهاتف: ${customer.phone}`);
  lines.push(`\u{1F3E0} العنوان: ${customer.address}`);
  lines.push('');
  lines.push(`\u{23F0} ${new Date().toLocaleString('ar-EG')}`);
  lines.push('');
  lines.push('\u{2B50} *شكرا لاختياركم جزارة السرايا* \u{2B50}');

  return lines.join('\n');
}

export function sendWhatsAppOrder(
  items: CartItem[],
  customer: CustomerInfo,
  total: number,
  currency: string = 'جنيه'
): void {
  const message = buildWhatsAppMessage(items, customer, total, currency);
  const encoded = encodeURIComponent(message);

  // Mobile: use api.whatsapp.com (opens WhatsApp app directly with emojis working)
  // Desktop: use web.whatsapp.com (browser handles emoji encoding correctly)
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const url = isMobile
    ? `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encoded}`
    : `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encoded}`;

  window.open(url, '_blank');
}
