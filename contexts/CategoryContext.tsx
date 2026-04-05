import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { toast } from 'sonner';

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

interface CategoryContextType {
  categories: Category[];
  addCategory: (name: string) => Promise<boolean>;
  updateCategory: (id: string, name: string) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthReady(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    const q = collection(db, 'categories');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats: Category[] = [];
      snapshot.forEach((doc) => {
        cats.push({ id: doc.id, ...doc.data() } as Category);
      });
      // Sort by name
      cats.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(cats);
    }, (error) => {
      console.error("Error fetching categories:", error);
    });

    return () => unsubscribe();
  }, [isAuthReady]);

  const addCategory = async (name: string) => {
    if (!name.trim()) return false;
    try {
      const newRef = doc(collection(db, 'categories'));
      await setDoc(newRef, {
        name: name.trim(),
        createdAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
      return false;
    }
  };

  const updateCategory = async (id: string, name: string) => {
    if (!name.trim()) return false;
    try {
      await updateDoc(doc(db, 'categories', id), {
        name: name.trim()
      });
      return true;
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
      return false;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
      return false;
    }
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
