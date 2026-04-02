import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import type { Product, Category, SiteSettings, ProductFormData, CategoryFormData } from '@/types';

// ============ Categories ============

export async function getCategories(): Promise<Category[]> {
  const q = query(collection(db, 'categories'), orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Category[];
}

export function onCategoriesSnapshot(callback: (categories: Category[]) => void): Unsubscribe {
  const q = query(collection(db, 'categories'), orderBy('order'));
  return onSnapshot(q, (snapshot) => {
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Category[];
    callback(categories);
  });
}

export async function addCategory(data: CategoryFormData): Promise<string> {
  const docRef = await addDoc(collection(db, 'categories'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateCategory(id: string, data: Partial<CategoryFormData>): Promise<void> {
  await updateDoc(doc(db, 'categories', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, 'categories', id));
}

// ============ Products ============

export async function getProducts(): Promise<Product[]> {
  const q = query(collection(db, 'products'), orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Product[];
}

export async function getActiveProducts(): Promise<Product[]> {
  const q = query(
    collection(db, 'products'),
    where('isActive', '==', true),
    orderBy('order')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Product[];
}

export function onProductsSnapshot(callback: (products: Product[]) => void): Unsubscribe {
  const q = query(collection(db, 'products'), orderBy('order'));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Product[];
    callback(products);
  });
}

export async function addProduct(data: ProductFormData): Promise<string> {
  const docRef = await addDoc(collection(db, 'products'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<ProductFormData>): Promise<void> {
  await updateDoc(doc(db, 'products', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
}

export async function updateProductsCategoryName(oldName: string, newName: string): Promise<void> {
  const q = query(collection(db, 'products'), where('categoryName', '==', oldName));
  const snapshot = await getDocs(q);
  const updates = snapshot.docs.map((d) =>
    updateDoc(doc(db, 'products', d.id), { categoryName: newName, updatedAt: serverTimestamp() })
  );
  await Promise.all(updates);
}

// ============ Settings ============

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const docSnap = await getDoc(doc(db, 'settings', 'site'));
  if (!docSnap.exists()) return null;
  return {
    ...docSnap.data(),
    updatedAt: docSnap.data().updatedAt?.toDate(),
  } as SiteSettings;
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<void> {
  await updateDoc(doc(db, 'settings', 'site'), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
