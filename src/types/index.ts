export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  weight: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteSettings {
  shopName: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  currency: string;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type CategoryFormData = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;

// ============ Orders ============

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  weight: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date;
}

export interface CustomerSummary {
  customerName: string;
  customerPhone: string;
  totalOrders: number;
  totalAmount: number;
  lastOrderDate: Date;
}

export interface ProductOrderFrequency {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
  orderCount: number;
}
