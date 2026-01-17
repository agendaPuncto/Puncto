import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
  Timestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, MenuCategory } from '@/types/restaurant';

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'menuCategories';

/**
 * Get all products for a business
 */
export async function getProducts(businessId: string): Promise<Product[]> {
  const productsRef = collection(db, 'businesses', businessId, PRODUCTS_COLLECTION);
  const q = query(productsRef, orderBy('displayOrder', 'asc'), orderBy('name', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Product[];
}

/**
 * Get products by category
 */
export async function getProductsByCategory(
  businessId: string,
  category: string
): Promise<Product[]> {
  const productsRef = collection(db, 'businesses', businessId, PRODUCTS_COLLECTION);
  const q = query(
    productsRef,
    where('category', '==', category),
    where('available', '==', true),
    orderBy('displayOrder', 'asc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as Product[];
}

/**
 * Get a single product
 */
export async function getProduct(businessId: string, productId: string): Promise<Product | null> {
  const productRef = doc(db, 'businesses', businessId, PRODUCTS_COLLECTION, productId);
  const productSnap = await getDoc(productRef);
  
  if (!productSnap.exists()) {
    return null;
  }
  
  return {
    id: productSnap.id,
    ...productSnap.data(),
    createdAt: productSnap.data().createdAt?.toDate() || new Date(),
    updatedAt: productSnap.data().updatedAt?.toDate() || new Date(),
  } as Product;
}

/**
 * Create a new product
 */
export async function createProduct(businessId: string, product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const productsRef = collection(db, 'businesses', businessId, PRODUCTS_COLLECTION);
  const now = Timestamp.now();
  
  const docRef = await addDoc(productsRef, {
    ...product,
    createdAt: now,
    updatedAt: now,
  });
  
  return docRef.id;
}

/**
 * Update a product
 */
export async function updateProduct(
  businessId: string,
  productId: string,
  updates: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const productRef = doc(db, 'businesses', businessId, PRODUCTS_COLLECTION, productId);
  
  await updateDoc(productRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Delete a product
 */
export async function deleteProduct(businessId: string, productId: string): Promise<void> {
  const productRef = doc(db, 'businesses', businessId, PRODUCTS_COLLECTION, productId);
  await deleteDoc(productRef);
}

/**
 * Get all menu categories
 */
export async function getMenuCategories(businessId: string): Promise<MenuCategory[]> {
  const categoriesRef = collection(db, 'businesses', businessId, CATEGORIES_COLLECTION);
  const q = query(categoriesRef, where('active', '==', true), orderBy('displayOrder', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  })) as MenuCategory[];
}

/**
 * Create a menu category
 */
export async function createMenuCategory(
  businessId: string,
  category: Omit<MenuCategory, 'id' | 'businessId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const categoriesRef = collection(db, 'businesses', businessId, CATEGORIES_COLLECTION);
  const now = Timestamp.now();
  
  const docRef = await addDoc(categoriesRef, {
    ...category,
    businessId,
    createdAt: now,
    updatedAt: now,
  });
  
  return docRef.id;
}

/**
 * Update a menu category
 */
export async function updateMenuCategory(
  businessId: string,
  categoryId: string,
  updates: Partial<Omit<MenuCategory, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const categoryRef = doc(db, 'businesses', businessId, CATEGORIES_COLLECTION, categoryId);
  
  await updateDoc(categoryRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Delete a menu category
 */
export async function deleteMenuCategory(businessId: string, categoryId: string): Promise<void> {
  const categoryRef = doc(db, 'businesses', businessId, CATEGORIES_COLLECTION, categoryId);
  await deleteDoc(categoryRef);
}
