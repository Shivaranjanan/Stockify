import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Product, StockContextType } from '../types';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider = ({ children }: { children?: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setProducts([]);
      return;
    }

    const q = query(collection(db, 'products'), orderBy('lastUpdated', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData: Product[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        productsData.push({
          id: doc.id,
          name: data.name,
          sku: data.sku,
          category: data.category,
          price: data.price,
          quantity: data.quantity,
          minThreshold: data.minThreshold,
          supplier: data.supplier,
          imageUrl: data.imageUrl,
          lastUpdated: data.lastUpdated
        });
      });
      setProducts(productsData);
    }, (error) => {
      console.error('Error fetching products:', error);
    });

    return () => unsubscribe();
  }, [user]);

  const addProduct = async (newProductData: Omit<Product, 'id' | 'lastUpdated'>): Promise<boolean> => {
    try {
      const newDocRef = doc(collection(db, 'products'));
      const productData = {
        id: newDocRef.id,
        name: newProductData.name,
        sku: newProductData.sku,
        category: newProductData.category,
        price: newProductData.price,
        quantity: newProductData.quantity,
        minThreshold: newProductData.minThreshold,
        supplier: newProductData.supplier || '',
        imageUrl: newProductData.imageUrl || '',
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      await setDoc(newDocRef, productData);
      return true;
    } catch (err: any) {
      console.error('Error adding product:', err);
      toast.error(`Failed to add product: ${err.message || JSON.stringify(err)}`);
      return false;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    try {
      const docRef = doc(db, 'products', id);
      const dbUpdates: any = { ...updates };
      dbUpdates.lastUpdated = new Date().toISOString();

      await updateDoc(docRef, dbUpdates);
      return true;
    } catch (err: any) {
      console.error('Error updating product:', err);
      toast.error(err.message || 'Failed to update product');
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
    }
  };

  const stats = useMemo(() => {
    return {
      totalValue: products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0),
      lowStockCount: products.filter(p => p.quantity <= p.minThreshold).length,
      totalItems: products.reduce((acc, curr) => acc + curr.quantity, 0),
      categoriesCount: new Set(products.map(p => p.category)).size
    };
  }, [products]);

  return (
    <StockContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, stats }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};