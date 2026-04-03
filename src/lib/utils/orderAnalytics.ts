import type { Order, CustomerSummary, ProductOrderFrequency } from '@/types';

export function getCustomersSummary(orders: Order[]): CustomerSummary[] {
  const map = new Map<string, CustomerSummary>();

  for (const order of orders) {
    const phone = order.customerPhone;
    const existing = map.get(phone);

    if (existing) {
      existing.totalOrders += 1;
      existing.totalAmount += order.totalAmount;
      if (order.createdAt > existing.lastOrderDate) {
        existing.customerName = order.customerName;
        existing.lastOrderDate = order.createdAt;
      }
    } else {
      map.set(phone, {
        customerName: order.customerName,
        customerPhone: phone,
        totalOrders: 1,
        totalAmount: order.totalAmount,
        lastOrderDate: order.createdAt,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalOrders - a.totalOrders);
}

export function getMostOrderedProducts(orders: Order[]): ProductOrderFrequency[] {
  const map = new Map<string, ProductOrderFrequency>();
  const orderSets = new Map<string, Set<string>>();

  for (const order of orders) {
    for (const item of order.items) {
      const existing = map.get(item.productId);

      if (existing) {
        existing.totalQuantity += item.quantity;
        existing.totalRevenue += item.price * item.quantity;
        orderSets.get(item.productId)!.add(order.id);
      } else {
        map.set(item.productId, {
          productId: item.productId,
          productName: item.productName,
          totalQuantity: item.quantity,
          totalRevenue: item.price * item.quantity,
          orderCount: 0,
        });
        orderSets.set(item.productId, new Set([order.id]));
      }
    }
  }

  for (const [productId, freq] of map) {
    freq.orderCount = orderSets.get(productId)!.size;
  }

  return Array.from(map.values()).sort((a, b) => b.totalQuantity - a.totalQuantity);
}

export function filterOrdersByMonth(orders: Order[], year: number, month: number): Order[] {
  return orders.filter((order) => {
    const d = order.createdAt;
    return d.getFullYear() === year && d.getMonth() === month;
  });
}
