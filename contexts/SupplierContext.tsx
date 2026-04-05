import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Supplier, SupplierContextType } from '../types';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export const SupplierProvider = ({ children }: { children: ReactNode }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setSuppliers([]);
      return;
    }

    const q = query(collection(db, 'suppliers'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const suppliersData: Supplier[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        suppliersData.push({
          id: doc.id,
          name: data.name,
          contactPerson: data.contactPerson,
          email: data.email,
          phone: data.phone,
          address: data.address
        });
      });
      setSuppliers(suppliersData);
    }, (error) => {
      console.error('Error fetching suppliers:', error);
    });

    return () => unsubscribe();
  }, [user]);

  const addSupplier = async (supplierData: Omit<Supplier, 'id'>): Promise<boolean> => {
    try {
      const newDocRef = doc(collection(db, 'suppliers'));
      const data = {
        id: newDocRef.id,
        name: supplierData.name,
        contactPerson: supplierData.contactPerson || '',
        email: supplierData.email || '',
        phone: supplierData.phone || '',
        address: supplierData.address || '',
        createdAt: new Date().toISOString()
      };
      
      await setDoc(newDocRef, data);
      return true;
    } catch (err: any) {
      console.error('Error adding supplier:', err);
      toast.error(`Failed to add supplier: ${err.message || JSON.stringify(err)}`);
      return false;
    }
  };

  const updateSupplier = async (id: string, updates: Partial<Supplier>): Promise<boolean> => {
    try {
      const docRef = doc(db, 'suppliers', id);
      const dbUpdates: any = { ...updates };

      await updateDoc(docRef, dbUpdates);
      return true;
    } catch (err: any) {
      console.error('Error updating supplier:', err);
      toast.error(err.message || 'Failed to update supplier');
      return false;
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'suppliers', id));
    } catch (err) {
      console.error('Error deleting supplier:', err);
      toast.error('Failed to delete supplier');
    }
  };

  return (
    <SupplierContext.Provider value={{ suppliers, addSupplier, updateSupplier, deleteSupplier }}>
      {children}
    </SupplierContext.Provider>
  );
};

export const useSuppliers = () => {
  const context = useContext(SupplierContext);
  if (context === undefined) {
    throw new Error('useSuppliers must be used within a SupplierProvider');
  }
  return context;
};