export type Role = 'ADMIN' | 'STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  minThreshold: number;
  supplier: string; // Storing name for simplicity to match MOCK_DATA
  imageUrl: string;
  lastUpdated: string;
}

export interface StockContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'lastUpdated'>) => Promise<boolean>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => void;
  stats: {
    totalValue: number;
    lowStockCount: number;
    totalItems: number;
    categoriesCount: number;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{success: boolean, message?: string}>;
  signup: (email: string, password: string, metadata?: any) => Promise<{success: boolean, message?: string}>;
  resetPassword: (email: string) => Promise<{success: boolean, message?: string}>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

export interface SupplierContextType {
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<boolean>;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<boolean>;
  deleteSupplier: (id: string) => void;
}

export interface AppConfig {
  appName: string;
  currency: string;
  themeColor: string;
  companyName: string;
  socialLinks: {
    twitter: string;
    linkedin: string;
    website: string;
  };
}

export enum ViewState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  SUPPLIERS = 'SUPPLIERS',
  CATEGORIES = 'CATEGORIES',
  SETTINGS = 'SETTINGS',
  STAFF = 'STAFF',
  PROFILE = 'PROFILE'
}
